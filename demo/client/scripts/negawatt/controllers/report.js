'use strict';

angular.module('app')
  .controller('AccountReportCtrl', [
    '$scope',
    'Account',
    'Chart',
    'Electricity',
    'Utils',
    function($scope, Account, Chart, Electricity, Utils) {

    $scope.pieChart = {};
    $scope.pieChart.data = [
      {
        label: "תאורת חוץ",
        data: 3126998
      }, {
        label: "חינוך",
        data: 2852161
      }, {
        label: "עיריה",
        data: 646544
      }, {
        label: "רווחה",
        data: 312385
      }, {
        label: "שרותי דת",
        data: 161725
      }, {
        label: "בריאות",
        data: 79081
      }, {
        label: "בטחון",
        data: 71611
      }, {
        label: "ספורט",
        data: 46440
      }, {
        label: "עמותה",
        data: 26378
      }
    ];
    $scope.pieChart.options = {
      series: {
        pie: {
          show: true
        }
      },
      legend: {
        show: true
      },
      grid: {
        hoverable: true,
        clickable: true
      },
      colors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
      tooltip: true,
      tooltipOpts: {
        content: "%p.0%, %s",
        defaultTheme: false
      }
    };


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
        label: 'תעריף שיא'
      },
      {
        label: 'תעריף גבע'
      },
      {
        label: 'תעריף שפל'
      },
      {
        label: 'ללא תעו״ז'
      }
    ];

    /**
     * Get the chart data and plot.
     */
    $scope.getChartData = function() {
      var filters = {
        meter: 257,
        type: 'month'
      };

      Electricity.get(Utils.createQueryString(filters)).then(function(data) {
        console.log(data)
      });
    }

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
        $scope.$broadcast('report_change');
      });
    };

    // Select last year report like default.
    $scope.getChartData();

  }]);