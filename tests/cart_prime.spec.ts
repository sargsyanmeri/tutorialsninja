import {expect, test} from '@playwright/test';
import {APP_ROUTES} from './app_routes';

test.describe('Cart Prime', { tag: '@cart' }, ()=>{

    test.describe('Positive scenarios', { tag: '@positive' }, ()=>{
        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.iphoneProduct);
        });

       test('P-01 | Add to Cart button is visible', async({page})=>{
        await expect(page.locator('#button-cart')).toBeVisible();
       });

       test('P-02 | Add to Cart button is enabled', async({page})=>{
        await expect(page.locator('#button-cart')).toBeEnabled();
       });

       test('P-03 | Add to Cart → success alert is shown', async({page})=>{
        await page.locator('#button-cart').click();
        await expect(page.locator('.alert-success')).toBeVisible();
       });

       
       test('P-04 | Add single product → cart badge shows 1 item', async({page})=>{
        
            await test.step('Open Product page and add 1 item', async()=>{
            await page.goto(APP_ROUTES.iphoneProduct);
            await page.locator('#input-quantity').fill('1');
            await page.locator('#button-cart').click();
            await expect(page.locator('.alert-success')).toBeVisible();
            });

            await test.step('Check cart badge quantity', async()=>{
            await expect(page.locator('#cart-total')).toContainText('2 item');
            });


            await test.step('Check product in cart dropdown', async()=>{
            await page.locator('#cart > button').click();
            await expect(page.locator('#cart .dropdown-menu')).toBeVisible();
            await expect(page.locator('#cart .dropdown-menu')).toContainText('iPhone');
            });

       });


       test('P-05 | Add two products → both appear in cart and checkout total is correct', async({page})=>{

            await test.step('Add Product 1', async() => {
            await page.goto(APP_ROUTES.iphoneProduct);
            await page.locator('#input-quantity').fill('1');
            await page.locator('#button-cart').click();
            await expect(page.locator('.alert-success')).toBeVisible();
            });

            await test.step('Add Product 2', async() => {
            await page.goto(APP_ROUTES.macbookProduct);
            await page.locator('#input-quantity').fill('1');
            await page.locator('#button-cart').click();
            await expect(page.locator('.alert-success')).toBeVisible();
            });


            await test.step('Check cart badge for 2 product', async() => {
            
            await expect(page.locator('#cart-total')).toContainText('2 item');
            });

            await test.step('Check product in cart dropdown', async()=>{
            await page.locator('#cart > button').click();
            await expect(page.locator('#cart .dropdown-menu')).toBeVisible();
            await expect(page.locator('#cart .dropdown-menu')).toContainText('iPhone');
            await expect(page.locator('#cart .dropdown-menu')).toContainText('Mac');
            });


            await test.step('Check product table in checkout page', async()=>{
            await page.goto(APP_ROUTES.checkout);


            const table1 = page.locator('#content .table-responsive table').first();
            const row1 = table1.locator('tr').nth(1);
            const row2 = table1.locator('tr').nth(2);
            
            await expect(row1.locator('td').nth(1)).toContainText(/iPhone/);
            await expect(row1.locator('td').nth(2)).toContainText(/product 11/);
            await expect(row1.locator('td').nth(3).locator('input')).toHaveValue('1');


            await expect(row2.locator('td').nth(1)).toContainText(/Mac/);
            await expect(row2.locator('td').nth(2)).toContainText(/Product 16/);
            await expect(row2.locator('td').nth(3).locator('input')).toHaveValue('1');

            });

       });

       
    });


});