(function () {
    'use strict';
    var MockingPO = require('./po/mocking.po');

    describe('ngApimock - ng-apimock.js', function () {
        var mocking;

        describe('when provided without any selected scenarios (passThroughs)', function () {
            beforeAll(function () {
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function () {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('');
                });
            });

            describe('when posting data with a service', function () {
                beforeAll(function () {
                    element(by.buttonText('post me')).click();
                });

                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('');
                });
            });

            afterAll(function () {
                browser.executeScript('window.localStorage.clear();');
            });
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.apiGET.sendKeys('some-meaningful-scenario-name');
                mocking.apiPOST.sendKeys('successful');
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function () {
                it('should show data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"%%replaceMe%%"}]');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('');
                });
            });

            describe('when posting data with a service', function () {
                beforeAll(function () {
                    element(by.buttonText('post me')).click();
                });

                it('should show data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing"}');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('');
                });
            });

            describe('when echoing posted data with a service', function () {
                beforeAll(function () {
                    browser.get('/mocking');
                    mocking = new MockingPO();
                    mocking.echoPOST.click();
                    browser.get('/index.html');
                    element(by.buttonText('post me')).click();
                });

                it('should show data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing"}');
                    expect(element(by.binding('ctrl.logging')).getText()).toContain('\'online/rest/some/api/.*/and/.*\' with payload');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('');
                });
            });

            afterAll(function () {
                browser.executeScript('window.localStorage.clear();');
            })
        });

        describe('when provided with some selected error scenarios', function () {
            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.apiGET.sendKeys('internal-server-error');
                mocking.apiPOST.sendKeys('internal-server-error');
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function () {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('500');
                });
            });

            describe('when posting data with a service', function () {
                beforeAll(function () {
                    element(by.buttonText('post me')).click();
                });

                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('500');
                });
            });

            afterAll(function () {
                browser.executeScript('window.localStorage.clear();');
            });
        });

        describe('when provided with some global variables', function () {
            beforeAll(function () {
                browser.get('/mocking');
                mocking = new MockingPO();
                mocking.apiGET.sendKeys('some-meaningful-scenario-name');
                mocking.apiPOST.sendKeys('successful');
                mocking.addVariable('replaceMe', 'y');
                browser.get('/index.html');
            });

            it('should show previously set variable', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"y"}]');
            });

            it('should show the new value when overriding the variable by adding another with the same key', function () {
                browser.get('/mocking');
                mocking.addVariable('replaceMe', 'x');
                browser.get('/index.html');
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"x"}]');
            });

            it('should show the new value when changing it', function () {
                browser.get('/mocking');
                mocking.updateVariable('replaceMe', 'z');
                browser.get('/index.html');
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"z"}]');
            });

            it('should show the origina value when deleting the variable', function () {
                browser.get('/mocking');
                mocking.deleteVariable('replaceMe');
                browser.get('/index.html');
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"%%replaceMe%%"}]');
            });

            afterAll(function () {
                browser.executeScript('window.localStorage.clear();');
            })
        });
    })
})();