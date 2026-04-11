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
    //this.articleTitle = page.locator('h1').first();
    this.articleTitle = page
      .locator('.article-page h1, h1.article-title, [data-test="article-title"], h1')
      .first();
    this.titleInput = page.locator('input[name="title"]');
    this.activeTag = page.locator('.nav-link.active, .tag-pill.active').first();
    this.navLink = page.locator('.nav-link').first();
    this.articlePageTitle = page.locator('h1').first();
    this.articleContainer = page.locator('.article-page').first();
    this._getArticleLinkByHref = (parent) => parent.locator('a[href*="#/article/"]').first();
    this._getArticleLinkGeneric = (parent) => parent.locator('a').first();
    this._getArticleTitleAsLink = (parent) => parent.locator('h1').first();
    this.globalFeedButton = page.locator('button:has-text("Global Feed")').first();
    this.yourFeedButton = page.locator('button:has-text("Your Feed")').first();
    this.activeFeedButton = page
      .locator('.nav-link.active, button.active, .feed-toggle .active')
      .first();
  }

  // 🔹 Метод: получить локатор активного тега (для expect в тесте)
  getActiveTag() {
    return this.activeTag;
  }
  // 🔹 Геттер для заголовка статьи
  getArticlePageTitle() {
    return this.articlePageTitle;
  }

  // 🔹 Метод: навигация на главную (как в рабочем примере)
  async navigateHome() {
    await this.page.goto('https://realworld.qa.guru/#/');
    await this.navLink.waitFor({ state: 'visible' });
  }

  async open() {
    return this.navigateHome();
  }

  async clickYourFeed() {
    await this.yourFeedTab.click();
  }

  async clickGlobalFeed() {
    // 🔹 1. Ждём кнопку и кликаем
    await this.globalFeedButton.waitFor({ state: 'visible' });
    await this.globalFeedButton.click({ force: true });

    await this.page
      .waitForFunction(() => {
        const btn = document.querySelector('button:has-text("Global Feed")');
        return (
          btn &&
          (btn.classList.contains('active') || window.getComputedStyle(btn).fontWeight === 'bold')
        );
      })
      .catch(() => {
        console.log('ℹ️ Кнопка Global Feed не стала активной, продолжаем...');
      });

    // 🔹 3. Ждём появления статей в ленте
    await Promise.race([
      this.articleCards.first().waitFor({ state: 'visible' }),
      this.emptyMessage.waitFor({ state: 'visible' }),
    ]);

    console.log('✅ Перешли в Global Feed');
  }

  async clickNewArticle() {
    await this.newArticleLink.waitFor({ state: 'visible' });
    await this.newArticleLink.scrollIntoViewIfNeeded();
    await this.newArticleLink.click({ force: true });
  }

  async openArticleBySlugAndTitle(slug, expectedTitle) {
    console.log(`🔹 Открытие статьи по slug: "${slug}"`);

    await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`, {
      waitUntil: 'domcontentloaded',
    });

    // 🔹 Ждём контейнер статьи (гарантия, что это не 404)
    await this.articleContainer.waitFor({ state: 'visible' });

    // 🔹 Теперь ждём заголовок внутри контейнера
    await this.articlePageTitle.waitFor({ state: 'visible' });

    console.log('✅ Статья открыта');
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
      if ((await this.articleCards.count()) === 0) {
        throw new Error('Не удалось найти статьи в глобальной ленте');
      }
    }
    const firstCard = this.articleCards.first();
    await firstCard.scrollIntoViewIfNeeded();
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
