module.exports = {
  '@tags': 'dashboard',
  'Dashboard': function(browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body')
      .end();
  }
};
