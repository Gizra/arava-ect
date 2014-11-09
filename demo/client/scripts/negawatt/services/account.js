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
      // If the response status is dfferent to 200 the data property is not defined.
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
     * Get leaflet map center object.
     *
     * @param account
     * @returns {{zoom: *, lat: *, lng: *}}
     */
    this.getMapCenter = function(account) {
      return {
        zoom: account.zoom,
        lat: account.lat,
        lng: account.lng
      };
    };

  });
