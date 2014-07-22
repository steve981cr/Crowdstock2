angular.module('starter.controllers', [])
    .controller('PECtrl', function ($scope, $http, $rootScope, PubNub)  {
        $scope.details = {
            visible : false,
            completelyOpen : false,
            onopen : function () {
                $scope.details.visible = true;
                $scope.graphs.regraph = true;
            },
            onclose : function () {
                $scope.details.visible = false;
            }
        };

        $scope.data = {
            userEstimate : -1,
            crowdsourcedPts : [],
            crowdsourced : 0,
            actual: 0
        };

        $scope.graphs = {
            PEvsDate : [
                [11,11.42],
                [10,11.36],
                [9,10.85],
                [8, 10.44],
                [7, 10.90],
                [6, 10.37],
                [5, 10.25],
                [4, 11.12],
                [3, 10.40],
                [2, 10.00],
                [1, 10.01],
                [0, 9.40]
            ],
            PEvsDateOpts : {
                series: {
                    lines: {
                        show: true
                    }
                },
                xaxis: {
                    ticks: [[0,"Aug"],[2,"Oct"],[4,"Dec13"],[6,"Feb"], [8, "Apr"], [10, "Jun"]],
                    tickLength: 0
                }
            },
            crowdsourced : [],
            crowdsourcedOpts : {
                bars: {
                    show: true
                }
                ,
                xaxis : {
                    ticks: [],
                    min: 0,
                    max: 1
                },
                yaxis : {
                    min: 0,
                    max: 50
                }
            },
            regraph : false
        };
        $scope.graphs.PEvsDate.reverse();

        $scope.gaveEstimate = function () {
            return $scope.data.userEstimate != -1;
        };

        $scope.$watch(
            function () {
                return $rootScope.pe_data;
            },
            function (n, o) {
                if (n == undefined) return;
                $scope.data.crowdsourced = n.guess_pe;
                $scope.data.actual = n.actual_pe;

                $scope.data.crowdsourcedPts.push(n.guess_pe);

                $scope.graphs.crowdsourced.pop();
                $scope.graphs.crowdsourced.push([0, n.guess_pe]);

                $scope.graphs.regraph = true;
            }
        );

        var median = function(values) {
            for (var i = 0; i < values.length; i++)
                values[i] = parseInt(values[i]);

            values.sort( function(a,b) {return a - b;} );

            var half = Math.floor(values.length/2);

            if(values.length % 2)
                return values[half];
            else
                return (values[half-1] + values[half]) / 2.0;
        };

        $scope.demo = function () {
            for (var i = 0; i < 50; i++) {
                setTimeout(function () {
                    var ran = Math.floor(Math.random() * 50) + 1;
                    PubNub.ngPublish({
                        channel: "capital_one",
                        message: {pe_estimate : ran}
                    });
                }, 200 * i);
            }
        };

        $scope.onsub = function(estimate, slideBox) {
            $scope.graphs.regraph = true;
            slideBox.$getByHandle('peScroller').slide(1);

            $scope.data.userEstimate = estimate;

            PubNub.ngPublish({
                channel: "capital_one",
                message: {pe_estimate : estimate}
            });

            $http.post("/company/0/guess", {company :$rootScope.company, metric : "PE", estimate : estimate })
                .success(function(data, status, headers, config) {
                    console.log("POSTed the estimate!");
            }).
                error(function(data, status, headers, config) {
                    console.log("Error POSTing estimate");
                });
        };

        $rootScope.$on(PubNub.ngMsgEv("capital_one"), function(event, payload) {
            $scope.data.crowdsourcedPts.push(payload.message.pe_estimate);
            $scope.data.crowdsourced = median($scope.data.crowdsourcedPts);

            $scope.graphs.crowdsourced.pop();
            $scope.graphs.crowdsourced.push([0, $scope.data.crowdsourced]);

            $scope.$apply(function() {
                $scope.details.onopen();
            });

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
        };

        $scope.onsub = function(){};
    })
    .controller("InfoCtrl", function ($http, $scope, $stateParams, $rootScope, PubNub) {
        $scope.header = {
            title : $stateParams.company
        };
        $rootScope.company = $stateParams.company;

        PubNub.init({
            publish_key:'pub-c-949916ba-5f2e-43d7-a0b8-0571045c5a4b',
            subscribe_key:'sub-c-dc3d71f2-1022-11e4-9fc1-02ee2ddab7fe',
            uuid:'an_optional_user_uuid'
        });

        if ($rootScope.pe_data == undefined)
        $http.get("/company/0?company=" + $rootScope.company )
            .success(function(data, status, headers, config) {
                $rootScope.pe_data = {
                    actual_pe : data.actual, guess_pe : data.guess
                };
            }).
            error(function(data, status, headers, config) {
                console.log("Error!");
            });
    })
    .controller('RevenueCtrl', function ($scope, $http, $rootScope) {
        $scope.details = {
            visible : false,
            completelyOpen : false,
            onopen : function () {
                $scope.details.visible = true;
                $scope.graphs.regraph = true;
            },
            onclose : function () {
                $scope.details.visible = false;
            }
        };

        $scope.graphs = {
            regraph: false,
            revQuarterlyOpts: {
                bars: {
                    show: true
                },
                xaxis: {
                    ticks: [
                        [0.5, "Q3"],
                        [1.5, "Q4"],
                        [2.5, "Q1"],
                        [3.5, "Q2"]
                    ],
                    tickLength: 0, // disable tick
                    min: 0,
                    max: 4
                },
                yaxis: {
                    tickLength: 0, // disable tick,
                    min: 5000,
                    max: 6000
                }
            },
            revQuarterly: [
                [0, 5651],
                [1, 5544],
                [2, 5370],
                [3, 5468]
            ]
        };

        $scope.data = {
            userEstimate : -1,
            crowdsourced : 0,
            actual: 0
        };

        $scope.gaveEstimate = function () {
            return $scope.data.userEstimate != -1;
        };

        $scope.onsub = function(estimate, slideBox) {
            slideBox.$getByHandle('revenueScroller').slide(1);
            $scope.data.userEstimate = estimate;

            $http.post("/company/0/guess", {company :$rootScope.company, metric : "revenue", estimate : estimate })
                .success(function(data, status, headers, config) {
                    console.log("POSTed the estimate!");
                }).
                error(function(data, status, headers, config) {
                    console.log("Error POSTing estimate");
                });
        };
    })
    .controller('HomeCtrl', function ($scope, $state, $http, $rootScope) {
        $scope.companies = [];
        $http.get("/company")
            .success(function(data, status, headers, config) {
                $scope.companies = data.companies;
                console.log("GET the estimate!");
            }).
            error(function(data, status, headers, config) {
                console.log("Error GET estimate");
            });

        $scope.selectCompany = function (comp) {
            $http.get("/company/0?company=" + comp )
                .success(function(data, status, headers, config) {
                    $rootScope.pe_data = {
                        actual_pe : data.actual, guess_pe : data.guess
                    };

                    $state.go('info', {company : comp });
                    console.log("POST!");
                }).
                error(function(data, status, headers, config) {
                    console.log("Error!");
                });
        }
    })
    .directive('estimateBtn', function ($ionicPopup, $ionicSlideBoxDelegate) {
        return {
            restrict : "A",
            templateUrl: "js/estimate-btn.tmplt.html",
            scope : {
                onsub : "=",
                txt : "@"
            },
            link : function (sc, el) {
                sc.myText = sc.txt || "Give Estimate";

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
    .directive('slide', function ($ionicSlideBoxDelegate) {
        return {
            restrict: "A",
            scope: {
                "visible": "=slide",
                "open" : "=",
                "onclose" : "&",
                "onopen" : "&"
            },
            link: function (sc, el) {
                sc.onopen = sc.onopen() || function(){};
                sc.onclose = sc.onclose() || function(){};

                sc.$watch("visible", function (n, o) {
                    if (n == o) return;
                    if (!n) {
                        $(el).slideUp(400);
                        setTimeout(function() {
                            sc.$apply(function() {
                                sc.open = false;
                                sc.onclose();
                            });
                        }, 300);
                    } else {
                        $(el).slideDown(400, function () {
                            sc.$apply(function () {
                                sc.onopen();
                                $ionicSlideBoxDelegate.update();
                            });
                        });
                            sc.open = true;
                    }
                });
            }
        }
    })
    .directive('graph', function ($rootScope, $timeout) {
        return {
            restrict: "EA",
            scope: {
                "opts" : "=graph",
                "model": "=",
                "regraph" : "="
            },
            templateUrl: 'js/graph.tmplt.html',
            link: function (sc, el) {
                var opts = sc.opts || {};
                var $el = $($(el).find(".graph")[0]);
                var renderGraph = function () {
                    opts.data = sc.model;
                    if ($el.width() > 0 && $el.height() > 0)
                        $.plot($el, [opts], opts);
                };
                renderGraph();

                var re = function () {
                    $el.width($el.parents(".slider").width() - 10);
                    renderGraph();
                    sc.regraph = false;
                };

                sc.$watch("regraph", function (n, o) {
                    if (n) re();
                });
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
                    if (keyCode < 48 || keyCode > 57 || keyCode == 110 || keyCode == 46) {
                        //codes for backspace, delete, enter
                        if (keyCode != 0 && keyCode != 8 && keyCode != 13 && keyCode != 190 && keyCode != 46 && !ev.ctrlKey) {
                            ev.preventDefault();
                        }
                    }
                });
            }
        }
    });