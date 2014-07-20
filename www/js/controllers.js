angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
    .controller('PECtrl', function ($scope, $http, $rootScope, PubNub)  {
        $scope.model = {};
        $scope.model.isOpenComplete = true;
        $scope.$watch("isOpenComplete", function(n,o) {
            if (n == o) return;
            $scope.model.isOpenComplete = n;
        });

        $scope.model.estimate = "";
        $scope.PEHistoryOpts = {
            xaxis: {mode: "time"}
        };

        $scope.model.data = {
            PEVsDate: [],
            realtime: []
        };
        $scope.model.data.crowdsourced = [];
        $scope.model.data.crowdsourced_median = 0;

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

        $scope.model.gaveEstimate = false;
        $scope.onsub = function(estimate) {
            $scope.model.estimate = estimate;
            $scope.model.gaveEstimate = true;

            PubNub.ngPublish({
                channel: "capital_one",
                message: {pe_estimate : estimate}
            });
            $http.post("/api/estimate", {company :$rootScope.company, metric : "PE", estimate : estimate })
                .success(function(data, status, headers, config) {
                    console.log("POSTed the estimate!");
            }).
                error(function(data, status, headers, config) {
                    console.log("Error POSTing estimate");
                });
        };

       $scope.median = function(values) {
           console.log(values);
            values.sort( function(a,b) {return a - b;} );

           console.log(values);

            var half = Math.floor(values.length/2);

            if(values.length % 2)
                return values[half];
            else
                return (values[half-1] + values[half]) / 2.0;
        }

        $scope.median_graph_opts = {
            bars: {
                show: true
            },
            xaxis : {
                ticks: [],
                min: 0,
                max: 1,
                tickLength: 0
            }
        };

        $scope.median_graph_data = [[0, 5]];
        $rootScope.$on(PubNub.ngMsgEv("capital_one"), function(event, payload) {
            $scope.model.data.crowdsourced.push(payload.message.pe_estimate);
            $scope.model.data.crowdsourced_median = $scope.median($scope.model.data.crowdsourced);

            $scope.median_graph_data.pop();
            $scope.median_graph_data.push([0, $scope.model.data.crowdsourced_median]);
            $scope.$broadcast('regraph');
        });

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

        $scope.onsub = function(){};
    })
    .controller("InfoCtrl", function ($scope, $stateParams, $rootScope, PubNub) {
        $scope.header = {
            title : $stateParams.company
        };
        $rootScope.company = $stateParams.company;

        PubNub.init({publish_key:'pub-c-949916ba-5f2e-43d7-a0b8-0571045c5a4b',subscribe_key:'sub-c-dc3d71f2-1022-11e4-9fc1-02ee2ddab7fe',uuid:'an_optional_user_uuid'})

        $scope.subscribe = function() {
            PubNub.ngSubscribe({ channel: "capital_one" });
                $rootScope.$on(PubNub.ngMsgEv("capital_one"), function(event, payload) {
                });
        };

        $scope.subscribe();
    })
    .controller('RevenueCtrl', function ($scope, $http, $rootScope) {
        $scope.model = {};
        $scope.model.isOpenComplete = true;
        $scope.$watch("isOpenComplete", function(n,o) {
            if (n == o) return;
            $scope.model.isOpenComplete = n;
        });

        $scope.model.estimate = "";
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

        $scope.model.gaveEstimate = false;
        $scope.onsub = function(estimate, slideBox) {
            slideBox.$getByHandle('revenueScroller').slide(1);
            $scope.model.estimate = estimate;
            $scope.model.gaveEstimate = true;

            $http.post("/api/estimate", {company :$rootScope.company, metric : "revenue", estimate : estimate })
                .success(function(data, status, headers, config) {
                    console.log("POSTed the estimate!");
                }).
                error(function(data, status, headers, config) {
                    console.log("Error POSTing estimate");
                });
        };
    })
    .controller('HomeCtrl', function ($scope, $state) {
        //TODO: Replace with AJAX
        $scope.companies = ["Apple", "Microsoft", "Capital One", "Google", "Yahoo", "Facebook"];

        $scope.selectCompany = function (comp) {
            $state.go('info', {company : comp});
        }
    })
    .directive('estimateBtn', function ($ionicPopup, $ionicSlideBoxDelegate) {
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
                    sc.onsub(sc.data.entry, $ionicSlideBoxDelegate);

                    var myPopup = $ionicPopup.show({
                        template: '',
                        title: 'Success!',
                        subTitle: 'Your estimate has been recorded.',
                        scope: sc,
                        buttons: [
                            {
                                text: '<b>Continue</b>',
                                type: 'button-positive'
                            }
                        ]
                    });

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
                        $(el).slideUp(400);
                        setTimeout(function() {
                            sc.$apply(function() {
                                sc.open = false;
                            });
                        }, 300);
                    } else {
                        $(el).slideDown(400, function () {
                            sc.$broadcast('regraph');
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


                sc.$on('regraph', function () {
                    renderGraph();
                })
            }
        }
    })
    .directive("num", function() {
        return {
            restrict : "EA",
            link : function(sc, el) {
                $(el).keypress(function(ev){
                    var keyCode = window.event ? ev.keyCode : ev.which;
                    //codes for 0-9
                    if (keyCode < 48 || keyCode > 57) {
                        //codes for backspace, delete, enter
                        if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
                            ev.preventDefault();
                        }
                    }
                });
            }
        }
    });