import { expect, Locator, Page } from '@playwright/test';
import userData from '../userData.json';
import fs from 'fs';

export class RegisterPage {
  private readonly page: Page;
  private readonly goToRegister: Locator;
  private readonly submitButton: Locator;
  private readonly expectedErrors: string[];
  private readonly resultBox: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.goToRegister = this.page.locator('a[class="ico-register"]');
    this.submitButton = this.page.locator('#register-button');
    this.resultBox = this.page.locator('.result');
    this.expectedErrors = [
      'First name is required.',
      'Last name is required.',
      'Email is required.',
      'Password is required.',
      'Password is required.'
    ];
  }

  async navigate() {
    await this.page.goto('https://demowebshop.tricentis.com/');
    await this.goToRegister.click();
  }


  async getUniqueEmail(): Promise<string> {
    // Leer el archivo counter.json
    const data = fs.readFileSync('userData.json', 'utf-8');
    const userData = JSON.parse(data);
  
    // Generar un correo electrónico con el número actual
    const uniqueEmail = `Angel.Santicheems${userData.user.count}@example.com`;
  
    // Incrementar el contador y guardar de nuevo en el archivo
    userData.user.count += 1;
    fs.writeFileSync('userData.json', JSON.stringify(userData, null, 2));
  
    return uniqueEmail;
  }

  async registerWithValidData() {
    const uniqueEmail = await this.getUniqueEmail();

    await this.page.fill('#FirstName', userData.user.firstName);
    await this.page.fill('#LastName', userData.user.lastName);
    await this.page.fill('#Email', uniqueEmail);
    await this.page.fill('#Password', userData.user.password);
    await this.page.fill('#ConfirmPassword', userData.user.password);
    await this.submitButton.click();
  }

  async validateRegister() {
    await this.registerWithValidData();
    return this.validateRegisterMessage();
  }

  async validateRegisterMessage(){
    const resultText = await this.resultBox.textContent();
    return await resultText?.includes('Your registration completed');
  }

  async areAllErrorsPresent(actualErrors: string[]): Promise<boolean> {
    return this.expectedErrors.every(error => actualErrors.includes(error));
  }

  async validateErrorMessages() {
    await this.submitButton.click();
    return this.areAllErrorsPresent(await this.page.locator('.field-validation-error').allTextContents());
  }
}