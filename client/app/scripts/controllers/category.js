'use strict';

/**
 * @ngdoc function
 * @name negawattClientApp.controller: CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the negawattClientApp
 */
angular.module('negawattClientApp')
  .controller('CategoryCtrl', function ($scope, $state, ChartCategories, categoriesChart) {
    var categoryId;
    $scope.categoriesChart = categoriesChart;

    // Select category form the pie chart.
    $scope.onSelect = function(selectedItem, chartData) {
      categoryId = ChartCategories.getCategoryIdSelected(selectedItem, chartData);
      if (angular.isDefined(categoryId)) {
        $state.go('dashboard.controls.categories', {categoryId: categoryId});
      }
    };

  });
