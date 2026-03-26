// src/pages/auth.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class AuthPage extends BasePage {
    
    constructor(page) {
        super(page);
        
        // ✅ Все локаторы в конструкторе
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.locator('input[type="password"]');
        this.signInButton = page.getByRole('button', { name: 'Login' });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
        this.globalFeedTab = page.getByText('Global Feed', { exact: true });
    }

    async login(email, password) {
        await this.openLogin();
        
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        
        // ✅ Клик только в методе пейджа
        await this.signInButton.click();
        
        // ✅ Ожидание без if — через expect
        await expect(this.yourFeedTab.or(this.globalFeedTab)).toBeVisible();
    }

    async openLogin() {
        await this.open('#/login');
    }

    async saveStorageState(path) {
        await this.page.context().storageState({ path });
    }
}