const seleniumServer = require('selenium-server');
const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

module.exports = {
  src_folders: ['tests'], // Folders with tests
  page_objects_path: ['page-objects'],  // Allow to logically split the page objects into smaller groups
  output_folder: 'reports', // Where to output the test reports
  selenium: {
    // Information for selenium, such as the location of the drivers ect.
    start_process: true,
    server_path: seleniumServer.path,
    host: "127.0.0.1",
    port: 4444, // Standard selenium port
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.gecko.driver': geckodriver.path
    }
  },
  test_workers: {
    // This allows more then one browser to be opened and tested in at once
    enabled: false,
    workers: 'auto'
  },
  test_settings: {
    default: {
      launch_url: "http://localhost:8080/",   // The main url to load depends on environment
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: false, 
        path: "reports/screenshots/"
      },
      globals: {
        // How long to wait (in milliseconds) before the test times out
        waitForConditionTimeout: 5000,
      },
      desiredCapabilities: {
        // The default test
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true
      }
    },
    integration: {
      launch_url: "https://ekmc-web.clik-test.com",
      globals: {
        waitForConditionTimeout: 5000,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        nativeEvents: true
      }
    },
  }
};
