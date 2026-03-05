// Мороз Денис Admin Panel - JavaScript

// ===== Style Protection =====
// REMOVED: Blocking matchMedia caused accessibility issues
// The admin panel uses its own dark theme regardless of system preferences

// Make objects global for inline event handlers
window.App = null;
window.Modal = null;
window.Toast = null;
window.DB = null;

// ===== Cookie Banner =====
function initCookieBanner() {
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (!cookieBanner) return;

  // Check if user already made a choice
  const consent = localStorage.getItem('cookieConsent');
  if (consent) {
    return; // Don't show banner
  }

  // Show banner after delay
  setTimeout(function () {
    cookieBanner.classList.add('active');
  }, 2000);

  // Accept button handler
  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('active');
    });
  }

  // Decline button handler
  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('active');
    });
  }
}

window.initCookieBanner = initCookieBanner;

// ===== Data Storage (Local Storage) =====
const DB = {
  // Initialize data from localStorage or use defaults
  init() {
    if (!localStorage.getItem('adminProducts')) {
      localStorage.setItem('adminProducts', JSON.stringify(this.getDefaultProducts()));
    }
    if (!localStorage.getItem('adminCategories')) {
      localStorage.setItem('adminCategories', JSON.stringify(this.getDefaultCategories()));
    }
    if (!localStorage.getItem('adminBrands')) {
      localStorage.setItem('adminBrands', JSON.stringify(this.getDefaultBrands()));
    }
  },

  getDefaultProducts() {
    return [
      { id: 1, sku: 'BOS-001', name: 'Bosch Фильтр масляный', category: 'filters', brand: 'bosch', price: 890, image: 'assets/img/bosh.png' },
      { id: 2, sku: 'BOS-002', name: 'Bosch Фильтр воздушный', category: 'filters', brand: 'bosch', price: 1250, image: 'assets/img/bosh.png' },
      { id: 3, sku: 'BRE-001', name: 'Brembo Колодки тормозные передние', category: 'brakes', brand: 'brembo', price: 4500, image: 'assets/img/brembo.png' },
      { id: 4, sku: 'BRE-002', name: 'Brembo Диск тормозной', category: 'brakes', brand: 'brembo', price: 6800, image: 'assets/img/brembo.png' },
      { id: 5, sku: 'CAS-001', name: 'Castrol Magnatec 5W-30', category: 'oils', brand: 'castrol', price: 2100, image: 'assets/img/castrol.png' },
      { id: 6, sku: 'CAS-002', name: 'Castrol Edge 5W-40', category: 'oils', brand: 'castrol', price: 2800, image: 'assets/img/castrol.png' },
      { id: 7, sku: 'KYB-001', name: 'KYB Амортизатор передний', category: 'suspension', brand: 'kyaba', price: 7500, image: 'assets/img/kyaba.png' },
      { id: 8, sku: 'MAN-001', name: 'Mann Фильтр салонный', category: 'filters', brand: 'mann', price: 680, image: 'assets/img/mann.png' },
      { id: 9, sku: 'NGK-001', name: 'NGK Свечи зажигания (комплект)', category: 'ignition', brand: 'ngk', price: 2400, image: 'assets/img/NGK.png' },
      { id: 10, sku: 'TRW-001', name: 'TRW Суппорт тормозной', category: 'brakes', brand: 'trw', price: 8900, image: 'assets/img/TRW.png' }
    ];
  },

  getDefaultCategories() {
    return [
      { id: 1, name: 'Фильтры', icon: 'fa-filter', slug: 'filters' },
      { id: 2, name: 'Тормоза', icon: 'fa-circle', slug: 'brakes' },
      { id: 3, name: 'Масла', icon: 'fa-oil-can', slug: 'oils' },
      { id: 4, name: 'Аккумуляторы', icon: 'fa-car-battery', slug: 'batteries' },
      { id: 5, name: 'Подвеска', icon: 'fa-cogs', slug: 'suspension' },
      { id: 6, name: 'Зажигание', icon: 'fa-bolt', slug: 'ignition' }
    ];
  },

  getDefaultBrands() {
    return [
      { id: 1, name: 'Bosch', logo: 'assets/img/bosh.png' },
      { id: 2, name: 'Brembo', logo: 'assets/img/brembo.png' },
      { id: 3, name: 'Castrol', logo: 'assets/img/castrol.png' },
      { id: 4, name: 'KYB', logo: 'assets/img/kyaba.png' },
      { id: 5, name: 'Mann', logo: 'assets/img/mann.png' },
      { id: 6, name: 'Valeo', logo: 'assets/img/valeo.png' },
      { id: 7, name: 'NGK', logo: 'assets/img/NGK.png' },
      { id: 8, name: 'TRW', logo: 'assets/img/TRW.png' }
    ];
  },

  getProducts() {
    return JSON.parse(localStorage.getItem('adminProducts')) || [];
  },

  getCategories() {
    return JSON.parse(localStorage.getItem('adminCategories')) || [];
  },

  getBrands() {
    return JSON.parse(localStorage.getItem('adminBrands')) || [];
  },

  saveProducts(products) {
    localStorage.setItem('adminProducts', JSON.stringify(products));
  }
};

