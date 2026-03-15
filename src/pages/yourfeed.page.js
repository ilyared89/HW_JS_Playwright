export class YuorfeedPage 
{
    constructor (page)
    {
        this.page = page;

        this.profileName = page.getByRole('navigation')

        //this.signupLink = page.getByRole('link', {name: 'Sign up' })
    }

   getProFileName () {
        return this.profileName;

   }
   
}
