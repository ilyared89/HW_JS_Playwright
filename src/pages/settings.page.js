// src/pages/settings.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class SettingsPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Поля формы
        this.profileImageInput = page.locator('input[name="image"]');
        this.usernameInput = page.locator('input[name="username"]');
        this.bioInput = page.locator('textarea[name="bio"], textarea[rows="8"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        
        // ✅ Упрощённый селектор кнопки
        this.updateSettingsButton = page.locator('button:has-text("Update Settings")');
    }

    async openSettings() {
        // ✅ Прямой переход (без .trim() на литерале)
        await this.page.goto('https://realworld.qa.guru/#/settings');
        await this.usernameInput.waitFor({ state: 'visible'});
    }

    async updateSettings(settings) {
        // ✅ Очищаем поля перед заполнением
        await this.usernameInput.fill('');
        await this.usernameInput.fill(settings.username);
        
        await this.bioInput.fill('');
        await this.bioInput.fill(settings.bio);
        
        await this.emailInput.fill('');
        await this.emailInput.fill(settings.email);
        
        await this.passwordInput.fill('');
        await this.passwordInput.fill(settings.password);
        
        await this.profileImageInput.fill('');
        await this.profileImageInput.fill(settings.image);
        
        // ✅ Проверяем, что кнопка видна
        await expect(this.updateSettingsButton).toBeVisible();
        
        // Нажимаем кнопку
        await this.updateSettingsButton.click();
        
        // ✅ Ждём networkidle вместо проверки enabled (кнопка может пропасть)
        await this.page.waitForLoadState('networkidle');
        
        console.log('✅ Настройки отправлены');
    }
    
    // ✅ Отдельный метод для проверки сохранения
    async verifySettings(settings) {
        await expect(this.usernameInput).toHaveValue(settings.username);
        await expect(this.emailInput).toHaveValue(settings.email);
        console.log('✅ Данные сохранены корректно');
    }
}