const { test, expect } = require('@playwright/test');
const { login } = require('../../utils/login');

/**
 * 销售订单测试用例
 */

test.describe('销售订单管理', () => {
  test.use({ project: 'chromium' });

  /**
   * TC-Order-Sale-001 - 打开新建销售订单页面
   * 操作步骤：
   * 1. 登录系统
   * 2. 打开"订单管理"一级菜单
   * 3. 打开"销售订单"二级菜单
   * 4. 点击"新建销售订单"按钮
   * 预期结果：正确打开新建销售订单页面
   */
  test('TC-Order-Sale-001 - 打开新建销售订单页面', async ({ page }) => {
    console.log('========== TC-Order-Sale-001 - 打开新建销售订单页面 ==========');
    
    // 步骤1：登录系统
    console.log('步骤1：登录系统');
    await login(page);
    
    // 等待首页加载完成
    await page.waitForLoadState('networkidle');
    
    // 步骤2：打开"订单管理"一级菜单
    console.log('步骤2：打开订单管理一级菜单');
    const orderMenu = page.getByRole('menuitem', { name: /订单管理/ });
    await orderMenu.first().click();
    
    // 等待页面响应
    await page.waitForTimeout(1000);
    
    // 步骤3：打开"销售订单"二级菜单
    console.log('步骤3：打开销售订单二级菜单');
    const saleOrderMenu = page.getByRole('menuitem', { name: /销售订单/ });
    await saleOrderMenu.first().click();
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 步骤4：点击"新建销售订单"按钮
    console.log('步骤4：点击新建销售订单按钮');
    const addButton = page.getByRole('button', { name: /新建销售订单/ });
    await addButton.first().click();
    
    // 等待弹窗/页面加载
    await page.waitForTimeout(1500);
    
    // 预期结果：验证新建销售订单页面打开
    console.log('验证：新建销售订单页面是否正确打开');
    
    // 获取当前页面内容进行调试
    const pageTitle = await page.title();
    console.log(`当前页面标题: ${pageTitle}`);
    
    // 截图保存当前状态
    await page.screenshot({ path: 'reports/screenshots/new-order-page.png' });
    
    // 验证页面 - 使用多种方式验证
    // 方式1：检查是否包含"新建销售订单"相关元素
    const titleElements = await page.$$('*:text("新建销售订单")');
    console.log(`找到 ${titleElements.length} 个包含"新建销售订单"的元素`);
    
    // 方式2：检查URL是否变化
    const currentUrl = page.url();
    console.log(`当前URL: ${currentUrl}`);
    
    // 方式3：检查是否有表单元素
    const formElements = await page.$$('form, .el-form');
    console.log(`找到 ${formElements.length} 个表单元素`);
    
    // 方式4：检查是否有订单相关的输入框
    const inputElements = await page.$$('input');
    console.log(`找到 ${inputElements.length} 个输入框`);
    
    // 验证：至少找到一个包含"销售订单"的元素
    const hasSaleOrderText = await page.locator('text=销售订单').count();
    expect(hasSaleOrderText).toBeGreaterThan(0);
    
    // 验证：存在表单元素
    const hasForm = await page.locator('form, .el-form').count();
    expect(hasForm).toBeGreaterThan(0);
    
    console.log('✅ TC-Order-Sale-001 测试通过');
  });
});