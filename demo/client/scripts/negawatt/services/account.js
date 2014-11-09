'use strict';

angular.module('app')
  .service('Account', function Detector($http, $q, moment, BACKEND_URL, Utils) {
    /**
     * Return the first account form the collection of acconts.
     *
     * @param data
     *
     * @returns {*}
     */
    function firstAccount(data) {
      data = JSON.parse(data);
      // If the response status is different to 200 the data property is not defined.
      if (angular.isUndefined(data.data)) {
        return;
      }

      data = data.data[0];

      data.location.lat = parseFloat(data.location.lat);
      data.location.lng = parseFloat(data.location.lng);
      data.location.zoom = parseInt(data.zoom);

      delete data['zoom'];

      return data;
    }

    function orderMenu(data) {
      data = JSON.parse(data);
      // If the response status is different to 200 the data property is not defined.
      if (angular.isUndefined(data.data)) {
        return;
      }

      var items = data.data;

      console.log(Object.keys(items));

      return data;
    }

    /**
     * Get accounts first account.
     *
     * @param filters
     *
     * @returns {*}
     */
    this.getAccount = function (filters) {
      var url = BACKEND_URL + '/api/accounts' + Utils.createQueryString(filters);

      var options = {
        method: 'GET',
        url: url,
        transformResponse: firstAccount
      };

      return $http(options);
    };

    /**
     * Return a collection of categories.
     *
     * @returns {$http}
     */
    this.getCategories = function() {
      return $http({
        method: 'GET',
        url: BACKEND_URL + '/api/meter_categories',
        transformResponse: orderMenu
      });
    };

  });
