// src/pages/main.page.js
import { BasePage } from './base.page.js';

export class MainPage extends BasePage {
    
    constructor(page) {
        super(page);
        
        this.signInLink = page.getByText('Login', { exact: true });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
        this.globalFeedButton = page.locator('button:has-text("Global Feed")');
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    }

    async open() {
        await super.open('#/');
    }

    async clickSignIn() {
        await this.signInLink.click();
    }

    async clickYourFeed() {
        await this.yourFeedTab.click();
    }

    async clickGlobalFeed() {
        await this.globalFeedButton.click();
    }

    async clickNewArticle() {
        await this.newArticleLink.click();
    }
    
    // 🔹 МЕТОД: Клик по статье в ленте
    async clickArticleByTitle(title) {
        await this.page
            .locator('a[href*="/article/"]:has(h1)')
            .first()
            .waitFor({ state: 'visible' });
        
        const articleLink = this.page
            .locator(`a[href*="/article/"]:has(h1:has-text("${title}"))`)
            .first();
        
        console.log(`🔍 Ищем статью: "${title}"`);
        
        await articleLink.waitFor({ state: 'visible' });
        await articleLink.scrollIntoViewIfNeeded();
        await articleLink.click();
        
        console.log(`✅ Статья открыта: ${title}`);
    }
    
    // 🔹 МЕТОДЫ ДЛЯ РАБОТЫ С ТЕГАМИ (отдельно, не внутри других методов!)
    
    getTagList() {
        return this.page.locator('.tag-list');
    }
    
    getFirstTag() {
        return this.page.locator('.tag-pill.tag-default:not(.active)').first();
    }
    
    async clickTag(tagName) {
        const tag = this.page.locator(`.tag-pill.tag-default:has-text("${tagName}")`).first();
        await tag.waitFor({ state: 'visible' });
        await tag.click();
    }
    
    async isTagActive(tagName) {
        const activeTag = this.page.locator(`.tag-pill.tag-default:has-text("${tagName}").active`).first();
        return activeTag.isVisible();
    }
}  // ← ✅ ЕДИНСТВЕННАЯ закрывающая скобка класса