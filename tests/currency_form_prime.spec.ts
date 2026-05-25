import {expect, test, Page} from '@playwright/test';
import {APP_ROUTES} from './app_routes';

test.describe('Positive scenarios', ()=>{
    test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home); // HTML, CSS
        await expect(page.locator("#menu")).toBeVisible();
    });

    



- P-01 | Currency form is visible on home | На главной видна форма смены валюты
- P-02 | Currency form posts to store currency route | Форма отправляется POST на common/currency/currency
- P-03 | Currency dropdown toggle is enabled | Переключатель валюты в шапке активен
- P-04 | All demo currencies are listed in dropdown | В списке есть EUR, GBP и USD
- P-05 | Selecting EUR updates toggle label | Выбор Euro обновляет подпись переключателя
- P-06 | Selecting GBP updates toggle label | Выбор фунта обновляет подпись переключателя
- P-07 | Selecting USD updates toggle label | Выбор доллара обновляет подпись переключателя
- P-08 | Hidden redirect field matches home URL | Скрытое поле redirect совпадает с URL главной
- P-09 | After currency change user stays on home | После смены валюты остаёмся на главной
- P-10 | Featured prices reflect selected currency symbol | Цены Featured отражают символ валюты (€ после EUR)

});


test.describe('Positive scenarios', ()=>{
    test.beforeEach(async({page})=>{
        await page.goto(APP_ROUTES.home); // HTML, CSS
        await expect(page.locator("#menu")).toBeVisible();
    });

    


- N-01 | Invalid currency code POST falls back to USD cookie | Неверный код — cookie currency остаётся USD
- N-02 | Lowercase currency code is rejected for cookie | Нижний регистр кода не активирует EUR
- N-03 | Empty code POST still returns redirect | Пустой code — ответ редирект, не 5xx
- N-04 | XSS-like code does not trigger alert dialog | XSS в code не вызывает браузерный alert
- N-05 | Overlong currency code does not set rogue cookie value | Длинный код не попадёт в cookie целиком
- N-06 | GET currency route does not return server error | GET на endpoint валюты без 5xx
- N-07 | UI still allows EUR after invalid code submit in same tab | После неверного code из UI можно выбрать EUR
- N-08 | External redirect target does not leave demo host | Внешний redirect не уводит с tutorialsninja
- N-09 | Whitespace-only currency code returns redirect | Пробелы в code — редирект без 5xx
- N-10 | Numeric-only currency code falls back to USD | Числовой код — cookie USD


});