window.DB = DB;

// ===== Toast Notifications =====
const Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    toast.innerHTML = `
      <i class="fas ${icons[type]} toast-icon"></i>
    `;

    // Use textContent for message to prevent XSS
    const msgSpan = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = function () { toast.remove(); };

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
};

window.Toast = Toast;

// ===== Sanitization Helper =====
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Modal =====
const Modal = {
  show(title, content, onSave = null) {
    document.getElementById('modalTitle').textContent = title;

    // Use textContent for body if content is plain text, otherwise sanitize
    const modalBody = document.getElementById('modalBody');
    if (content.includes('<')) {
      // If content contains HTML, escape first then allow safe tags
      // Only allow form elements, inputs, selects, labels - no script/style tags
      const safeContent = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
        .replace(/on\w+='[^']*'/gi, '');
      modalBody.innerHTML = safeContent;
    } else {
      // If plain text, use textContent for security
      modalBody.textContent = content;
    }

    const modal = document.getElementById('modal');
    modal.classList.add('show');

    // Reset footer display
    document.getElementById('modalFooter').style.display = 'flex';

    if (onSave) {
      document.getElementById('modalSave').onclick = onSave;
    }
  },

  hide() {
    document.getElementById('modal').classList.remove('show');
  }
};

window.Modal = Modal;

