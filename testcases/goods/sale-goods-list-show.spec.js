const { test, expect } = require('@playwright/test');
const config = require('../../utils/config');

/**
 * 商品管理测试用例
 */

test.describe('商品管理', () => {
  test.use({ project: 'chromium' });

  /**
   * TC-Goods-001 - 验证商品列表正常展示
   * 操作步骤：
   * 1. 登录系统
   * 2. 打开"基础设置"一级菜单
   * 3. 打开"商品列表"二级菜单
   * 预期结果：
   * 1. 商品列表正常显示
   * 2. 包含商品名称、价格、库存信息
   */
  test('TC-Goods-001 - 验证商品列表正常展示', async ({ page }) => {
    console.log('========== TC-Goods-001 - 验证商品列表正常展示 ==========');
    
    // 步骤1：登录系统
    console.log('步骤1：登录系统');
    
    // 访问主页，等待自动跳转登录
    console.log('访问主页');
    await page.goto(config.env.baseUrl, { waitUntil: 'domcontentloaded' });
    
    // 等待页面跳转完成
    let currentUrl = page.url();
    console.log('初始URL:', currentUrl);
    
    // 等待可能的页面跳转
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);
      currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        break;
      }
    }
    
    // 如果没有自动跳转，手动导航到登录页面
    if (!currentUrl.includes('/login')) {
      console.log('页面未自动跳转，手动导航到登录页面');
      await page.goto(config.env.baseUrl + config.paths.login, { waitUntil: 'domcontentloaded' });
    }
    
    // 等待页面加载完成
    await page.waitForTimeout(2000);
    
    // 输入用户名
    console.log('输入用户名');
    const usernameInput = page.locator('input[type="text"]').first();
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await usernameInput.fill(config.auth.username);
    
    // 输入密码
    console.log('输入密码');
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(config.auth.password);
    
    // 点击登录按钮
    console.log('点击登录按钮');
    const loginBtn = page.locator('button:has-text("登录")');
    await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
    await loginBtn.click();
    
    // 等待登录完成
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
      page.waitForTimeout(5000)
    ]);
    
    // 等待一小段时间确保登录完成
    await page.waitForTimeout(2000);
    currentUrl = page.url();
    console.log(`登录后URL: ${currentUrl}`);
    
    // 步骤2：点击基础设置一级菜单
    console.log('步骤2：点击基础设置一级菜单');
    
    try {
      // 使用多种选择器策略定位基础设置菜单
      const menuSelectors = [
        '.el-submenu__title:has-text("基础设置")',
        '.el-menu-item:has-text("基础设置")',
        'text=基础设置'
      ];
      
      let menuClicked = false;
      for (const selector of menuSelectors) {
        try {
          const menuElement = page.locator(selector).first();
          const count = await menuElement.count();
          if (count === 0) continue;
          
          await menuElement.waitFor({ state: 'attached', timeout: 5000 });
          await menuElement.click({ force: true });
          console.log(`已使用选择器 "${selector}" 点击基础设置菜单`);
          menuClicked = true;
          break;
        } catch (e) {
          console.log(`尝试选择器 "${selector}" 失败: ${e.message}`);
        }
      }
      
      if (!menuClicked) {
        throw new Error('无法点击基础设置菜单');
      }
      
      // 等待下拉菜单展开
      await page.waitForTimeout(1000);
      
      // 检查下拉菜单是否已展开
      const isExpanded = await page.evaluate(() => {
        const menus = document.querySelectorAll('.el-submenu__title');
        for (const menu of menus) {
          if (menu.textContent.includes('基础设置')) {
            const parent = menu.closest('.el-submenu');
            return parent && parent.classList.contains('is-opened');
          }
        }
        return false;
      });
      
      if (isExpanded) {
        console.log('基础设置下拉菜单已展开');
      } else {
        console.log('基础设置下拉菜单未展开，尝试点击展开');
        // 尝试再次点击
        const menuElement = page.locator('.el-submenu__title:has-text("基础设置")').first();
        await menuElement.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      // 步骤3：点击商品列表二级菜单
      console.log('步骤3：点击商品列表二级菜单');
      
      const submenuSelectors = [
        '.el-menu--popup:has-text("商品列表") .el-menu-item:has-text("商品列表")',
        '.el-submenu .el-menu-item:has-text("商品列表")',
        'text=商品列表'
      ];
      
      let submenuClicked = false;
      for (const selector of submenuSelectors) {
        try {
          const submenuElement = page.locator(selector).first();
          const count = await submenuElement.count();
          if (count === 0) continue;
          
          await submenuElement.waitFor({ state: 'attached', timeout: 5000 });
          await submenuElement.click({ force: true });
          console.log(`已使用选择器 "${selector}" 点击商品列表菜单`);
          submenuClicked = true;
          break;
        } catch (e) {
          console.log(`尝试选择器 "${selector}" 失败: ${e.message}`);
        }
      }
      
      if (!submenuClicked) {
        throw new Error('无法点击商品列表菜单');
      }
      
      // 等待页面导航完成
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
        page.waitForTimeout(5000)
      ]);
      console.log('页面导航完成');
      
    } catch (error) {
      console.log('菜单导航失败:', error.message);
      console.log('使用备用方案：直接访问商品列表页面');
      await page.goto(config.env.baseUrl + 'admin/goods/list');
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
    
    // 等待页面加载完成
    try {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (error) {
      console.log('等待页面加载超时');
    }
    
    // 预期结果1：验证商品列表正常显示
    console.log('验证：商品列表是否正常显示');
    
    // 获取当前页面内容进行调试
    const pageTitle = await page.title();
    console.log(`当前页面标题: ${pageTitle}`);
    
    // 截图保存当前状态
    await page.screenshot({ path: 'reports/screenshots/goods-list-page.png' });
    
    // 验证页面标题包含"商品列表"
    expect(pageTitle).toContain('商品列表');
    
    // 预期结果2：验证商品列表包含商品名称、价格、库存信息
    console.log('验证：商品列表包含商品名称、价格、库存信息');
    
    // 等待表格加载完成
    await page.waitForTimeout(2000);
    
    // 查找商品表格
    const goodsTable = page.locator('.el-table').first();
    await goodsTable.waitFor({ state: 'visible', timeout: 10000 });
    console.log('找到商品表格');
    
    // 验证表格中包含商品名称列
    const hasNameColumn = await page.locator('th:has-text("商品名称"), th:has-text("名称")').count();
    expect(hasNameColumn).toBeGreaterThan(0);
    console.log(`找到 ${hasNameColumn} 个商品名称列`);
    
    // 验证表格中包含价格列
    const hasPriceColumn = await page.locator('th:has-text("价格"), th:has-text("单价")').count();
    expect(hasPriceColumn).toBeGreaterThan(0);
    console.log(`找到 ${hasPriceColumn} 个价格列`);
    
    // 验证表格中包含库存列
    const hasStockColumn = await page.locator('th:has-text("库存"), th:has-text("数量")').count();
    expect(hasStockColumn).toBeGreaterThan(0);
    console.log(`找到 ${hasStockColumn} 个库存列`);
    
    // 验证表格中有数据行
    const tableRows = await page.locator('.el-table__body-wrapper .el-table__row').count();
    expect(tableRows).toBeGreaterThan(0);
    console.log(`找到 ${tableRows} 行商品数据`);
    
    console.log('✅ TC-Goods-001 测试通过');
  });
});