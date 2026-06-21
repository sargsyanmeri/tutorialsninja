import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';

const CURRENCIES = [
    {id: 'P-04', code: 'EUR', symbol: '€'},
    {id: 'P-05', code: 'GBP', symbol: '£'},
    {id: 'P-06', code: 'USD', symbol: '$'},
];

async function selectCurrency(page: Page, code: string) {
    await page.locator('#form-currency .dropdown-toggle').click();
    await page.locator(`button.currency-select[name="${code}"]`).click();
}

function getMacbookProductCard(page: Page) {
    return page.locator('.product-thumb').filter({
        has: page.getByRole('link', { name: 'MacBook', exact: true }),
    });
}

test.describe('Currency Prime', { tag: '@currency' }, ()=>{

    test.describe('Positive scenarios', { tag: '@positive' }, ()=>{
        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.home);
            await expect(page.locator('#menu')).toBeVisible();
        });

        test('P-01 | Currency form is visible on home', async({page})=>{
            await expect(page.locator('#form-currency')).toBeVisible();
        });

        test('P-02 | Currency dropdown toggle is enabled', async({page})=>{
            await expect(page.locator('#form-currency .dropdown-toggle')).toBeEnabled();
        });

        test('P-03 | All demo currencies are listed in dropdown', async({page})=>{
            await page.locator('#form-currency .dropdown-toggle').click();
            await expect(page.locator('button.currency-select[name="EUR"]')).toBeVisible();
            await expect(page.locator('button.currency-select[name="GBP"]')).toBeVisible();
            await expect(page.locator('button.currency-select[name="USD"]')).toBeVisible();
        });

        for (const {id, code, symbol} of CURRENCIES) {
            test(`${id} | Selecting ${code} updates toggle label`, async({page})=>{
                await selectCurrency(page, code);
                await expect(page.locator('#form-currency .dropdown-toggle strong')).toHaveText(symbol);
            });
        }

        test('P-07 | Hidden redirect field matches home URL', async({page})=>{
            await expect(page.locator('#form-currency input[name="redirect"]')).toHaveValue(APP_ROUTES.home);
        });

        test('P-08 | After currency change user stays on home', async({page})=>{
            await selectCurrency(page, 'EUR');
            await expect(page).toHaveURL(/route=common\/home/);
        });

        test('P-09 | Featured prices reflect selected currency symbol', async({page})=>{
            await selectCurrency(page, 'EUR');
            await expect(page.locator('.product-thumb .price').first()).toContainText('€');
        });

    });

    test.describe('Negative scenarios', { tag: '@negative' }, ()=>{
        test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.home);
            await expect(page.locator('#menu')).toBeVisible();
        });

        test('N-01 | Switch currency with items already in cart', async({page})=>{
            const macbookCard = getMacbookProductCard(page);

            await test.step('Set USD and add MacBook to cart', async()=>{
                await selectCurrency(page, 'USD');
                await expect(page.locator('#form-currency .dropdown-toggle strong')).toHaveText('$');

                await macbookCard.getByRole('button', {name: 'Add to Cart'}).click();
                await expect(page.locator('#cart-total')).toContainText('1 item');
                await expect(page.locator('#cart-total')).toContainText('$');
            });

            await test.step('Switch to GBP with item in cart', async()=>{
                await selectCurrency(page, 'GBP');
                await expect(page.locator('#form-currency .dropdown-toggle strong')).toHaveText('£');
            });

            await test.step('Cart total uses GBP only', async()=>{
                await expect(page.locator('#cart-total')).toContainText('£');
                await expect(page.locator('#cart-total')).not.toContainText('$');

                await page.locator('#cart > button').click();
                await expect(page.locator('#cart .dropdown-menu')).toBeVisible();
                await expect(page.locator('#cart .dropdown-menu')).toContainText('MacBook');
                await expect(page.locator('#cart .dropdown-menu')).toContainText('£');
                await expect(page.locator('#cart .dropdown-menu')).not.toContainText('$');
            });
        });

        test('N-02 | Switch currency, then add to cart', async({page})=>{
            const macbookCard = getMacbookProductCard(page);

            await test.step('Switch to EUR before adding to cart', async()=>{
                await selectCurrency(page, 'EUR');
                await expect(page.locator('#form-currency .dropdown-toggle strong')).toHaveText('€');
                await expect(macbookCard.locator('.price')).toContainText('€');
            });

            await test.step('Add MacBook and verify cart uses EUR', async()=>{
                await macbookCard.getByRole('button', {name: 'Add to Cart'}).click();
                await expect(page.locator('#cart-total')).toContainText('1 item');
                await expect(page.locator('#cart-total')).toContainText('€');
                await expect(page.locator('#cart-total')).not.toContainText('$');
                await expect(page.locator('#cart-total')).not.toContainText('£');

                await page.locator('#cart > button').click();
                await expect(page.locator('#cart .dropdown-menu')).toContainText('MacBook');
                await expect(page.locator('#cart .dropdown-menu')).toContainText('€');
            });
        });

        test('N-03 | Double-click currency option', async({page})=>{
            await test.step('Double-click EUR in currency dropdown', async()=>{
                await page.locator('#form-currency .dropdown-toggle').click();
                await page.locator('button.currency-select[name="EUR"]').dblclick();
            });

            await test.step('Page stays stable with EUR applied once', async()=>{
                await expect(page).toHaveURL(/route=common\/home/);
                await expect(page.locator('.alert-danger')).toHaveCount(0);
                await expect(page.locator('#form-currency .dropdown-toggle strong')).toHaveText('€');
                await expect(page.locator('.product-thumb .price').first()).toContainText('€');
            });
        });
    });

});