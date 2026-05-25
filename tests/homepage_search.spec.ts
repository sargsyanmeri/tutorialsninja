import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';


test.describe('',()=>{

    test.beforeEach(async({page})=>{
            await page.goto(APP_ROUTES.home); // HTML, CSS
            await expect(page.locator("#menu")).toBeVisible();
    
    })


    
});