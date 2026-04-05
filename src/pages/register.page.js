// src/pages/register.page.js
import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.locator('input[type="password"]').first();
    this.signupButton = page.getByRole('button', { name: 'Sign up' });
    this.yourFeedTab = page.locator(':has-text("Your Feed")').first();
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
  }
}
