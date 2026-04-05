// tests/setup/global.setup.js
import { chromium } from '@playwright/test';
import { RegisterPage } from '../../src/pages/register.page.js';
import fs from 'fs';
import path from 'path';

export default async function globalSetup() {
  const AUTH_FILE = 'tests/.auth/user.json';
  const authDir = path.dirname(AUTH_FILE);
  
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  // 🔹 1. 🔥 ПРОВЕРКА: если сессия уже есть и валидна — не создаём нового пользователя
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      const hasOrigins = saved.origins?.length > 0;
      const hasLocalStorage = saved.origins?.[0]?.localStorage?.length > 0;
      
      if (hasOrigins && hasLocalStorage) {
        console.log('✅ Валидная сессия уже существует, используем её:', AUTH_FILE);
        return; // 🔹 Выходим, не создаём нового пользователя
      }
    } catch (e) {
      console.log('⚠️ Ошибка чтения сессии, создаём новую:', e.message);
    }
  }
  
  console.log('🔐 Создаём нового пользователя...');
  
  // 🔹 2. Создание нового пользователя (только если сессии нет или она невалидна)
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const registerPage = new RegisterPage(page);
    
    const testUser = {
      username: `testuser-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!'
    };
    
    await registerPage.signup(testUser);
    
    // 🔹 Ждём подтверждения авторизации
    await page.waitForURL(/#\/$/);
    await page.locator('.nav-link.dropdown-toggle, a[href*="#/profile"]').first().waitFor({ 
      state: 'visible' 
    });
    
    //await page.waitForTimeout(1500);
    
    // 🔹 Сохраняем сессию
    await context.storageState({ path: AUTH_FILE });
    
    const saved = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    console.log('✅ Сессия создана:', AUTH_FILE);
    console.log(`   📦 Origins: ${saved.origins?.length || 0}, localStorage: ${saved.origins?.[0]?.localStorage?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Ошибка в globalSetup:', error.message);
    await page.screenshot({ path: 'debug-global-setup-error.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}