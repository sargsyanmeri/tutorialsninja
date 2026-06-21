import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';


test.describe('Homepage Slider - Positive scenarios', { tag: ['@slider', '@positive'] }, ()=>{

    test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home);
        await expect(page.locator('.swiper-viewport')).toHaveCount(2);
    })

    test('P-01 | Homepage shows two sliders', async({page})=>{
        const firstSlider = page.locator('.swiper-viewport').first();
        await expect(firstSlider.locator('.swiper-button-next')).toBeVisible();
        await expect(firstSlider.locator('.swiper-button-prev')).toBeVisible();
        await expect(firstSlider.locator('.swiper-pagination')).toBeVisible();
    });

    test('P-02 | Second slider has Next and Prev buttons', async({page})=>{
        const secondSlider = page.locator('.swiper-viewport').nth(1);
        await expect(secondSlider.locator('.swiper-button-next')).toBeVisible();
        await expect(secondSlider.locator('.swiper-button-prev')).toBeVisible();
    });

    test('P-03 | Next button changes active slide in first slider', async({page})=>{
        const firstSlider = page.locator('.swiper-viewport').first();
        const activeImage = firstSlider.locator('.swiper-slide-active img');

        const srcBefore = await activeImage.getAttribute('src');
        await firstSlider.locator('.swiper-button-next').click();

        await expect(activeImage).toBeVisible();
        await expect(activeImage).not.toHaveAttribute('src', srcBefore ?? '');
    });

    test('P-04 | Second slider has pagination bullets ', async({page})=>{
        await expect(page.locator('.swiper-viewport').nth(1)).toBeVisible();
        await expect(page.locator('.swiper-pagination.carousel0')).toBeVisible();
    });

    test('P-05 | Clicking bullet sets active bullet in second slider', async ({ page }) => {
        const secondSlider = page.locator('.swiper-viewport').nth(1);
        const targetBullet = secondSlider.locator('.swiper-pagination-bullet').nth(2);

        await targetBullet.click();

        await expect(targetBullet).toHaveClass(/swiper-pagination-bullet-active/);
        await expect(targetBullet).toBeVisible();
    });

   test('P-06 | First slider shows one active image', async({page})=>{
       const firstSlider = page.locator('.swiper-viewport').first();
       await expect(firstSlider.locator('.swiper-slide-active img')).toBeVisible();
    });

    test('P-07 | Prev button changes active slide in first slider ', async({page})=>{
        const firstSlider = page.locator('.swiper-viewport').first();
        const activeImage = firstSlider.locator('.swiper-slide-active img');

        const srcBefore = await activeImage.getAttribute('src');
        await firstSlider.locator('.swiper-button-prev').click();

        await expect(activeImage).toBeVisible();
        await expect(activeImage).not.toHaveAttribute('src', srcBefore ?? '');
    });
});

test.describe('Homepage Slider - Negative scenarios', { tag: ['@slider', '@negative'] }, ()=>{

    test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home);
        await expect(page.locator('.swiper-viewport')).toHaveCount(2);
    })

    test('N-01 | Third slider does not exist', async({page})=>{
        const sliders = page.locator('.swiper-viewport');
        await expect(sliders).toHaveCount(2);
    });

    test('N-02 | Active image is not empty after Next click', async({page})=>{
        const firstSlider = page.locator('.swiper-viewport').first();
        await firstSlider.locator('.swiper-button-next').click();
        const activeImage = firstSlider.locator('.swiper-slide-active img');
        await expect(activeImage).toBeVisible();
        await expect(activeImage).toHaveAttribute('src', /\S+/);
    });

    test('N-03 | Slider images do not have empty src', async ({ page }) => {
    const firstSlider = page.locator('.swiper-viewport').first();
    const images = firstSlider.locator('.swiper-slide img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
        await expect(images.nth(i)).toHaveAttribute('src', /\S+/);
    }
    });

    test('N-04 | Next click does not navigate away from homepage', async({page})=>{
        const currentUrl = page.url();
        const firstSlider = page.locator('.swiper-viewport').first();
        await firstSlider.locator('.swiper-button-next').click();
        await expect(page).toHaveURL(currentUrl);
    });

    test('N-05 | Second slider never has two active slides', async({page})=>{
        const secondSlider = page.locator('.swiper-viewport').nth(1);
        const activeSlides = secondSlider.locator('.swiper-slide-active');
        await expect(activeSlides).toHaveCount(1);
    });

    test('N-06 | Second slider does not have duplicate Next buttons', async({page})=>{
        const secondSlider = page.locator('.swiper-viewport').nth(1);
        const nextButtons = secondSlider.locator('.swiper-button-next');
        await expect(nextButtons).toHaveCount(1);
    });

    test('N-07 | First slider does not have two active bullets', async({page})=>{
        const firstSlider = page.locator('.swiper-viewport').first();
        const activeBullets = firstSlider.locator('.swiper-pagination-bullet-active');
        await expect(activeBullets).toHaveCount(1);
    });

});