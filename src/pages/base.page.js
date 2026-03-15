// src/pages/base.page.js
export class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://realworld.qa.guru';
    }

    async open(path = '') {
        const url = path.startsWith('#') 
            ? this.baseUrl + path
            : this.baseUrl + '/' + path;
        await this.page.goto(url);
    }
}