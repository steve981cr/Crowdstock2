angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('InfoCtrl', function($scope, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pets = PetService.all();
})
    .directive('graph', function () {
        return {
            restrict : "EA",
            template : "<div></div>",
            link : function() {
                var x = [];
                for (var i = 1; i < 31; i++) {
                    var y = new Date();
                    y.setDate(y.getDate() + i);
                    x.push([y.getTime(), i]);
                }

                $(document).ready(function () {
                    $.plot($(".graph"), [x], {
                        xaxis: {mode: "time"}
                    });
                });
                $(window).resize(function() {console.log("rs"); $.plot($(".graph"), [x]);});
            }
        }
    })


// A simple controller that shows a tapped item's data
.controller('PlayCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
});