// ===== App =====
const App = {
  currentPage: 'products',

  init() {
    DB.init();
    this.bindEvents();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    initCookieBanner();
  },

  bindEvents() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      Auth.logout();
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('show');
    });

    // Navigation
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.navigateTo(page);
      });
    });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', () => {
      Modal.hide();
    });

    document.getElementById('modalCancel').addEventListener('click', () => {
      Modal.hide();
    });

    // Search inputs
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
      productSearch.addEventListener('input', (e) => {
        this.filterProducts(e.target.value);
      });
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        this.showAddProductModal();
      });
    }

    // Save settings
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }
  },

  navigateTo(page) {
    // Update navigation
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === page) {
        item.classList.add('active');
      }
    });

    // Update page
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
      p.classList.remove('active');
    });

    const pageElement = document.getElementById('page-' + page);
    if (pageElement) {
      pageElement.classList.add('active');
    }

    // Update title
    const titles = {
      products: 'Товары',
      categories: 'Категории',
      brands: 'Бренды',
      settings: 'Настройки'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    this.currentPage = page;

    // Load page data
    switch (page) {
      case 'products':
        this.loadProducts();
        break;
      case 'categories':
        this.loadCategories();
        break;
      case 'brands':
        this.loadBrands();
        break;
    }

    // Close mobile menu
    document.getElementById('sidebar').classList.remove('show');
  },

  updateTime() {
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
      timeEl.textContent = now.toLocaleDateString('ru-RU', options);
    }
  },

  // Products
  loadProducts() {
    const products = DB.getProducts();
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Use escapeHtml to prevent XSS attacks
    tbody.innerHTML = products.map(product => `
      <tr>
        <td><input type="checkbox"></td>
        <td>${escapeHtml(product.sku)}</td>
        <td><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.src='assets/img/placeholder.jpg'"></td>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(this.getCategoryName(product.category))}</td>
        <td>${escapeHtml(this.getBrandName(product.brand))}</td>
        <td class="price">${this.formatPrice(product.price)}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" onclick="App.editProduct(${product.id})" title="Редактировать">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="App.deleteProduct(${product.id})" title="Удалить">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  filterProducts(search) {
    const products = DB.getProducts();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Use escapeHtml to prevent XSS attacks
    tbody.innerHTML = filtered.map(product => `
      <tr>
        <td><input type="checkbox"></td>
        <td>${escapeHtml(product.sku)}</td>
        <td><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.src='assets/img/placeholder.jpg'"></td>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(this.getCategoryName(product.category))}</td>
        <td>${escapeHtml(this.getBrandName(product.brand))}</td>
        <td class="price">${this.formatPrice(product.price)}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" onclick="App.editProduct(${product.id})" title="Редактировать">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="App.deleteProduct(${product.id})" title="Удалить">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  showAddProductModal() {
    const content = `
      <form id="productForm">
        <div class="form-group">
          <label>Название товара</label>
          <input type="text" id="productName" required>
        </div>
        <div class="form-group">
          <label>Артикул</label>
          <input type="text" id="productSku" required>
        </div>
        <div class="form-group">
          <label>Категория</label>
          <select id="productCategory" required>
            <option value="">Выберите категорию</option>
            <option value="filters">Фильтры</option>
            <option value="brakes">Тормоза</option>
            <option value="oils">Масла</option>
            <option value="batteries">Аккумуляторы</option>
            <option value="suspension">Подвеска</option>
            <option value="ignition">Зажигание</option>
          </select>
        </div>
        <div class="form-group">
          <label>Бренд</label>
          <select id="productBrand" required>
            <option value="">Выберите бренд</option>
            <option value="bosch">Bosch</option>
            <option value="brembo">Brembo</option>
            <option value="castrol">Castrol</option>
            <option value="kyaba">KYB</option>
            <option value="mann">Mann</option>
            <option value="ngk">NGK</option>
            <option value="trw">TRW</option>
          </select>
        </div>
        <div class="form-group">
          <label>Цена (₽)</label>
          <input type="number" id="productPrice" required>
        </div>
      </form>
    `;

    const _this = this;
    Modal.show('Добавить товар', content, function () { _this.saveProduct(); });
  },

  saveProduct() {
    const products = DB.getProducts();
    const newProduct = {
      id: Date.now(),
      sku: document.getElementById('productSku').value,
      name: document.getElementById('productName').value,
      category: document.getElementById('productCategory').value,
      brand: document.getElementById('productBrand').value,
      price: parseInt(document.getElementById('productPrice').value),
      image: 'assets/img/placeholder.jpg'
    };

    products.push(newProduct);
    DB.saveProducts(products);
    Modal.hide();
    this.loadProducts();
    Toast.show('Товар успешно добавлен', 'success');
  },

  editProduct(id) {
    const products = DB.getProducts();
    const product = products.find(p => p.id === id);

    if (!product) return;

    const content = `
      <form id="productForm">
        <div class="form-group">
          <label>Название товара</label>
          <input type="text" id="productName" value="${escapeHtml(product.name)}" required>
        </div>
        <div class="form-group">
          <label>Артикул</label>
          <input type="text" id="productSku" value="${escapeHtml(product.sku)}" required>
        </div>
        <div class="form-group">
          <label>Категория</label>
          <select id="productCategory" required>
            <option value="filters" ${product.category === 'filters' ? 'selected' : ''}>Фильтры</option>
            <option value="brakes" ${product.category === 'brakes' ? 'selected' : ''}>Тормоза</option>
            <option value="oils" ${product.category === 'oils' ? 'selected' : ''}>Масла</option>
            <option value="batteries" ${product.category === 'batteries' ? 'selected' : ''}>Аккумуляторы</option>
            <option value="suspension" ${product.category === 'suspension' ? 'selected' : ''}>Подвеска</option>
            <option value="ignition" ${product.category === 'ignition' ? 'selected' : ''}>Зажигание</option>
          </select>
        </div>
        <div class="form-group">
          <label>Бренд</label>
          <select id="productBrand" required>
            <option value="bosch" ${product.brand === 'bosch' ? 'selected' : ''}>Bosch</option>
            <option value="brembo" ${product.brand === 'brembo' ? 'selected' : ''}>Brembo</option>
            <option value="castrol" ${product.brand === 'castrol' ? 'selected' : ''}>Castrol</option>
            <option value="kyaba" ${product.brand === 'kyaba' ? 'selected' : ''}>KYB</option>
            <option value="mann" ${product.brand === 'mann' ? 'selected' : ''}>Mann</option>
            <option value="ngk" ${product.brand === 'ngk' ? 'selected' : ''}>NGK</option>
            <option value="trw" ${product.brand === 'trw' ? 'selected' : ''}>TRW</option>
          </select>
        </div>
        <div class="form-group">
          <label>Цена (₽)</label>
          <input type="number" id="productPrice" value="${product.price}" required>
        </div>
      </form>
    `;

    const _this = this;
    Modal.show('Редактировать товар', content, function () { _this.updateProduct(id); });
  },

  updateProduct(id) {
    const products = DB.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
      products[index] = {
        ...products[index],
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        price: parseInt(document.getElementById('productPrice').value)
      };

      DB.saveProducts(products);
      Modal.hide();
      this.loadProducts();
      Toast.show('Товар успешно обновлён', 'success');
    }
  },

  deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      let products = DB.getProducts();
      products = products.filter(p => p.id !== id);
      DB.saveProducts(products);
      this.loadProducts();
      Toast.show('Товар удалён', 'success');
    }
  },

  // Categories
  loadCategories() {
    const categories = DB.getCategories();
    const container = document.getElementById('categoriesGrid');
    if (!container) return;

    // Use escapeHtml to prevent XSS attacks
    container.innerHTML = categories.map(cat => `
      <div class="category-card">
        <div class="category-icon">
          <i class="fas ${escapeHtml(cat.icon)}"></i>
        </div>
        <div class="category-info">
          <div class="category-name">${escapeHtml(cat.name)}</div>
        </div>
        <div class="category-actions">
          <button class="action-btn edit" title="Редактировать">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" title="Удалить">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  // Brands
  loadBrands() {
    const brands = DB.getBrands();
    const container = document.getElementById('brandsGrid');
    if (!container) return;

    // Use escapeHtml to prevent XSS attacks
    container.innerHTML = brands.map(brand => `
      <div class="brand-card">
        <img src="${escapeHtml(brand.logo)}" alt="${escapeHtml(brand.name)}" class="brand-logo" onerror="this.style.display='none'">
        <div class="brand-name">${escapeHtml(brand.name)}</div>
        <div class="brand-actions">
          <button class="btn btn-sm btn-secondary" title="Редактировать">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" title="Удалить">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  // Settings
  saveSettings() {
    Toast.show('Настройки сохранены', 'success');
  },

  // Helpers
  formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  },

  getCategoryName(slug) {
    const names = {
      filters: 'Фильтры',
      brakes: 'Тормоза',
      oils: 'Масла',
      batteries: 'Аккумуляторы',
      suspension: 'Подвеска',
      ignition: 'Зажигание'
    };
    return names[slug] || slug;
  },

  getBrandName(slug) {
    const names = {
      bosch: 'Bosch',
      brembo: 'Brembo',
      castrol: 'Castrol',
      kyaba: 'KYB',
      mann: 'Mann',
      valeo: 'Valeo',
      ngk: 'NGK',
      trw: 'TRW'
    };
    return names[slug] || slug;
  }
};

