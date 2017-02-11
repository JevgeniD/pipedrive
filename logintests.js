var assert = require('assert');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');

test.describe('Pipedrive', function() {
    this.timeout(100000);
    var loginField = webdriver.By.id('login');
    var passwordField = webdriver.By.id('password');
    var loginButton = webdriver.By.className('submit-button id--login');

    test.beforeEach(function() {
        driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();
        driver.get('https://app.pipedrive.com/auth/login');
    });

    test.afterEach(function() {
        driver.quit();
    });

    test.it('Login with empty password field', function() {
        return driver.findElement(loginField).sendKeys('test@test.com')
            .then(() => driver.findElement(passwordField).sendKeys(''))
            .then(() => driver.findElement(loginButton).click())
            .then(() => errorMessage = driver.findElement(webdriver.By.xpath("//form[@id='login_form']/div[3]/div")))
            .then(() => errorMessage.getText('value').then(function(value) {
                assert.equal(value, 'Please add your password');
            }));
    });

    test.it('Login with empty email field', function() {
        return driver.findElement(loginField).sendKeys('')
            .then(() => driver.findElement(passwordField).sendKeys('password'))
            .then(() => driver.findElement(loginButton).click())
            .then(() => errorMessage = driver.findElement(webdriver.By.xpath("//form[@id='login_form']/div[2]/div[1]")))
            .then(() => errorMessage.getText('value').then(function(value) {
                assert.equal(value, 'Please add your email');
            }));
    });

    test.it('Login with incorrect email', function() {
        return driver.findElement(loginField).sendKeys('wrongemail@foobar.com')
            .then(() => driver.findElement(passwordField).sendKeys('correctpassword'))
            .then(() => driver.findElement(loginButton).click())
            .then(() => errorMessage = driver.findElement(webdriver.By.xpath("//form[@id='login_form']/div[3]/div")))
            .then(() => errorMessage.getText('value').then(function(value) {
                assert.equal(value, 'Incorrect email or password');
            }));
    });

    test.it('Login with incorrect password', function() {
        return driver.findElement(loginField).sendKeys('drivepipetest@gmail.com')
            .then(() => driver.findElement(passwordField).sendKeys('wrongpassword'))
            .then(() => driver.findElement(loginButton).click())
            .then(() => errorMessage = driver.findElement(webdriver.By.xpath("//form[@id='login_form']/div[3]/div")))
            .then(() => errorMessage.getText('value').then(function(value) {
                assert.equal(value, 'Incorrect email or password');
            }));
    });

    test.it('Login with invalid email', function() {
        return driver.findElement(loginField).sendKeys('Abc.example.com')
            .then(() => driver.findElement(passwordField).sendKeys('12345678'))
            .then(() => driver.findElement(loginButton).click())
            .then(() => errorMessage = driver.findElement(webdriver.By.xpath("//form[@id='login_form']/div[2]/div[2]")))
            .then(() => errorMessage.getText('value').then(function(value) {
                assert.equal(value, 'Please add a valid email address');
            }));
    });

    test.it('Login with correct email and password', function() {
        return driver.findElement(loginField).sendKeys('drivepipetest@gmail.com')
            .then(() => driver.findElement(passwordField).sendKeys('pipedrive123'))
            .then(() => driver.findElement(loginButton).click())
            .then(() => driver.wait(() => {
                return driver.findElements(webdriver.By.xpath("//*[@class='user-profile-corner']"))
                    .then(corn => corn.length > 0);
            }));
        then(() => driver.findElement(webdriver.By.xpath("//*[@class='user-profile-corner']")).isDisplayed())
            .then(res => assert.ok(res))
    });
});
