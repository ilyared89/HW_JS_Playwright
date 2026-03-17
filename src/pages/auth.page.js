// src/pages/auth.page.js
import { BasePage } from './base.page.js';

export class AuthPage extends BasePage {
    
    constructor(page) {
        super(page);
        
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.locator('input[type="password"]');
        this.signInButton = page.getByRole('button', { name: 'Login' });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
    }

    async login(email, password) {
        await this.openLogin();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.yourFeedTab.waitFor({ timeout: 10000 });
    }

    async openLogin() {
        await this.open('#/login');  // hash-роутинг
    }

    async saveStorageState(path) {
        await this.page.context().storageState({ path });
    }
}