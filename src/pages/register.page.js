export class RegisterPage 
{
    constructor (page)
    {
//Техническое описание старницы
this.signupButton = page.getByRole('button', { name: 'Sign up' })

this.emailInput = page.getByRole('textbox', { name: 'Email' });
this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    }

async signup(user){
    const {email, password, username } = user;

    await this.nameInput.click();
  await this.nameInput.fill(username);
  await this.emailInput.click();
  await this.emailInput.fill(email);
  await this.emailInput.press('Tab');
  await this.passwordInput.fill(password);
  await this.passwordInput.click();

}
   async gotoRegister () {

        await this.signupLink.click()

    }
    // todo
    async open ()
    {
        await this.page.goto('https://realworld.qa.guru/')

    }
}



///