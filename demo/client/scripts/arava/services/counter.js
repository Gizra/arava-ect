'use strict';

angular.module('app')
  .service('Counter', function ($q, $http, BACKEND_URL) {

    /**
     * Return counters
     *
     *   {
     *     lists: [
     *       counter1: {
     *         lat:,
     *         lng:,
     *         focus: false,
     *         message: 'test message',
     *         title: 'test title',
     *         draggable: false
     *       }
     *
     *     ]
     *  }
     *
     * @returns {*}
     */
    this.get = function() {
    var url = BACKEND_URL + '/dashboard';
//      var url = 'data/counters.json';

      return $http({
        method: 'GET',
        url: url
      });
    };

  });
