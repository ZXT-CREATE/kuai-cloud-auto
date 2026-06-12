/**
 * 统一登录方法
 * 封装登录逻辑，供所有测试用例使用
 */

const config = require('./config');

/**
 * 执行登录操作
 * @param {Page} page - Playwright页面对象
 * @param {string} username - 用户名（可选，默认使用配置文件中的用户名）
 * @param {string} password - 密码（可选，默认使用配置文件中的密码）
 */
async function login(page, username = config.auth.username, password = config.auth.password) {
  try {
    console.log(`开始登录，用户名: ${username}`);
    
    // 访问登录页面
    await page.goto(config.env.baseUrl + config.paths.login);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 输入用户名
    await page.fill(config.selectors.login.usernameInput, username);
    
    // 输入密码
    await page.fill(config.selectors.login.passwordInput, password);
    
    // 点击登录按钮
    await page.click(config.selectors.login.loginButton);
    
    // 等待登录成功，使用Promise.race同时等待导航和页面元素
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: config.env.timeout }),
        page.waitForSelector('.el-menu', { timeout: config.env.timeout }),
        page.waitForSelector('text=首页', { timeout: config.env.timeout })
      ]);
    } catch (error) {
      // 如果导航等待失败，尝试等待页面稳定
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
    }
    
    console.log('登录成功');
    
    return true;
  } catch (error) {
    console.error('登录失败:', error.message);
    
    // 检查是否有错误消息
    const errorElement = await page.$(config.selectors.login.errorMessage);
    if (errorElement) {
      const errorText = await errorElement.textContent();
      console.error('错误消息:', errorText);
    }
    
    throw new Error(`登录失败: ${error.message}`);
  }
}

/**
 * 验证登录状态
 * @param {Page} page - Playwright页面对象
 * @returns {boolean} 是否已登录
 */
async function isLoggedIn(page) {
  try {
    // 检查当前URL是否为首页或其他需要登录的页面
    const currentUrl = page.url();
    return currentUrl.includes(config.env.baseUrl) && !currentUrl.includes('/login');
  } catch (error) {
    return false;
  }
}

/**
 * 登出操作
 * @param {Page} page - Playwright页面对象
 */
async function logout(page) {
  try {
    console.log('开始登出');
    
    // 点击登出按钮
    await page.click(config.selectors.common.logoutButton);
    
    // 等待跳转到登录页面
    await page.waitForURL(config.env.baseUrl + config.paths.login, { timeout: config.env.timeout });
    
    console.log('登出成功');
    
    return true;
  } catch (error) {
    console.error('登出失败:', error.message);
    throw new Error(`登出失败: ${error.message}`);
  }
}

module.exports = {
  login,
  isLoggedIn,
  logout,
};