window.App = App;

// ===== Auth =====
// SECURITY: This implementation uses server-side authentication
// The server API handles all authentication logic securely
// DEMO_MODE allows offline testing without a server

const DEMO_MODE = false; // Установите false для использования серверной аутентификации
const API_BASE = '/api';

const Auth = {
  isLoggedIn: false,

  checkAuth() {
    // Check server auth first
    fetch(`${API_BASE}/admin/check-auth`, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          this.isLoggedIn = true;
          document.getElementById('loginOverlay').classList.add('hidden');
        } else {
          this.isLoggedIn = false;
          document.getElementById('loginOverlay').classList.remove('hidden');
        }
      })
      .catch(() => {
        // Fallback to demo mode if server unavailable
        if (DEMO_MODE) {
          this.isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
          if (!this.isLoggedIn) {
            document.getElementById('loginOverlay').classList.remove('hidden');
          } else {
            document.getElementById('loginOverlay').classList.add('hidden');
          }
        } else {
          document.getElementById('loginOverlay').classList.remove('hidden');
        }
      });
  },

  login(username, password) {
    // Use server authentication
    fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.isLoggedIn = true;
          document.getElementById('loginOverlay').classList.add('hidden');
          Toast.show(data.message || 'Добро пожаловать!', 'success');
          App.init();
        } else {
          document.getElementById('loginError').classList.add('show');
          setTimeout(() => {
            document.getElementById('loginError').classList.remove('show');
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Ошибка входа:', error);

        // Fallback to demo mode
        if (DEMO_MODE) {
          this.isLoggedIn = true;
          localStorage.setItem('adminLoggedIn', 'true');
          document.getElementById('loginOverlay').classList.add('hidden');
          Toast.show('Добро пожаловать! (Демо-режим)', 'success');
          App.init();
        } else {
          document.getElementById('loginError').classList.add('show');
          setTimeout(() => {
            document.getElementById('loginError').classList.remove('show');
          }, 3000);
        }
      });
  },

  logout() {
    fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      credentials: 'same-origin'
    })
      .then(() => {
        this.isLoggedIn = false;
        document.getElementById('loginOverlay').classList.remove('hidden');
      })
      .catch(() => {
        // Fallback
        this.isLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        document.getElementById('loginOverlay').classList.remove('hidden');
      });
  }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
  // Bind login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Call login - it handles success/failure internally
      Auth.login(username, password);
    });
  }

  Auth.checkAuth();
  if (Auth.isLoggedIn) {
    App.init();
  }
});
