'use strict';

angular.module('app')
  .service('Electricity', function ($q, $http, BACKEND_URL) {

    /**
     * Return electricity consumption data (Kwh).
     *
     * @param {string} filters - query string to apply in the request.
     * @returns {$q.promise}
     */
    this.get = function(filters) {
      var url = BACKEND_URL + '/api/electricity' + filters;

      return $http({
        headers: {
          'X-CSRF-Token': 'C3j6TUuskEiVQd7Bm3U2Xe_W2Ya6On659x3ObHgVs_0'
        },
        method: 'GET',
        withCredentials:  true,
        url: url
      });
    };

  });
