import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';

test.describe('Homepage Menu - Positive scenarios', ()=>{

    test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home); // HTML, CSS
        await expect(page.locator("#menu")).toBeVisible();
    });

    test('P-01 | Main menu is visible on homepage', async({page})=>{
        await expect(page.locator("#menu")).toBeVisible();
    });

    test('P-02 | Main menu has 8 top-level items', async({page})=>{
        await expect(page.locator('#menu > div > ul > li')).toHaveCount(8);
    });

    test('P-03 | Hover on Desktops shows dropdown', async({page})=>{
        await page.locator('#menu').getByRole('link', {name: 'Desktops'}).hover();
        await expect( page.locator('#menu .dropdown .dropdown-menu').first() ).toBeVisible();
    });

    test('P-04 | Click on Tablets opens Tablets category page', async({page})=>{
        await page.locator('#menu').getByRole('link', {name: 'Tablets'}).click();
        await expect(page).toHaveURL(/category&path=57/);
        await expect(page.locator('#content h2')).toContainText('Tablets');
    });

    test('P-05 | Click on Cameras opens Cameras category page', async({page})=>{});

    test('P-06 | Menu stays visible after category navigation', async({page})=>{
         await page.locator('#menu').getByRole('link', {name: 'Software'}).click();
         await expect(page.locator('#menu')).toBeVisible();
    });

    test('P-07 | Desktops dropdown contains PC and Mac links', async({page})=>{});

});

test.describe('Homepage Menu - Negative scenarios', ()=>{

     test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home); // HTML, CSS
        await expect(page.locator("#menu")).toBeVisible();
    });

    test('N-01 | Menu does not contain fake item Gaming', async({page})=>{
        await expect(page.locator('#menu').getByRole('link', {name: 'Gaming'})).not.toBeVisible();
    });

    test('N-02 | Desktops dropdown is hidden before hover', async({page})=>{
        await expect(page.locator('#menu .dropdown .dropdown-menu').first()).toBeHidden();
    });

    test('N-03 | Invalid category URL does not break menu', async({page})=>{
        await page.goto(APP_ROUTES.invalidCategory);
        await expect(page.locator('#menu')).toBeVisible();
    });

    // <a href="https://ok.ru/"> OK </a>
    test('N-04 | Menu links do not use target blank', async({page})=>{
        const menuLinks = page.locator('#menu a');
        const count = await menuLinks.count(); // 20

        for(let i=0; i<count; i++){
            const target = await menuLinks.nth(i).getAttribute('target');
            
            expect(target).not.toBe('_blank');
            // expect(target !== '_blank').toBeTruthy();
            expect(target === null).toBeTruthy();
        }
    });

    // XSS - Cross-Site Scripting
    test('N-05 | XSS query in URL does not hide menu', async({page})=>{
        await page.goto(APP_ROUTES.xssSearch);
        await expect(page.locator('#menu')).toBeVisible();
    });


    test('N-06 | Menu does not have a ninth top-level item ', async({page})=>{
         await expect(page.locator('#menu > div > ul > li').nth(8)).not.toBeVisible(); 
    });

    test(' N-07 | Laptops dropdown is hidden before hover ', async({page})=>{
        await expect(page.locator('#menu .dropdown .dropdown-menu').nth(1)).toBeHidden();
    })



});