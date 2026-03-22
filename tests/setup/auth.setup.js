// tests/setup/auth.setup.js
import { test as setup } from '@playwright/test';
import { RegisterPage } from '../../src/pages/register.page.js';   
import { AuthPage } from '../../src/pages/auth.page.js';           
import fs from 'fs';
import path from 'path';

const AUTH_FILE = 'tests/.auth/user.json';

// 🔹 Уникальные данные для тестового пользователя
const testUser = {
    username: `testuser-${Date.now()}`,  // Уникальный!
    email: `test-${Date.now()}@example.com`,  // Уникальный email
    password: 'Test123!'  // Надёжный пароль
};

setup('Регистрация и сохранение сессии', async ({ page }) => {
    // Создаём папку для auth-файла
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // 🔹 1. Регистрируем нового пользователя
    const registerPage = new RegisterPage(page);
    await registerPage.signup(testUser);
    
    console.log('✅ Пользователь зарегистрирован:', testUser.username);
    
    // 🔹 2. Сохраняем сессию (теперь пользователь авторизован)
    await page.context().storageState({ path: AUTH_FILE });
    
    console.log('✅ Сессия сохранена в', AUTH_FILE);
    
    // 🔹 3. (Опционально) Сохраняем данные пользователя для отладки
    const userDataFile = path.join(authDir, 'user-data.json');
    fs.writeFileSync(userDataFile, JSON.stringify(testUser, null, 2));
});