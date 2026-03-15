import { BasePage } from './base.page.js';

export class MainPage extends BasePage {
    
    constructor(page) {
        super(page);
        
        this.signInLink = page.getByText('Login', { exact: true });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });



    }
    async open() {
        await super.open('/');
    }
    async clickSignIn() {
        await this.signInLink.click();
    }
    async clickYourFeed() {
        await this.yourFeedTab.click();
    }
    async clickNewArticle() {
        await this.newArticleLink.click();
    }
}