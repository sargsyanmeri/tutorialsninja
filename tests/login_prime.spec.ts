import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';
import { VALID_USER_CREDENTIALS, 
    INVALID_EMAIL_CREDENTIALS, 
    INVALID_USER_CREDENTIALS, 
    INVALID_PASSWORD_CREDENTIALS,
    LoginCredentials} from './user_credentials';
    


async function login(page: Page, credentials: LoginCredentials) {
    await page.locator('#input-email').fill(credentials.email);
    await page.locator('#input-password').fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
}


test.describe('Login Prime', ()=>{

    test.describe('Positive scenarios', ()=>{

        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.login);
            await expect(page.locator('#input-email')).toBeVisible();
        });

        test('P-01 | Login page shows email and password fields', async({page})=>{
            await expect(page.locator('#input-email').and(page.getByRole('textbox', {name: 'E-Mail Address'})), 'Field Password must be visible' ).toBeVisible();
            await expect(page.locator('#input-password'), 'Field Password must be visible' ).toBeVisible();
        });

        test('P-02 | Login button is enabled', async({page})=>{
            await expect(page.getByRole('button', { name: 'Login' }), 'Login Button must be visbile').toBeVisible();
            await expect(page.getByRole('button', { name: 'Login' }), 'Login Button must be visbile').toBeEnabled();
        });

        test('P-03 | Forgotten Password link opens reset page', async({page})=>{
            page.locator('#column-right').getByRole('link', {name: 'Forgotten Password'}).click();

            await expect(page).toHaveURL(/route=account\/forgotten/);
            await expect(page.locator('#content h1')).toContainText('Forgot Your Password?');
            await expect(page.getByRole('heading', { name: 'Forgot Your Password?' })).toBeVisible();
        });

        test('P-04 | Register Continue link opens registration page', async({page})=>{
             await page.getByRole('link', { name: 'Continue' }).click();
             await expect(page.getByRole('heading', { name: 'Register Account' })).toBeVisible();

            await expect(page).toHaveURL(/route=account\/register/);
            await expect(page).toHaveTitle('Register Account');
        });

        test('P-05 | Valid credentials open My Account page', async({page})=>{
            await login(page, VALID_USER_CREDENTIALS);

            // await expect(page).toHaveURL(//);
            // await expect(page.getByRole('heading', {name: ''})).toBeVisible();    
        });

        test('P-06 | My Account page shows account sections after login', async({page})=>{
            await login(page, VALID_USER_CREDENTIALS);

            // ??????????
        });

        test('P-07 | Logout after valid login opens logout page', async({page})=>{
             await login(page, VALID_USER_CREDENTIALS);

            // await expect(page).toHaveURL(//);
            // await expect(page.getByRole('heading', {name: ''})).toBeVisible();    
        });

    });

    test.describe('Negative scenarios', ()=>{


        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.login);
            await expect(page.locator('#input-email')).toBeVisible();
        });


        test('N-01 | Login warning is hidden before submit', async({page})=>{
            await expect(page.locator('.alert-danger')).not.toBeVisible();
        });

        test('N-02 | Empty login form shows warning', async({page})=>{
            await page.getByRole('button', {name: 'login'}).click();
            await expect(page.locator('.alert-danger')).toBeVisible();
            await expect(page.locator('.alert-danger')).toContainText('No match for E-Mail Address and/or Password');
        });;

        test('N-03 | Unknown user credentials show warning', async({page})=>{
            await login(page, INVALID_USER_CREDENTIALS);
            
            await expect(page.locator('.alert-danger'), 'Alert-danger panel is not vibible').toBeVisible();
            await expect(page.locator('.alert-danger'), 'Incorrect alert Text').toContainText('No match for E-Mail Address and/or Password');
        });

        test('N-04 | Invalid email format shows warning', async({page})=>{
             await login(page, INVALID_EMAIL_CREDENTIALS);

            await expect(page.locator('.alert-danger'), 'Alert-danger panel is not vibible').toBeVisible();
            await expect(page.locator('.alert-danger'), 'Incorrect alert Text').toContainText('No match for E-Mail Address and/or Password');
        });


        test('N-05 | Wrong password shows warning', async({page})=>{
            await login(page, INVALID_PASSWORD_CREDENTIALS);

            await expect(page.locator('.alert-danger'), 'Alert-danger panel is not vibible').toBeVisible();
            await expect(page.locator('.alert-danger'), 'Incorrect alert Text').toContainText('No match for E-Mail Address and/or Password');

        });


        test('N-06 | Password field does not expose typed text', async({page})=>{
            const passwordInput = page.locator('#input-password');

            await passwordInput.fill('hello');
            await expect(passwordInput).toHaveAttribute('type', 'password');
        });


        test('N-07 | Guest wishlist access redirects to login page', async({page})=>{
            await page.goto(APP_ROUTES.wishlist);

            await expect(page).toHaveURL(APP_ROUTES.login);
        });


    });
 

});