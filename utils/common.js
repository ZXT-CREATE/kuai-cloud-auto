/**
 * 公共工具方法
 * 提供通用的测试辅助方法
 */

const config = require('./config');
const fs = require('fs');
const path = require('path');

/**
 * 等待元素可见
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @param {number} timeout - 超时时间（毫秒）
 */
async function waitForElementVisible(page, selector, timeout = config.env.actionTimeout) {
  await page.waitForSelector(selector, { 
    state: 'visible', 
    timeout: timeout 
  });
}

/**
 * 等待元素可点击
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @param {number} timeout - 超时时间（毫秒）
 */
async function waitForElementClickable(page, selector, timeout = config.env.actionTimeout) {
  await page.waitForSelector(selector, { 
    state: 'attached', 
    timeout: timeout 
  });
}

/**
 * 安全点击元素
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 */
async function safeClick(page, selector) {
  await waitForElementClickable(page, selector);
  await page.click(selector);
}

/**
 * 安全填写输入框
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @param {string} value - 填写值
 */
async function safeFill(page, selector, value) {
  await waitForElementVisible(page, selector);
  await page.fill(selector, value);
}

/**
 * 获取元素文本
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @returns {string} 元素文本内容
 */
async function getElementText(page, selector) {
  await waitForElementVisible(page, selector);
  const element = await page.$(selector);
  return await element.textContent();
}

/**
 * 检查元素是否存在
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @returns {boolean} 元素是否存在
 */
async function isElementExists(page, selector) {
  const element = await page.$(selector);
  return element !== null;
}

/**
 * 检查元素是否可见
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 * @returns {boolean} 元素是否可见
 */
async function isElementVisible(page, selector) {
  try {
    await page.waitForSelector(selector, { 
      state: 'visible', 
      timeout: 5000 
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 等待消息提示
 * @param {Page} page - Playwright页面对象
 * @param {string} messageType - 消息类型（success/error/info）
 * @param {number} timeout - 超时时间（毫秒）
 */
async function waitForMessage(page, messageType = 'success', timeout = config.env.actionTimeout) {
  const messageSelector = `.${messageType}-message`;
  await waitForElementVisible(page, messageSelector, timeout);
  const messageText = await getElementText(page, messageSelector);
  console.log(`${messageType}消息: ${messageText}`);
  return messageText;
}

/**
 * 截图保存
 * @param {Page} page - Playwright页面对象
 * @param {string} filename - 文件名
 * @param {boolean} fullPage - 是否全页截图
 */
async function takeScreenshot(page, filename, fullPage = config.screenshot.fullPage) {
  const screenshotDir = config.screenshot.path;
  
  // 确保截图目录存在
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  const filepath = path.join(screenshotDir, `${filename}.png`);
  await page.screenshot({ 
    path: filepath, 
    fullPage: fullPage 
  });
  
  console.log(`截图已保存: ${filepath}`);
  return filepath;
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成随机数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机数字
 */
function generateRandomNumber(min = 1, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成当前时间戳字符串
 * @returns {string} 时间戳字符串
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * 等待网络请求完成
 * @param {Page} page - Playwright页面对象
 * @param {number} timeout - 超时时间（毫秒）
 */
async function waitForNetworkIdle(page, timeout = config.env.timeout) {
  await page.waitForLoadState('networkidle', { timeout: timeout });
}

/**
 * 重试操作
 * @param {Function} operation - 要执行的操作
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delay - 重试延迟（毫秒）
 * @returns {any} 操作结果
 */
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`操作失败，第${i + 1}次重试...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * 清空输入框
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 */
async function clearInput(page, selector) {
  await waitForElementVisible(page, selector);
  await page.fill(selector, '');
}

/**
 * 选择下拉框选项
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 下拉框选择器
 * @param {string} value - 选项值
 */
async function selectOption(page, selector, value) {
  await waitForElementVisible(page, selector);
  await page.selectOption(selector, value);
}

/**
 * 上传文件
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 文件输入选择器
 * @param {string} filePath - 文件路径
 */
async function uploadFile(page, selector, filePath) {
  await waitForElementVisible(page, selector);
  await page.setInputFiles(selector, filePath);
}

/**
 * 滚动到元素
 * @param {Page} page - Playwright页面对象
 * @param {string} selector - 元素选择器
 */
async function scrollToElement(page, selector) {
  await page.waitForSelector(selector);
  await page.$eval(selector, element => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/**
 * 获取表格数据
 * @param {Page} page - Playwright页面对象
 * @param {string} tableSelector - 表格选择器
 * @returns {Array} 表格数据
 */
async function getTableData(page, tableSelector = config.selectors.common.table) {
  await waitForElementVisible(page, tableSelector);
  
  const rows = await page.$$(`${tableSelector} tbody tr`);
  const tableData = [];
  
  for (const row of rows) {
    const cells = await row.$$eval('td', cells => 
      cells.map(cell => cell.textContent.trim())
    );
    tableData.push(cells);
  }
  
  return tableData;
}

module.exports = {
  waitForElementVisible,
  waitForElementClickable,
  safeClick,
  safeFill,
  getElementText,
  isElementExists,
  isElementVisible,
  waitForMessage,
  takeScreenshot,
  generateRandomString,
  generateRandomNumber,
  generateTimestamp,
  waitForNetworkIdle,
  retryOperation,
  clearInput,
  selectOption,
  uploadFile,
  scrollToElement,
  getTableData,
};