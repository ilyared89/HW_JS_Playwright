// tests/shared/article-data.js
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, 'article-data.json');

export function saveArticleData(article) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(article, null, 2));
}

export function loadArticleData() {
    /*if (!fs.existsSync(DATA_FILE)) {
        throw new Error('Данные статьи не найдены! Сначала запустите 4.1.NewArticle.test.js');
    }*/
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}
/*
export function clearArticleData() 
{
    if (fs.existsSync(DATA_FILE)) 
    {
        fs.unlinkSync(DATA_FILE);
    }
}*/