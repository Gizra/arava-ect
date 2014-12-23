'use strict';

angular.module('negawattClientApp')
  .service('Meter', function ($q, $http, $timeout, $filter, $state, $rootScope, Config, Marker, Utils) {

    // A private cache key.
    var cache = {};

    /**
     * Return a promise with the meter list, from cache or the server.
     *
     * @param categoryId
     *  The category ID
     *
     * @returns {Promise}
     *
     */
    this.get = function(categoryId) {
      var gettingMeters = $q.when(cache.data || getDataFromBackend());

      // Filtering in the case we have categoryId defined.
      if (angular.isDefined(categoryId)) {
        gettingMeters = gettingMetersFilterByCategory(gettingMeters, categoryId);
      }

      return gettingMeters;
    };

    /**
     * Return meters array from the server.
     *
     * @returns {$q.promise}
     */
    function getDataFromBackend() {
      var deferred = $q.defer();
      var url = Config.backend + '/api/iec_meters';
      $http({
        method: 'GET',
        url: url,
        transformResponse: prepareMetersForLeafletMarkers
      }).success(function(meters) {
        setCache(meters);
        deferred.resolve(cache.data);
      });

      return deferred.promise;
    }

    /**
     * Save meters in cache, and broadcast en event to inform that the meters data changed.
     *
     * @param data
     */
    function setCache(data) {
      // Cache meters data.
      cache = {
        data: data,
        timestamp: new Date()
      };
      // Clear cache in 60 seconds.
      $timeout(function() {
        cache.data = undefined;
      }, 60000);
      $rootScope.$broadcast('negawattMetersChanged');
    }

    /**
     * Convert the array of list of meters to and object of meters.
     *
     * Also prepare the lang and lat values so Leaflet can pick them up.
     *
     * @param list []
     *   List of meters in an array.
     *
     * @returns {*}
     *   List of meters organized in an object, each meter it's a property keyed
     *   by the id.
     */
    function prepareMetersForLeafletMarkers(list) {
      var meters = {};

      // Convert response serialized to an object.
      if (angular.isString(list)) {
        list = angular.fromJson(list).data;
      }

      angular.forEach(list, function(item) {
        meters[item.id] = item;

        // Convert the geo location properties as expected by leaflet map.
        if (item.location) {
          meters[item.id].lat = parseFloat(item.location.lat);
          meters[item.id].lng = parseFloat(item.location.lng);

          delete item.location;
        }

        // Set meter tooltip
        meters[item.id].message = item.place_description + '<br>' + item.place_address + '<br>' + item.place_locality;

        // Extend meter with marker properties and methods.
        angular.extend(meters[item.id], Marker);
        // Define default icon properties and methods, in order, to be changed later.
        meters[item.id].unselect();
      });

      return meters;
    }

    /**
     * Return a promise with the meter list, from cache or the server. Filter by a category.
     *
     * @param gettingMeter - {$q.promise}
     *    Promise with the list of meters.
     *
     * @param categoryId
     *    The category ID.
     *
     * @returns {$q.promise}
     *    Promise of a list of meters filter by category..
     */
    function gettingMetersFilterByCategory(gettingMeter, categoryId) {
      var deferred = $q.defer();

      // Filter meters with a category.
      gettingMeter.then(function(meters) {
        meters = Utils.indexById($filter('filter')(Utils.toArray(meters), {meter_categories: categoryId}, true));
        deferred.resolve(meters);
      });

      return deferred.promise;
    }


  });
