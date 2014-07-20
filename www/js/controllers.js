angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('PECtrl', function($scope, PetService) {
        $scope.model = {};

        $scope.model.data = {
            PEVsDate : [],
            realtime : []
        };
        var x = [];
        for (var i = 1; i < 31; i++) {
            var y = new Date();
            y.setDate(y.getDate() + i);
            $scope.model.data.PEVsDate.push([y.getTime(), i]);
        }

        $scope.model.visibility = true;
        $scope.toggleVisibility = function() {
            $scope.model.visibility = !$scope.model.visibility;
        }
})
    .directive('slide', function () {
        return {
            restrict: "A",
            scope : {
                "visible" : "=slide"
            },
            link : function(sc, el) {
                sc.$watch("visible", function(n, o) {
                    if (n == o) return;
                    if (!n) {
                        $(el).slideUp();
                    } else {
                        $(el).slideDown(400, function () {
                            sc.$broadcast('hideEvt');
                        });
                    }
                });
            }
        }
    })
    .directive('graph', function () {
        return {
            restrict : "EA",
            scope : {
                "model" : "="
            },
            templateUrl: 'js/graph.tmplt.html',
            link : function(sc, el) {
                var $el = $($(el).find(".graph")[0]);
                var renderGraph = function () {
                    console.log('sam');
                    $.plot($el, [sc.model], {
                        xaxis: {mode: "time"}
                    });
                };
                    renderGraph();


                sc.$on('hideEvt', function () {
                    renderGraph();
                })
            }
        }
    });