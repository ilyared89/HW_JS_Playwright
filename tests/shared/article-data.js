// tests/shared/article-data.js
import fs from 'fs';
import path from 'path';


const DATA_FILE = path.join('tests', 'shared', 'article-data.json');

export function saveArticleData(article) {
    // Создаём папку, если нет
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(article, null, 2));
}

export function loadArticleData() {
    if (!fs.existsSync(DATA_FILE)) {
        console.warn('⚠️ article-data.json не найден. Запустите сначала тест 4.1!');
        return null;
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('❌ Ошибка чтения article-data.json:', e.message);
        return null;
    }
}

export function clearArticleData() {
    if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
        console.log('🗑️ article-data.json удалён');
    }
}