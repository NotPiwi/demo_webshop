import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { MainAndPurchasePage } from '../pages/PurchasePage';

test.describe('Register', () => {
  test('TC01_DemoWebShop_Register_ValidateErrorMessages', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    expect(await registerPage.validateErrorMessages()).toBeTruthy(); 
  });

  test('TC02_DemoWebShop_Register_RegistrationSuccess', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    expect(await registerPage.validateRegister()).toBeTruthy();
  });
});

test.describe('Login', () => {
  test('TC03_DemoWebShop_Login_LoginSuccess', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();

    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('TC04_DemoWebShop_Login_ForgottenPassword', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.forgotPassword();

    expect(await loginPage.verifyForgotPasswordMessage()).toBeTruthy();
  });
});
test.describe('Purchase', () => {
  let loginPage: LoginPage;
  let purchasePage: MainAndPurchasePage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    purchasePage = new MainAndPurchasePage(page);

    await loginPage.navigate();
    await loginPage.login();

    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('TC05_DemoWebShop_Purchase_PurchaseWhitePhoneCover_and_DiamondHeart', async ({}) => {

    await purchasePage.navigateToAccessories();
    await purchasePage.addItemsToCart();
    await purchasePage.checkout();

    expect(await purchasePage.getOrderConfirmationMessage()).toBeTruthy();
  });
});