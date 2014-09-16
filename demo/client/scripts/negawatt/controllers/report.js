'use strict';

angular.module('app')
  .controller('AccountReportCtrl', ['$scope', 'Account', 'Chart', function($scope, Account, Chart) {

    // Get pie chart data.
    Chart.getPieChart('piechartgroups')
      .then(function(response){
        $scope.pieChart = response.data;
        // Refresh chart.
        $scope.$broadcast('report_change', {chart: 'pieChart'});
      });

    // Private functions.
    /**
     * Set type report into scope property and handle ng-class options.
     *
     * @param type
     *   string indicating the type of report ('current'. 'lastWeek', 'lastMonth', 'lastYear')
     */
    function setReport(type) {
      $scope.selected = {};
      $scope.typeReport = type;

      switch (type) {
        case 'current':
          $scope.selected.current = {'selected': true };
          break;
        case 'lastWeek':
          $scope.selected.lastWeek = {'selected': true };
          break;
        case 'lastMonth':
          $scope.selected.lastMonth = {'selected': true };
          break;
        case 'lastYear':
          $scope.selected.lastYear = {'selected': true };
          break;
      }
    }

    $scope.line1 = {};
    $scope.line1.data = [
      {
        label: 'highRate Kwh.'
      },
      {
        label: 'mediumRate Kwh.'
      },
      {
        label: 'lowRate Kwh.'
      },
      {
        label: 'fixedRate Kwh.'
      }
    ];

    /**
     * Switch by the between the different types of charts (monthly, weekly, daily)     *
     *
     * @param type
     *   string that indicate the type of the report. (lastYear, lastMonth, lastWeek)
     */
    $scope.selectReport = function(type) {
      // Set selection of type report.
      setReport(type);

      // Update x axis labels.
      $scope.line1.options = Chart.options(type);

      // Get account (city) consumption information.
      Account.getReport(type).then(function(response) {
        // Update data.
        $scope.line1.data[0].data = response.data.high;
        // Update detailed.
        $scope.line1.data[1].data = response.data.medium;
        $scope.line1.data[2].data = response.data.low;
        $scope.line1.data[3].data = response.data.fixed;

        // Refresh chart.
        $scope.$broadcast('report_change', {chart: 'line1'});
      });
    };

    // Select last year report like default.
    $scope.selectReport('lastYear');

  }]);
