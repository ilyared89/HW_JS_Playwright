// src/pages/register.page.js
import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
    constructor(page) {
        super(page);
        
        this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.locator('input[type="password"]').first();
        this.signupButton = page.getByRole('button', { name: 'Sign up' });
    }

    async gotoRegister() {
        await this.open('#/register');
        await this.nameInput.waitFor({ state: 'visible' });
    }

    async signup(user) {
        await this.gotoRegister();
        
        const { username, email, password } = user;
        
        await this.nameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signupButton.click();
        
        // Ждём успешной регистрации
        await Promise.race([
            this.page.waitForURL(/.*#\/$/, { timeout: 10000 }),
            this.page.locator(':has-text("Your Feed")').first().waitFor({ state: 'visible', timeout: 10000 })
        ]);
    }
}