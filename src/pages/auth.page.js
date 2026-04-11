// src/pages/auth.page.js
import { BasePage } from './base.page.js';

export class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByRole('button', { name: 'Login' });
    this.yourFeedTab = page.getByText('Your Feed', { exact: true });
    this.globalFeedTab = page.getByText('Global Feed', { exact: true });
  }

  async login(email, password) {
    await this.page.goto('https://realworld.qa.guru/#/login', { waitUntil: 'networkidle' });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openLogin() {
    await this.open('#/login');
  }

  async saveStorageState(path) {
    await this.page.context().storageState({ path });
  }
}
