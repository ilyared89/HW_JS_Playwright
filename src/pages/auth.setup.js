import { BasePage } from './base.page.js';

export class AuthSetup extends BasePage {
    
    constructor(page) {
        super(page);
        this.emailInput = page.getByRole('textbox', { name: 'Email'});
        this.passwordInput = page.locator('input[type="password"]');
        this.signInButton = page.getByRole('button', { name: 'Login'});
        this.feedTab = page.getByText('Your Feed', { exact: true });
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.feedTab.waitFor();
    }

    async saveStorageState(path) {
        await this.page.context().storageState({ path });
    }
}