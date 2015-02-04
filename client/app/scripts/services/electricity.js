'use strict';

angular.module('negawattClientApp')
  .service('Electricity', function ($q, $http, $timeout, $rootScope, ChartUsage, Config, md5, Utils) {

    // A private cache key.
    var cache = {};

    // Array of $timeout promises to clear the cache.
    var timeouts = [];

    var getElectricity;

    // Update event broadcast name.
    var broadcastUpdateEventName = 'nwElectricityChanged';

    /**
     * Return the promise with the meter list, from cache or the server.
     *
     * @returns {*}
     */
    this.get = function(chartFreq, seletctorType, selectorId) {
      // Ask ChartUsage to translate selector type and id to filters.
      var filters = ChartUsage.filtersFromSelector(chartFreq, seletctorType, selectorId);

      // Create a hash from the filters object for indexing the cache
      var filtersHash = md5.createHash(JSON.stringify(filters));

      // Preparation of the promise and cache for Electricity request.
      getElectricity = $q.when(getElectricity || cache[filtersHash] && cache[filtersHash].data || getDataFromBackend(filters, filtersHash, 0, false));

      // Clear the promise cached, after resolve or reject the promise. Permit access to the cache data, when
      // the promise excecution is done (finally).
      getElectricity.finally(function getElectricityFinally() {
        getElectricity = undefined;
      });

      return getElectricity;
    };

    /**
     * Return messages array from the server.
     *
     * @returns {$q.promise}
     */
    function getDataFromBackend(filters, filtersHash, pageNumber, skipResetCache) {
      var deferred = $q.defer();
      var url = Config.backend + '/api/electricity';
      var params = {};

      if (filters) {
        // Add filter parameters to the http request
        params = Utils.filtersToParams(filters);
      }

      // If page-number is given, add it to the params.
      if (pageNumber) {
        params['page'] = pageNumber;
      }

      $http({
        method: 'GET',
        url: url,
        params: params,
        cache: true
      }).success(function(electricity) {
        setCache(electricity.data, filtersHash, skipResetCache);

        // If there are more pages, read them.
        var hasNextPage = electricity.next != undefined;
        if (hasNextPage) {
          getDataFromBackend(filters, filtersHash, pageNumber + 1, true).then(function() {
            deferred.resolve(cache[filtersHash].data);
          });
        }
        else {
          deferred.resolve(cache[filtersHash].data);
        }
      });

      return deferred.promise;
    }

    /**
     * Save messages in cache, and broadcast an event to inform that the electricity data changed.
     *
     * @param data
     *   The data to cache.
     * @param key
     *   A key for the cached data.
     */
    function setCache(data, key, skipResetCache) {
      // Cache messages data.
      cache[key] = {
        data: (cache[key] ? cache[key].data : []).concat(data),
        timestamp: new Date()
      };

      // Broadcast an update event.
      $rootScope.$broadcast(broadcastUpdateEventName, cache[key].data);

      if (skipResetCache) {
        return;
      }

      // Clear cache in 60 seconds.
      timeouts.push($timeout(function() {
        if (angular.isDefined(cache[key])) {
          cache[key].data = undefined;
        }
      }, 60000));
    }

    $rootScope.$on('nwClearCache', function() {
      cache = {};

      // Cancel Promises of timeout to clear the cache.
      angular.forEach(timeouts, function(timeout) {
        $timeout.cancel(timeout);
      });

      // Destroy pile of timeouts.
      timeouts = [];
    });
  });

