import {expect, test} from '@playwright/test';
import {APP_ROUTES} from './app_routes';

const EXISTING_PRODUCT = 'iPhone';
const UNKNOWN_PRODUCT = 'product-404';

test.describe('Search Prime', { tag: '@search' }, ()=>{

    test.describe('Positive scenarios', { tag: '@positive' }, ()=>{

        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.home);
        });

        test('P-01 | Header search input is visible', async({page})=>{
            await expect(page.getByPlaceholder('Search'), 'Search Field not found').toBeVisible();
        });

        test('P-02 | Header search button is visible and enabled', async({page})=>{
            await expect(page.locator('#search').getByRole('button'), 'Search button not found').toBeVisible();
            await expect(page.locator('#search').getByRole('button'), 'Search button not found').toBeEnabled();
        });

        test('P-03 | Click search button → results page opens for iPhone', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(EXISTING_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            await expect(page, 'Invalid URL').toHaveURL(new RegExp(`route=product/search&search=${EXISTING_PRODUCT}`));
            await expect(page.locator('#input-search')).toHaveValue(EXISTING_PRODUCT);

            await expect(page.locator('#product-search h1')).toContainText(EXISTING_PRODUCT);
        });

        test('P-04 | Search for iPhone → product cards are shown',  async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(EXISTING_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            await expect(page, 'Invalid URL').toHaveURL(new RegExp(`route=product/search&search=${EXISTING_PRODUCT}`));


            expect(await page.locator('.product-thumb h4').count()).toBeGreaterThan(0);
            await expect(page.locator('.product-thumb h4').first()).toContainText(EXISTING_PRODUCT, {ignoreCase: true});

            const products = await page.locator('.product-thumb h4').allTextContents();

            for(let product of products){
                expect(product.toLowerCase()).toContain(EXISTING_PRODUCT.toLowerCase());
            }

        });


        test('P-05 | Press Enter in search field → results page opens for iPhone', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(EXISTING_PRODUCT);
            await page.locator('#search').getByPlaceholder('Search').press('Enter');


            await expect(page, 'Invalid URL').toHaveURL(new RegExp(`route=product/search&search=${EXISTING_PRODUCT}`));
            await expect(page.locator('#input-search')).toHaveValue(EXISTING_PRODUCT);

            await expect(page.locator('#product-search h1')).toContainText(EXISTING_PRODUCT);
        });


        test('P-06 | Search results page has category filter', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(EXISTING_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            await expect(page, 'Invalid URL').toHaveURL(new RegExp(`route=product/search&search=${EXISTING_PRODUCT}`));
            await expect(page.locator('select[name="category_id"]'), 'Category filter not found').toBeVisible();
        });

    });

    test.describe('Negative scenarios', { tag: '@negative' }, ()=>{
        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.home);
        });

        test('N-01 | Empty search → "no results" message is shown', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill('');
            await page.locator('#search').getByRole('button').click();

            await expect( page.getByText('There is no product that matches the search criteria.') ).toBeVisible();
        });


        test('N-02 | Empty search → no product cards are shown', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill('');
            await page.locator('#search').getByRole('button').click();

            expect(await page.locator('.product-thumb h4').count()).toBe(0);
        });

        test('N-03 | Unknown product search shows no results message', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(UNKNOWN_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            await expect( page.getByText('There is no product that matches the search criteria.') ).toBeVisible();
        });

        test('N-04 | Search for unknown product → no product cards are shown', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(UNKNOWN_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            expect(await page.locator('.product-thumb h4').count()).toBe(0);
        });

        test('N-05 | iPhone search results contain only iPhone products', async({page})=>{
            await page.locator('#search').getByPlaceholder('Search').fill(EXISTING_PRODUCT);
            await page.locator('#search').getByRole('button').click();

            await expect(page, 'Invalid URL').toHaveURL(new RegExp(`route=product/search&search=${EXISTING_PRODUCT}`));


           const products =  await page.locator('.product-thumb h4').allTextContents();

           for(let product of products){
                expect(product.toLowerCase()).toContain(EXISTING_PRODUCT.toLowerCase());
           }

        });

        test('N-06 | XSS search value does not render script tag', { tag: '@security' }, async ({ page }) => {
            await page.locator('#search').getByPlaceholder('Search').fill('<script>alert("XSS")</script>');
            await page.locator('#search').getByRole('button').click();

            const pageContent = await page.content();
            expect(pageContent).not.toContain('<script>alert("XSS")</script>');
        });

    });

});