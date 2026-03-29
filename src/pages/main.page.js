// src/pages/main.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.signInLink = page.getByText('Login', { exact: true });
    this.yourFeedTab = page.getByText('Your Feed', { exact: true });
    this.globalFeedButton = page.locator('button:has-text("Global Feed")');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.articleCards = page.locator('.article-preview');
    this.articleTitle = page.locator('h1');
    this.articlePreview = page.locator('.article-preview');
    this.tagList = page.locator('.tag-list');
    this.tagPill = page.locator('.tag-pill.tag-default');
    this.emptyMessage = page.locator('text=No articles are here');
  }

  async open() {
    await super.open('#/');
  }
  async clickYourFeed() {
    await this.yourFeedTab.click();
  }

  async clickGlobalFeed() {
    await this.globalFeedButton.click();
    await this.articleCards.first().waitFor({ state: 'visible' });
  }

  async waitForArticles() {
    await expect
      .poll(async () => await this.articleCards.count(), {
        message: 'Ожидаем появления статей',
        intervals: [500],
      })
      .toBeGreaterThan(0);
  }

  async clickNewArticle() {
    await this.newArticleLink.click();
  }

  async openArticleBySlugAndTitle(slug, expectedTitle) {
    await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`);
    await this.articleTitle.waitFor({ state: 'visible' });
    await expect(this.articleTitle).toContainText(expectedTitle);
    console.log('✅ Статья открыта по slug:', slug);
  }

  async openFirstArticle() {
    await this.clickGlobalFeed();
    await Promise.race([
      this.articleCards.first().waitFor({ state: 'visible' }),
      this.emptyMessage.waitFor({ state: 'visible' }),
    ]);
    const count = await this.articleCards.count();
    if (count === 0) {
      console.warn('⚠️ Глобальная лента пуста');
      await this.page.waitForTimeout(3000);
      if ((await this.articleCards.count()) === 0) {
        throw new Error('Не удалось найти статьи в глобальной ленте');
      }
    }
    const firstCard = this.articleCards.first();
    await firstCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    let link = firstCard.locator('a[href*="#/article/"]').first();
    if (!(await link.isVisible().catch(() => false))) link = firstCard.locator('a').first();
    if (!(await link.isVisible().catch(() => false))) link = firstCard.locator('h1').first();
    await expect(link, '❌ Ссылка на статью не найдена').toBeVisible();
    await link.click();
    await this.page.locator('h1').first().waitFor({ state: 'visible' });
  }

  async getArticleTitleText() {
    return this.articleTitle.textContent();
  }
  async waitForTagList() {
    await this.tagList.waitFor({ state: 'visible' });
  }
  async clickFirstTag() {
    await this.tagPill.first().click();
  }

  async waitForFeedUpdate() {
    const hasArticles = await this.articlePreview
      .first()
      .isVisible()
      .catch(() => false);
    if (hasArticles) {
      await this.articlePreview.first().waitFor({ state: 'visible' });
      return;
    }
    const isEmpty = await this.emptyMessage.isVisible().catch(() => false);
    if (isEmpty) {
      await this.emptyMessage.waitFor({ state: 'visible' });
      return;
    }
    await this.page.waitForTimeout(1000);
    const finalCheck =
      (await this.articlePreview
        .first()
        .isVisible()
        .catch(() => false)) || (await this.emptyMessage.isVisible().catch(() => false));
    if (!finalCheck) console.warn('⚠️ Лента не обновилась после фильтрации');
  } // ←✅ ЗАКРЫТИЕ МЕТОДА

  async hasFeedContent() {
    const articles = await this.articlePreview.count();
    const empty = await this.emptyMessage.isVisible().catch(() => false);
    return articles > 0 || empty;
  } // ←✅ ЗАКРЫТИЕ МЕТОДА
} // ←✅ ЗАКРЫТИЕ КЛАССА (ПОСЛЕДНЯЯ СТРОКА!)
