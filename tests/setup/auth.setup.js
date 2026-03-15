import { test as setup } from '@playwright/test';
import { AuthSetup } from '../../src/pages/auth.setup.js'; 

import fs from 'fs';
import path from 'path';

const AUTH_FILE = 'tests/.auth/user.json';

setup('Авторизация и сохранение сессии', async ({ page }) => {
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const authPage = new AuthSetup(page);
    await authPage.open('#/login');
    await authPage.login('test@example.com', 'password123');
    await authPage.saveStorageState(AUTH_FILE);
    //console.log('💾 Сессия сохранена в', AUTH_FILE);
});