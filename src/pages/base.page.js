// src/pages/base.page.js
export class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://realworld.qa.guru';
    }

    async open(path = '') {
        // Если path начинается с # — добавляем как hash
        // Иначе — как обычный путь
        const url = path.startsWith('#') 
            ? `${this.baseUrl}/${path}` 
            : path 
                ? `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
                : this.baseUrl;
                
        console.log('Navigating to:', url);
        await this.page.goto(url);
    }
}