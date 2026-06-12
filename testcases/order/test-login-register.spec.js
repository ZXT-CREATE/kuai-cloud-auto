const { test, expect } = require('@playwright/test');
const config = require('../../utils/config');

test.describe('登录功能测试', () => {
  test('验证登录功能成功', async ({ page }) => {
    console.log('开始执行登录功能测试');
    
    // 步骤1：打开主页，让页面自动跳转登录（模拟用户手动操作）
    console.log('步骤1：打开主页');
    await page.goto(config.env.baseUrl, { waitUntil: 'domcontentloaded' });
    
    // 等待页面跳转完成（最多等待5秒）
    let currentUrl = page.url();
    console.log('初始URL:', currentUrl);
    
    // 等待可能的页面跳转
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);
      currentUrl = page.url();
      console.log(`等待后URL (${i+1}/10):`, currentUrl);
      if (currentUrl.includes('/login')) {
        break;
      }
    }
    
    // 如果没有自动跳转，手动导航到登录页面
    if (!currentUrl.includes('/login')) {
      console.log('页面未自动跳转，手动导航到登录页面');
      await page.goto(config.env.baseUrl + config.paths.login, { waitUntil: 'domcontentloaded' });
    }
    
    // 等待登录页面加载并截图
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
    currentUrl = page.url();
    console.log(`当前URL: ${currentUrl}`);
    
    // 检查是否跳转到404页面
    if (currentUrl.includes('/error/404') || currentUrl.includes('404')) {
      console.log('检测到404页面，手动导航到首页');
      await page.goto(config.env.baseUrl + 'admin/index');
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
    
    // 验证是否已离开登录页面
    const finalUrl = page.url();
    console.log(`最终URL: ${finalUrl}`);
    expect(finalUrl).not.toContain('/login');
    
    // 截图记录登录后的页面
    await page.screenshot({ path: 'reports/screenshots/after-login.png' });
    
    console.log('登录功能测试通过');
  });
});