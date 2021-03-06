(function () {
    'use strict';

    describe('ngApimock - protractor.mock.js', function () {
        var ngApimock = require('../../.tmp/some-other-dir/protractor.mock.js');

        describe('when provided without any selected scenarios', function () {
            beforeAll(function () {
                ngApimock.setGlobalVariable('replaceMe', 'y');
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('[{"a":"b"}]');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing"}' );
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('');
                });
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected scenarios', function () {
            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'some-meaningful-scenario-name');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'successful');
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should show data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"y"}]');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should show data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing"}');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('');
                });
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when changing some selected scenarios', function () {
            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'some-meaningful-scenario-name');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'successful');
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should show data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"y"}]');
                    ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'another-meaningful-scenario-name');
                    element(by.buttonText('refresh')).click();
                    expect(element(by.binding('ctrl.data')).getText()).toBe('[{"a":"b"}]');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
                    element(by.buttonText('post me')).click();
                });

                it('should show data', function () {
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing"}');
                    ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'anotherSuccess');
                    element(by.buttonText('post me')).click();

                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('{"some":"thing else"}');
                    ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'internal-server-error');

                    element(by.buttonText('post me')).click();
                    expect(element(by.binding('ctrl.postedData')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.postedError')).getText()).toBe('500');
                });
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when provided with some selected error scenarios', function () {

            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'internal-server-error');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'internal-server-error');
                ngApimock.addMockModule();

                browser.get('/index.html');
            });

            describe('when fetching data with a service', function() {
                it('should not show any data', function () {
                    expect(element(by.binding('ctrl.data')).getText()).toBe('');
                });

                it('should not show any errors', function () {
                    expect(element(by.binding('ctrl.error')).getText()).toBe('500');
                });
            });

            describe('when posting data with a service', function() {
                beforeAll(function() {
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
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });

        describe('when changing some global variables', function () {
            beforeAll(function () {
                ngApimock.selectScenario(require('../mocks/some-api-get.json'), 'some-meaningful-scenario-name');
                ngApimock.selectScenario(require('../mocks/some-api-post.json'), 'successful');
                ngApimock.setGlobalVariable('replaceMe', 'y');
                ngApimock.addMockModule();
                browser.get('/index.html');
            });

            it('should show previously set variable', function () {
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"y"}]');
            });

            it('should show the new value', function () {
                ngApimock.setGlobalVariable('replaceMe', 'x');
                element(by.buttonText('refresh')).click();
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"x"}]');
            });

            it('should show the original value', function () {
                ngApimock.deleteGlobalVariable('replaceMe');
                element(by.buttonText('refresh')).click();
                expect(element(by.binding('ctrl.data')).getText()).toBe('[{"x":"%%replaceMe%%"}]');
            });

            afterAll(function () {
                ngApimock.removeMockModule();
                ngApimock.resetScenarios();
            });
        });
    })
})();