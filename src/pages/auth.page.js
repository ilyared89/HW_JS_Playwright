// src/pages/auth.page.js
import { BasePage } from './base.page.js';

export class AuthPage extends BasePage {
    
    constructor(page) {
        super(page);
        
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.locator('input[type="password"]');
        this.signInButton = page.getByRole('button', { name: 'Login' });
        // 🔹 Гибкий селектор: ищет "Your Feed" в любом элементе
        this.yourFeedTab = page.locator(':has-text("Your Feed")').first();
    }

    async login(email, password) {
        await this.openLogin();
        
        // Ждём готовности формы
        await this.emailInput.waitFor({ state: 'visible' });
        
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        
        // 🔹 Надёжное ожидание: редирект ИЛИ появление вкладки
        await Promise.race([
            this.page.waitForURL(/.*#\/$/, { timeout: 10000 }),
            this.yourFeedTab.waitFor({ state: 'visible', timeout: 10000 })
        ]);
    }

    async openLogin() {
        await this.open('#/login');
    }

    async saveStorageState(path) {
        await this.page.context().storageState({ path });
    }
} 