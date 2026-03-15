import { test, expect } from '@playwright/test';
import {faker} from '@faker-js/faker';

import { MainPage} from '../src/pages/main.page';
import { RegisterPage } from '../src/pages/register.page';
import { YuorfeedPage} from '../src/pages/yourfeed.page';

const URL = 'https://realworld.qa.guru/';

let user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.person.fullName(({ lastName: 'Bin' })),
}

test('Пользователь', async ({ page }) => {

  const main = new MainPage(page);
  const register = new RegisterPage(page)
  const yourfeed = new YuorfeedPage

  await main.open();
  await main.gotoRegister();
  await register.register();
  await expect(yourfeed.profileName).toContainText(user.username);
  await expect(yourfeed.getProfileName()).toContainText(user.username)

/*
await gotoUrl(page);
await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).fill(user.username);
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByRole('main')).toContainText('Your Feed');
  // todo может быть проблемный ассерт из-за длинного имени
  await expect(page.getByRole('navigation')).toContainText(user.username);
*/
  });
