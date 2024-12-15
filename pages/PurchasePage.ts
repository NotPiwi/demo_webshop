import { Locator, Page } from '@playwright/test';

export class MainAndPurchasePage {
  private readonly page: Page;
  private readonly electronicsHover: Locator;
  private readonly cellphones: Locator;
  private readonly phoneCover: Locator;
  private readonly jewelry: Locator;
  private readonly diamondHeart: Locator;
  private readonly selectDropdown: Locator;
  private readonly productQuantity: Locator;
  private readonly addPhoneToCartBtn: Locator;
  private readonly addDiamondHeartToCartBtn: Locator;
  private readonly shoppingCart: Locator;
  private readonly checkoutBtn: Locator;
  private readonly termsOfService: Locator;
  private readonly continueBillingAddress: Locator;
  private readonly continueShippingAddress: Locator;
  private readonly continueShipingMethod: Locator;
  private readonly continuePaymentMethod: Locator;
  private readonly continuePaymentInformation: Locator;
  private readonly confirmBtn: Locator;
  private readonly orderMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.electronicsHover = this.page.locator('a[href*="/electronics"]').first();
    this.cellphones = this.page.locator('a[href*="/cell-phones"]').first();
    this.phoneCover = this.page.locator('//h2/a[contains(text(), "Phone Cover")]');
    this.jewelry = this.page.locator('a[href*="/jewelry"]').first();
    this.diamondHeart = this.page.locator('//h2/a[contains(text(), "Black & White Diamond Heart")]');
    this.selectDropdown = this.page.locator('select[id="product_attribute_80_1_38"]');
    this.productQuantity = this.page.locator('input[id="addtocart_80_EnteredQuantity"]');
    this.addPhoneToCartBtn = this.page.locator('input[id="add-to-cart-button-80"]');
    this.addDiamondHeartToCartBtn = this.page.locator('input[id="add-to-cart-button-14"]');
    this.shoppingCart = this.page.locator('a[href*="/cart"]').first();
    this.checkoutBtn = this.page.locator('button[id="checkout"]');
    this.termsOfService = this.page.locator('#termsofservice');
    this.continueBillingAddress = this.page.locator('input[onclick="Billing.save()"]');
    this.continueShippingAddress = this.page.locator('input[onclick="Shipping.save()"]');
    this.continueShipingMethod = this.page.locator('input[onclick="ShippingMethod.save()"]');
    this.continuePaymentMethod = this.page.locator('input[onclick="PaymentMethod.save()"]');
    this.continuePaymentInformation = this.page.locator('input[onclick="PaymentInfo.save()"]');
    this.confirmBtn = this.page.locator('input[value="Confirm"]');
    this.orderMessage = this.page.locator('.order-completed');
  }

  async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ timeout });
  }

  async getConfirmBtns(): Promise<Locator[]>{
    return await this.page.locator('input[title="Continue"]').all();
  }

  async navigateToAccessories() {
    await this.electronicsHover.hover();
    await this.waitForElement(this.cellphones);
    await this.cellphones.click();
  }

  async addItemsToCart() {
    await this.addWhitePhoneCover();
    await this.addDiamondHeart();
  }

  async addWhitePhoneCover() {
    await this.phoneCover.click();
    await this.waitForElement(this.selectDropdown);
    await this.selectDropdown.selectOption('White');
    await this.productQuantity.fill('2');
    await this.addPhoneToCartBtn.click();
  }

  async navigateToJewelry() {
    await this.jewelry.click();
  }

  async addDiamondHeart() {
    await this.navigateToJewelry();
    await this.diamondHeart.click();
    await this.addDiamondHeartToCartBtn.click();
  }

  async checkout() {
    await this.shoppingCart.click();
    await this.termsOfService.click();
    await this.checkoutBtn.click();
    await this.fillCheckoutData();
  }

  async fillCheckoutData(){
    await this.waitForElement(this.continueBillingAddress);
    await this.continueBillingAddress.click();
    await this.waitForElement(this.continueShippingAddress);
    await this.continueShippingAddress.click();
    await this.waitForElement(this.continueShipingMethod);
    await this.continueShipingMethod.click();
    await this.waitForElement(this.continuePaymentMethod);
    await this.continuePaymentMethod.click();
    await this.waitForElement(this.continuePaymentInformation);
    await this.continuePaymentInformation.click();
    
    await this.confirmBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async getOrderConfirmationMessage() {
    const orderCompletedText = await this.orderMessage.textContent();
    return await orderCompletedText?.includes('Your order has been successfully processed!');
  }
}