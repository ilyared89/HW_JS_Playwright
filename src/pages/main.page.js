// src/pages/main.page.js
import { BasePage } from './base.page.js';

export class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.signInLink = page.getByText('Login', { exact: true });
    this.yourFeedTab = page.getByText('Your Feed', { exact: true });
    this.globalFeedButton = page.locator('button:has-text("Global Feed")');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.articleCards = page.locator('.article-preview');
    this.articlePreview = page.locator('.article-preview');
    this.tagList = page.locator('.tag-list');
    this.tagPill = page.locator('.tag-pill.tag-default');
    this.emptyMessage = page.locator('text=No articles are here');
    this.editArticleButton = page.locator('button:has-text("Edit Article")').first();
    this.articleTitle = page.locator('h1').first();
    this.titleInput = page.locator('input[name="title"]');
    this.activeTag = page.locator('.nav-link.active, .tag-pill.active').first();
    this.navLink = page.locator('.nav-link').first();
  }

  async open() {
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.tagList.waitFor({ state: 'visible' });
  }

  // 🔹 Метод: получить локатор активного тега (для expect в тесте)
  getActiveTag() {
    return this.activeTag;
  }

  // 🔹 Метод: навигация на главную (как в рабочем примере)
  async navigateHome() {
    await this.page.goto('https://realworld.qa.guru/#/');
    await this.navLink.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500); // 🔹 Стабилизация после хэш-навигации
  }

  async open() {
    return this.navigateHome();
  }

  // 🔹 Метод: клик по первому тегу (как в рабочем примере)
  async clickFirstTag() {
    // Ждём загрузки сайдбара с тегами
    await this.tagList.first().waitFor({ state: 'visible' });

    // Кликаем по первому тегу
    const firstTag = this.tagList.first();
    await firstTag.scrollIntoViewIfNeeded();
    await firstTag.click();
  }

  async clickYourFeed() {
    await this.yourFeedTab.click();
  }

  async clickGlobalFeed() {
    await this.globalFeedButton.click();
    await this.articleCards.first().waitFor({ state: 'visible' });
  }

  async clickNewArticle() {
    await this.newArticleLink.waitFor({ state: 'visible' });
    await this.newArticleLink.scrollIntoViewIfNeeded();
    await this.newArticleLink.click({ force: true });
  }

  async openArticleBySlugAndTitle(slug, expectedTitle) {
    await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`);
    await this.articleTitle.waitFor({ state: 'visible' });

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

    // ✅ Исправлено: вызываем waitFor у конкретного локатора
    await link.waitFor({ state: 'visible' });
    await link.click();
    await this.articleTitle.waitFor({ state: 'visible' });
  }

  async getArticleTitleText() {
    return this.articleTitle.textContent();
  }

  async isFeedUpdated() {
    // Ждём появления любого из двух состояний
    await Promise.race([
      this.articlePreview.first().waitFor({ state: 'attached' }),
      this.emptyMessage.waitFor({ state: 'attached' }),
    ]);

    // Проверяем видимость
    const hasArticles = await this.articlePreview
      .first()
      .isVisible()
      .catch(() => false);
    const isEmpty = await this.emptyMessage.isVisible().catch(() => false);
    return hasArticles || isEmpty;
  }

  async waitForArticles() {
    await Promise.race([
      this.articleCards.first().waitFor({ state: 'visible' }),
      this.emptyMessage.waitFor({ state: 'visible' }),
    ]);
  }

  async waitForTagList() {
    await this.tagList.waitFor({ state: 'visible' });
  }

  async clickFirstTag() {
    const tag = this.tagPill.first();
    await tag.waitFor({ state: 'visible' });
    await tag.click();
    return tag; // 🔹 Возвращаем локатор для дальнейшего ожидания
  }

  async waitForFeedUpdate() {
    // 🔹 Вариант А: ждём появления статей
    const articlesVisible = await this.articlePreview
      .first()
      .isVisible({})
      .catch(() => false);

    if (articlesVisible) {
      await this.articlePreview.first().waitFor({ state: 'visible' });
      return true;
    }
  }

  async hasFeedContent() {
    const articles = await this.articlePreview.count();
    const empty = await this.emptyMessage.isVisible().catch(() => false);
    return articles > 0 || empty;
  }

  getEditArticleButton() {
    return this.editArticleButton;
  }

  async clickEditArticle() {
    const editButton = this.getEditArticleButton();
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async waitForEditorLoaded() {
    await this.titleInput.waitFor({ state: 'visible' });
  }
}
