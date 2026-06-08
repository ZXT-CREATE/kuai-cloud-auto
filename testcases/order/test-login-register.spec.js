const { test, expect } = require('@playwright/test');
const config = require('../../utils/config');

test.describe('登录功能测试', () => {
  test('验证登录功能成功', async ({ page }) => {
    console.log('开始执行登录功能测试');
    
    // 步骤1：打开登录页面
    console.log('步骤1：打开网页地址');
    await page.goto(config.env.baseUrl + config.paths.login, { waitUntil: 'domcontentloaded' });
    
    // 等待页面加载并截图
    await page.waitForSelector('input[placeholder*="账号"]', { timeout: 10000 });
    await page.screenshot({ path: 'reports/screenshots/login-page.png' });
    
    // 步骤2：输入账号
    console.log('步骤2：输入账号');
    await page.fill('input[placeholder*="账号"]', config.auth.username);
    
    // 步骤3：输入密码
    console.log('步骤3：输入密码');
    await page.fill('input[placeholder*="密码"]', config.auth.password);
    
    // 步骤4：点击登录按钮
    console.log('步骤4：点击登录按钮');
    await Promise.all([
      page.waitForNavigation({ timeout: 30000 }),
      page.click('.el-button--primary')
    ]);
    
    // 验证登录结果
    console.log('验证登录结果');
    const currentUrl = page.url();
    console.log(`当前URL: ${currentUrl}`);
    
    // 验证是否已离开登录页面
    expect(currentUrl).not.toContain('/login');
    
    // 截图记录登录后的页面
    await page.screenshot({ path: 'reports/screenshots/after-login.png' });
    
    console.log('登录功能测试通过');
  });
});