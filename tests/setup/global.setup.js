// tests/setup/global.setup.js
import { chromium } from '@playwright/test';
// ✅ Правильный путь к странице:
import { RegisterPage } from '../../src/pages/register.page.js';
import fs from 'fs';
import path from 'path';

export default async function globalSetup() {
  const AUTH_FILE = 'tests/.auth/user.json';
  const authDir = path.dirname(AUTH_FILE);
  
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  if (fs.existsSync(AUTH_FILE)) {
    console.log('✅ Сессия уже существует:', AUTH_FILE);
    return;
  }
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const registerPage = new RegisterPage(page);
  await registerPage.signup({
    username: `testuser-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'Test123!'
  });
  
  await page.context().storageState({ path: AUTH_FILE });
  await browser.close();
  console.log('✅ Сессия создана:', AUTH_FILE);
}