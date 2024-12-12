import { Locator, Page } from '@playwright/test';
import userData from '../userData.json';

export class LoginPage {
  private readonly page: Page;
  private readonly goToLogin: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPassLink: Locator;
  private readonly sendEmail: Locator;
  private readonly forgotPassSuccesMessage: Locator;
  private readonly myAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToLogin = this.page.locator('a[class="ico-login"]');
    this.loginButton = this.page.locator('input[value="Log in"]');
    this.forgotPassLink = this.page.locator('a[href*="passwordrecovery"]');
    this.sendEmail = this.page.locator('input[name="send-email"]');
    this.forgotPassSuccesMessage = this.page.locator('.result');
    this.myAccount = this.page.locator('.account', { hasText: userData.user.email });
  }

  async navigate() {
    await this.page.goto('https://demowebshop.tricentis.com/');
    await this.goToLogin.click();
  }

  async login() {
    await this.page.fill('#Email', userData.user.email);
    await this.page.fill('#Password', userData.user.password);
    await this.loginButton.click();
  }

  async isLoggedIn() {
    await this.page.waitForURL('https://demowebshop.tricentis.com/');
    return await this.myAccount.isVisible();
  }

  async forgotPassword() {
    await this.forgotPassLink.click();
    await this.page.fill('#Email', userData.user.email);
    await this.sendEmail.click();
  }

  async verifyForgotPasswordMessage() {
    const resultText = await this.forgotPassSuccesMessage.textContent();
    return await resultText?.includes('Email with instructions has been sent to you.');
  }
}