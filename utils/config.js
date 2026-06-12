/**
 * 全局公共配置文件
 * 统一管理环境地址、账号密码等配置信息
 */

module.exports = {
  // 环境配置
  env: {
    baseUrl: 'https://dms11.kshop.cc/',
    timeout: 30000,
    actionTimeout: 10000,
  },

  // 测试账号配置
  auth: {
    username: '13546807367',
    password: '123456',
  },

  // 页面路径配置
  paths: {
    login: '/admin/login',
    home: '/',
    order: '/order',
    customer: '/customer',
    goods: '/goods',
  },

  // 选择器配置
  selectors: {
    // 登录页选择器
    login: {
      usernameInput: 'input[placeholder*="账号"], input[placeholder*="用户名"], input.el-input__inner',
      passwordInput: 'input[placeholder*="密码"], input[type="password"]',
      loginButton: '.el-button--primary',
      errorMessage: '.error-message, .el-message--error',
    },
    
    // 通用选择器
    common: {
      menuButton: '.menu-button',
      logoutButton: '.logout-button',
      successMessage: '.success-message',
      table: '.table',
      pagination: '.pagination',
      searchInput: '.search-input',
      searchButton: '.search-button',
      addButton: '.add-button',
      editButton: '.edit-button',
      deleteButton: '.delete-button',
      saveButton: '.save-button',
      cancelButton: '.cancel-button',
      confirmButton: '.confirm-button',
      modal: '.modal',
      modalTitle: '.modal-title',
      modalContent: '.modal-content',
    },
  },

  // 测试数据配置
  testData: {
    // 订单测试数据
    order: {
      orderNo: 'TEST' + Date.now(),
      customerName: '测试客户',
      goodsName: '测试商品',
      quantity: 10,
      price: 100,
    },
    
    // 客户测试数据
    customer: {
      name: '测试客户' + Date.now(),
      phone: '13800138000',
      address: '测试地址',
      contact: '测试联系人',
    },
    
    // 商品测试数据
    goods: {
      name: '测试商品' + Date.now(),
      code: 'GOODS' + Date.now(),
      price: 99.99,
      stock: 100,
      category: '测试分类',
    },
  },

  // 截图配置
  screenshot: {
    path: 'reports/screenshots',
    fullPage: true,
  },

  // 报告配置
  report: {
    html: 'reports/html-report',
    json: 'reports/test-results.json',
  },
};