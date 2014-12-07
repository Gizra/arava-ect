'use strict';

angular.module('negawattClientApp')
  .service('Auth', function($injector, Utils, localStorageService, NegawattConfig) {
    /**
     * Login by calling the Drupal REST server.
     *
     * @param user
     *   Object with the properties "username" and "password".
     *
     * @returns {*}
     */
    this.login = function(user) {
      // Service 'Auth' can't depend on '$http', hence injecting it manually
      return $injector.get('$http')({
        method: 'GET',
        url: NegawattConfig.backend + '/api/login-token',
        headers: {
          'Authorization': 'Basic ' + Utils.Base64.encode(user.username + ':' + user.password)
        }
      });
    };

    /**
     * Logout current user.
     *
     * Do whatever cleaning up is required.
     */
    this.logout = function() {
      localStorageService.remove('access_token');
    };

    /**
     * A user is logged in.
     */
    this.isAuthenticated = function() {
      return !!localStorageService.get('access_token');
    };

    /**
     * Authentication failed, set state to login.
     */
    this.authFailed = function() {
      // Something went wrong, change state back to login
      // Service 'Auth' can't depend on '$state', hence injecting it manually
      $injector.get('$state').go('login');
      this.logout();
    };
  });
