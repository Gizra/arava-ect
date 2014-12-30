'use strict';

angular.module('negawattClientApp')
  .controller('DashboardCtrl', function ($scope, $state, $stateParams, ChartUsage, Meter, Map, Category, meters, messages, mapConfig, categories, profile, usage) {
    // Set Map initial center position, according the account.
    Map.setCenter(profile.account.center);

    // Initialize values.
    $scope.defaults = mapConfig;
    $scope.meters = meters;
    $scope.center = Map.getCenter();
    $scope.messages = messages;
    $scope.categories = categories;
    $scope.profile = profile;
    $scope.usageChart = usage;

    /**
     * Set the selected Meter.
     *
     * @param id int
     *   The Marker ID.
     */
    function setSelectedMarker(id) {
      $scope.meters[id].select();
      // Use in the widget 'Details'.
      $scope.meterSelected = $scope.meters[id];
      // Let ChartUsage set chart title
      ChartUsage.meterSelected($scope.meterSelected);
    }

    /**
     * Set the selected category.
     *
     * @param id int
     *   The Category ID.
     */
    function setSelectedCategory(id) {
      Category.setSelectedCategory($stateParams.categoryId);
    }

    if ($stateParams.markerId) {
      setSelectedMarker($stateParams.markerId);
    }

    if ($stateParams.categoryId) {
      setSelectedCategory($stateParams.markerId);
    }


    // Select marker in the Map.
    $scope.$on('leafletDirectiveMarker.click', function(event, args) {
      $state.go('dashboard.controls.markers', {markerId: args.markerName, categoryId: Category.getSelectedCategory()});
    });

    /**
     * Determine if a category has meters.
     *
     * @param category
     *    The category.
     *
     * @returns {boolean}
     *    True if category has meters.
     */
    $scope.hasMeters = function(category) {
      return !!category.meters;
    };

  });
