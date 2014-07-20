angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
    .controller('PECtrl', function ($scope) {
        $scope.model = {};
        $scope.model.isOpenComplete = true;
        $scope.$watch("isOpenComplete", function(n,o) {
            if (n == o) return;
            $scope.model.isOpenComplete = n;
        });

        $scope.PEHistoryOpts = {
            xaxis: {mode: "time"}
        };

        $scope.model.data = {
            PEVsDate: [],
            realtime: []
        };
        var x = [];
        for (var i = 1; i < 31; i++) {
            var y = new Date();
            y.setDate(y.getDate() + i);
            $scope.model.data.PEVsDate.push([y.getTime(), i]);
        }

        $scope.model.visibility = true;
        $scope.toggleVisibility = function () {
            $scope.model.visibility = !$scope.model.visibility;
        };

        $scope.onsub = function() {
            alert("ADD AN AJAX CALL!");
        };
})
    .controller("DummyCtrl", function($scope) {
        $scope.model = {};
        $scope.model.isOpenComplete = false;
        $scope.$watch("isOpenComplete", function(n,o) {
            if (n == o) return;
            $scope.model.isOpenComplete = n;
        });

        $scope.model.visibility = false;
        $scope.toggleVisibility = function () {
            $scope.model.visibility = !$scope.model.visibility;
        };
    })
    .controller("InfoCtrl", function ($scope, $stateParams) {
        $scope.header = {
            title : $stateParams.company
        };
    })
    .controller('RevenueCtrl', function ($scope) {
        $scope.model = {};
        $scope.model.isOpenComplete = true;
        $scope.$watch("isOpenComplete", function(n,o) {
            if (n == o) return;
            $scope.model.isOpenComplete = n;
        });

        $scope.revQuarterlyOpts = {
            bars: {
                show: true
            },
            xaxis: {
                ticks: [[0.5,"Q1"],[1.5,"Q2"],[2.5,"Q3"],[3.5,"Q4"]],
                tickLength: 0, // disable tick
                min: 0,
                max: 4
            },
            yaxis: {
                tickLength: 0 // disable tick
            }
        };

        $scope.model.data = {
            revQuarterly: [],
            realtime: []
        };

        // TODO: ADD AJAX CALL!
        var x = [];
        for (var i = 0; i < 4; i++) {
            var y = Math.floor(Math.random() * 100000) + 50000;
            $scope.model.data.revQuarterly.push([i, y]);
        }

        $scope.model.visibility = true;
        $scope.toggleVisibility = function () {
            $scope.model.visibility = !$scope.model.visibility;
        };

        $scope.onsub = function() {
            alert("ADD AN AJAX CALL!");
        };
    })
    .controller('HomeCtrl', function ($scope, $state) {
        //TODO: Replace with AJAX
        $scope.companies = ["Apple", "Microsoft", "Capital One", "Google", "Yahoo", "Facebook"];

        $scope.selectCompany = function (comp) {
            $state.go('info', {company : comp});
        }
    })
    .directive('estimateBtn', function () {
        return {
            restrict : "A",
            templateUrl: "js/estimate-btn.tmplt.html",
            scope : {
                onsub : "="
            },
            link : function (sc, el) {
                sc.vis = {
                    entry : false
                };

                sc.disabled = {
                    giveEstimateBtn: false,
                    cancelBtn: false
                };

                sc.data = {
                    entry : ""
                };

                var btn = $($(el).find(".btn-row"));
                var entry = $($(el).find(".entry-row"));

                sc.toggleView = function (e) {
                    if (e) {
                        btn.toggle("slide", "left", function () {
                            entry.toggle("slide", "right");
                            sc.disabled.giveEstimateBtn = false;
                        });
                        sc.disabled.giveEstimateBtn = true;
                    } else {
                        entry.toggle("slide", "right", function() {
                            btn.toggle("slide", "right");
                            sc.disabled.cancelBtn = false;
                        });
                        sc.disabled.cancelBtn = true;
                        sc.data.entry = "";
                    }
                };

                sc.submit = function () {
                    sc.onsub();
                    sc.toggleView(false);
                }
            }
        }
    })
    .directive('slide', function () {
        return {
            restrict: "A",
            scope: {
                "visible": "=slide",
                "open" : "="
            },
            link: function (sc, el) {
                sc.$watch("visible", function (n, o) {
                    if (n == o) return;
                    if (!n) {
                        $(el).slideUp(400, function () {
                            sc.$apply(function() {
                                sc.open = false;
                            });
                        });
                    } else {
                        $(el).slideDown(400, function () {
                            sc.$broadcast('hideEvt');
                        });
                            sc.open = true;
                    }
                });
            }
        }
    })
    .directive('graph', function () {
        return {
            restrict: "EA",
            scope: {
                "opts" : "=graph",
                "model": "="
            },
            templateUrl: 'js/graph.tmplt.html',
            link: function (sc, el) {
                var opts = sc.opts || {};
                var $el = $($(el).find(".graph")[0]);
                var renderGraph = function () {
                    opts.data = sc.model;
                    $.plot($el, [opts], opts);
                };
                renderGraph();


                sc.$on('hideEvt', function () {
                    renderGraph();
                })
            }
        }
    });