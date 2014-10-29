'use strict';

angular.module('app')
  .service('Chart', function ($q) {
    var Chart = this;
    var colors = {
      primary: '#5B90BF',
      success: '#A3BE8C',
      info: '#7FABD2',
      infoAlt: '#B48EAD',
      warning: '#EBCB8B',
      danger: '#BF616A',
      gray: '#DCDCDC'
    };

    var basicOptions = {
      series: {
        lines: {
          show: true,
          fill: true,
          fillColor: {
            colors: [
              {
                opacity: 0
              },
              {
                opacity: 0.3
              }
            ]
          }
        },
        points: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: "#ffffff",
          symbol: "circle",
          radius: 5
        }
      },
      colors: [colors.danger, colors.warning, colors.info, colors.success],
      tooltip: true,
      tooltipOpts: {
        defaultTheme: false
      },
      grid: {
        hoverable: true,
        clickable: true,
        tickColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#eeeeee"
      }
    };

    /**
     * Return options for type of reports.
     *
     * @returns {*}
     */
    this.options = function(type) {
      var options = {};

      switch (type) {
        case 'lastYear':
          options.axis = {
            ticks: [
              [1, 'Jan'],
              [2, 'Feb'],
              [3, 'Mar'],
              [4, 'Apr'],
              [5, 'May'],
              [6, 'Jun'],
              [7, 'Jul'],
              [8, 'Aug'],
              [9, 'Sep'],
              [10, 'Oct'],
              [11, 'Nov'],
              [12, 'Dec']
            ]
          };
          break;
        case 'lastMonth':
          options.axis = {
            ticks: [
              [1, 'week 1'],
              [2, 'week 2'],
              [3, 'week 3'],
              [4, 'week 4']
            ]
          };
          break;
        case 'lastWeek':
          options.axis = {
            ticks: [
              [1, 'Sunday'],
              [2, 'Monday'],
              [3, 'Tuesday'],
              [4, 'Wednesday'],
              [5, 'Thursday'],
              [6, 'Friday'],
              [7, 'Saturday']
            ]
          };
          break;
      }

      return angular.extend(options, basicOptions);
    };


    /**
     * Return object expected by the pieChart component.
     *
     * @returns {*} - data object.
     */
    this.mockPieChart = function() {

      // Define basic configuration.
      var mock = {
        data: [],
        options: {
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
          colors: [
            colors.primary,
            colors.success,
            colors.info,
            colors.warning,
            colors.danger
          ],
          tooltip: true,
          tooltipOpts: {
            content: "%p.0%, %s",
            defaultTheme: false
          }
        }
      };

      // Set demo data
      mock.data = [
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

      //
      mock.options = {
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
        colors: [
          colors.primary,
          colors.success,
          colors.info,
          colors.warning,
          colors.danger
        ],
        tooltip: true,
        tooltipOpts: {
          content: "%p.0%, %s",
          defaultTheme: false
        }
      };

      return mock;
    }

    /**
    * Get the response data from the service electricity via controller report.
    *
    * @param {*} - response
    * @returns {$q.promise}
    */
    this.getLineChart = function(response) {
      var deferred = $q.defer();

      //Update y axis data.
      /*
      var data = {
        data: [
          [1,125],
          [2,345],
          [3,245],
          [4,658],
          [5,659],
          [6,125],
          [7,345],
          [8,245],
          [9,658],
          [10,659],
          [11,659],
          [12,659]
        ]
      };
      */
      var line = {};

      // Chart.js Data
      line.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: 'My Second dataset',
            fillColor: 'rgba(151,187,205,0.2)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      };

      // Chart.js Options
      line.options =  {

        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        // Function - on animation progress
        onAnimationProgress: function(){},

        // Function - on animation complete
        onAnimationComplete: function(){},

        //String - A legend template
        legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
      };

      deferred.resolve(line);
      return deferred.promise;
    }

  });
