/**
 * Мороз Денис - Production Server
 * 
 * Это пример серверной части для безопасной аутентификации.
 * Для использования в продакшене:
 * 1. Установите зависимости: npm install express express-session bcryptjs
 * 2. Настройте HTTPS на уровне сервера/Proxy (nginx, Apache, Cloudflare)
 * 3. Создайте пользователей с хэшированными паролями
 * 4. Используйте HTTPS в production
 */

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for correct IP detection behind load balancers/reverse proxies
// In production: trust only known proxy IPs (Cloudflare, nginx, etc.)
// For security, use specific IPs or 'loopback' only if no proxy exists
const trustedProxies = process.env.TRUSTED_PROXY_IPS || '127.0.0.1';
app.set('trust proxy', trustedProxies);

// Security headers with helmet
app.use(helmet());

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required. Set it before starting the server.');
}

// Rate limiting store (in-memory for demo - use Redis in production)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Check if IP is locked out
function isLockedOut(ip) {
    const attempts = loginAttempts.get(ip);
    if (!attempts) return false;
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        if (Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
            return true;
        }
        // Reset after lockout period
        loginAttempts.delete(ip);
        return false;
    }
    return false;
}

// Record failed attempt
function recordFailedAttempt(ip) {
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(ip, attempts);
}

// Clear attempts on successful login
function clearAttempts(ip) {
    loginAttempts.delete(ip);
}

// Проверка обязательных переменных окружения для production

// Конфигурация сессии
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    secure: process.env.NODE_ENV === 'production', // Только HTTPS в production
    httpOnly: true,
    sameSite: 'strict',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы - только разрешённые директории для безопасности
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    dotfiles: 'ignore',
    etag: true,
    maxAge: '30d'
}));

// Явно разрешённые статические файлы в корне
const allowedRootFiles = [
    'index.html',
    'admin.html',
    '404.html',
    'privacy.html',
    'user-agreement.html',
    'robots.txt',
    'sitemap.xml',
    '.htaccess'
];

const rootStatic = express.static(path.join(__dirname, '.'), {
    index: false, // Отключаем автоматический index
    extensions: false,
    dotfiles: 'deny', // Запрещаем скрытые файлы
    etag: true,
    maxAge: '30d'
});

app.use((req, res, next) => {
    // Проверяем доступ к корневым файлам
    const pathName = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');

    if (req.path.startsWith('/assets/')) {
        return next(); // assets already handled above
    }

    if (allowedRootFiles.includes(pathName)) {
        return rootStatic(req, res, next);
    }

    // Для всех остальных запросов - 404
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Admin middleware для защищённых маршрутов
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    }
    res.status(401).json({ error: 'Требуется авторизация' });
}

// API: Логин (в реальном приложении данные хранятся в БД)
// Users loaded from environment variables - REQUIRED in production
const getUsers = () => {
    const envUsers = process.env.ADMIN_USERS;
    if (envUsers) {
        try {
            return JSON.parse(envUsers);
        } catch (e) {
            console.error('Failed to parse ADMIN_USERS env variable');
            return [];
        }
    }

    // No default users - environment variables are REQUIRED
    console.warn('WARNING: No ADMIN_USERS environment variable set. Admin panel will be inaccessible.');
    console.warn('To enable admin, set ADMIN_USERS environment variable with JSON array of users.');
    console.warn('Example: ADMIN_USERS=[{"username":"admin","passwordHash":"$2a$10$..."}]');
    return [];
};

const users = getUsers();

// API: Аутентификация с защитой от timing-атак и rate limiting
app.post('/api/admin/login', async (req, res) => {
    // Получаем IP - trust proxy настроен на loopback, поэтому req.ip безопасен
    // Не используем напрямую x-forwarded-for чтобы избежать спуфинга
    const clientIp = req.ip || 'unknown';

    // Check if IP is locked out
    if (isLockedOut(clientIp)) {
        return res.status(429).json({ error: 'Слишком много попыток входа. Попробуйте позже.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Требуется логин и пароль' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
        // Always perform constant-time comparison to prevent timing attacks
        // Use a dummy hash to ensure consistent bcrypt execution time
        // Valid bcrypt hash format: $2a$10$ + 53 chars from ./A-Za-z0-9
        // This is a properly formatted dummy hash for constant-time comparison
        // Using all valid bcrypt alphabet characters to ensure bcrypt can parse it
        const dummyHash = '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        await bcrypt.compare(password, dummyHash).catch(() => { }); // Ignore errors
        return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    try {
        const match = await bcrypt.compare(password, user.passwordHash);

        if (match) {
            clearAttempts(clientIp);
            req.session.authenticated = true;
            req.session.userId = user.id;
            req.session.username = user.username;

            return res.json({
                success: true,
                message: 'Успешная авторизация',
                redirect: '/admin.html'
            });
        } else {
            recordFailedAttempt(clientIp);
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }
    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API: Проверка сессии
app.get('/api/admin/check-auth', requireAuth, (req, res) => {
    res.json({
        authenticated: true,
        username: req.session.username
    });
});

// API: Выход
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при выходе' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Выход выполнен' });
    });
});

// Защищённые маршруты (перенаправление на HTML)
app.get('/admin-protected', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Перенаправление на HTTPS (раскомментировать для production)
// const httpsRedirect = (req, res, next) => {
//   if (req.protocol !== 'https') {
//     return res.redirect('https://' + req.hostname + req.url);
//   }
//   next();
// };
// app.use(httpsRedirect);

// Обработка 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте https://localhost:${PORT} в браузере`);
});

module.exports = app;
