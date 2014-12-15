'use strict';

/**
 * @ngdoc overview
 * @name negawattClientApp
 * @description
 * # negawattClientApp
 *
 * Main module of the application.
 */
angular
  .module('negawattClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive',
    'config',
    'LocalStorageModule',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    // For any unmatched url, redirect to '/'.
    $urlRouterProvider.otherwise('/dashboard');

    // Setup the states.
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'views/login.html'
      })
      .state('dashboard', {
        abstract: true,
        templateUrl: 'views/dashboard/main.html',
        resolve: {
          meters: function(Meter) {
            return Meter.get();
          },
          messages: function(Message) {
            return Message.get();
          },
          mapConfig: function(Map) {
            return Map.getConfig();
          },
          categories: function(Category) {
            return Category.get();
          },
          profile: function(Profile) {
            return Profile.get();
          }
        },
        controller: 'DashboardCtrl'
      })
      .state('dashboard.controls',  {
        url: '/dashboard',
        views: {
          menu: {
            templateUrl: 'views/dashboard/main.menu.html'
          },
          categories: {
            templateUrl: 'views/dashboard/main.categories.html'
          },
          messages: {
            templateUrl: 'views/dashboard/main.messages.html'
          },
          details: {
            templateUrl: 'views/dashboard/main.details.html'
          },
          usage: {
            templateUrl: 'views/dashboard/main.usage.html'
          }
        }
      })
      .state('dashboard.controls.markers', {
        url: '/marker/:id',
        controller: 'DashboardCtrl'
      });

    // Define interceptors.
    $httpProvider.interceptors.push(function ($q, Auth, $location, localStorageService) {
      return {
        'request': function (config) {
          if (!config.url.match(/login-token/)) {
            config.headers = {
              'access_token': localStorageService.get('access_token')
            };
          }
          return config;
        },

        'response': function(result) {
          if (result.data.access_token) {
            localStorageService.set('access_token', result.data.access_token);
          }
          return result;
        },

        'responseError': function (response) {
          if (response.status === 401) {
            Auth.authFailed();
          }
          return $q.reject(response);
        }
      };
    });

  });

