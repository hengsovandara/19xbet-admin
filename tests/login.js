module.exports = {
  '@tags': 'login',
  'Login as Admin': function(browser) {
    // Browser is the browser that is being controlled

    // console.log(browser.globals);

    const browserURL = browser.launchUrl;
    const phonTextInputSelector = 'input[name="phone"]';
    const pinTextInputSelector = 'input[name="pin"]';
    const loginButtonSelector = '.btn-login';

    const roleTextSelector = '.role'; 
    const menuButtonSelector = '.menu';

    browser
      .url(browserURL)
      .assert.urlContains('/login')
      .waitForElementVisible('body')
      .waitForElementVisible(phonTextInputSelector)
      .waitForElementVisible(pinTextInputSelector)
      .assert.valueContains(phonTextInputSelector, '012345678')
      .setValue(phonTextInputSelector, '9')
      .assert.valueContains(pinTextInputSelector, '12345')
      .click(loginButtonSelector);
    
    // browser
    //   .assert.urlEquals(browserURL)
    //   .waitForElementVisible(menuButtonSelector)
    //   .waitForElementPresent(roleTextSelector, false, function(result) {
    //     result.value && browser.click(menuButtonSelector);
    //   })
    //   .waitForElementVisible(roleTextSelector)
    //   .assert.containsText(roleTextSelector, 'admin');

    const profileImageSelector = '.profile-img svg';
    const profileIconSelector = '.profile-img img'
    const usernameTextSelector = '.username';
    
    const consumersCardSelector = '.card-consumers';
    const merchantsCardSelector = '.card-merchants';

    const totalConsumersTextSelector = '.total-consumers';
    const totalMerchantsTextSelector = '.total-merchants';
    const pendingConsumersTextSelector = '.pending-consumers';
    const pendingMerchantsTextSelector = '.pending-merchants';
    const activatedConsumersTextSelector = '.activated-consumers';
    const activatedMerchantsTextSelector = '.activated-merchants';
    const declinedConsumersTextSelector = '.declined-consumers';
    const declinedMerchantsTextSelector = '.declined-merchants';

    // Testing Dashbord
    browser
      .assert.urlEquals(browserURL)
      .waitForElementVisible('body')
      .assert.visible(menuButtonSelector)
      .assert.visible(usernameTextSelector)
      .assert.visible(roleTextSelector)
      // Check there is profile image
      // .assert.visible(profileImageSelector)
      // Click user's profile & the new profile is visible
      // *** For now I have no idea how to select file to upload the image ***
      // .click(profileImageSelector, function(result) {
      //   browser
      //     .waitForElementVisible('.uploaded-profile')
      //     .click('.uploaded-profile')
      // })
      
      .assert.visible(consumersCardSelector)
      .assert.visible(totalConsumersTextSelector)
      .assert.visible(pendingConsumersTextSelector)
      .assert.visible(activatedConsumersTextSelector)
      .assert.visible(declinedConsumersTextSelector)

      .assert.visible(merchantsCardSelector)
      .assert.visible(totalMerchantsTextSelector)
      .assert.visible(pendingMerchantsTextSelector)
      .assert.visible(activatedMerchantsTextSelector)
      .assert.visible(declinedMerchantsTextSelector);

    browser
      // Consumer card is clickable
      .click(consumersCardSelector)
      .pause(5000);
      // Merchant card is clickable
      // .back(function(results) {
      //   browser.assert.urlEquals(browserURL)
      // })
      // .pause(5000)
      // .click(merchantsCardSelector);
      // .pause(5000)
      // Consumer nav is clickable
      // Merchant nav is clickable
      
    // Testing Consumers List
    const statusDropdownSelector = 'input[name="status"]';
    const firstTableRowSelector = '.table-row-0';

    browser
      .waitForElementVisible('body')
      .waitForElementVisible('.header-title')
      .verify.elementPresent(firstTableRowSelector)
      
      // url `/consumers`
      // click status
      // each element in the list contains that status
      // insert value to search by name
      // each element in the list is like that name
      // contain results 0
      // visible pagination
      // click pagination
      
      .click(firstTableRowSelector)
      .pause(5000);
    // Testing Consumer's Info
    const consumerIdTextSelector = '.consumer-id';

    browser
      .verify.urlContains('/consumers?id=')
      .verify.visible(consumerIdTextSelector)

    browser.end(); // This must be called to close the browser at the end
    }
};

