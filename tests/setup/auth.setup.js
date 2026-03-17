// tests/setup/auth.setup.js
import { test as setup } from '@playwright/test';
import { AuthPage } from '../../src/pages/auth.page.js';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = 'tests/.auth/user.json';

setup('Авторизация и сохранение сессии', async ({ page }) => {
    // Создаём папку для auth файла
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // Авторизуемся
    const authPage = new AuthPage(page);
    await authPage.login('test@example.com', 'password123');
    
    // Сохраняем сессию
    await authPage.saveStorageState(AUTH_FILE);
    
    console.log('✅ Сессия сохранена в', AUTH_FILE);
});