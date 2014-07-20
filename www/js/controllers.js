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
                var d1 = [[1, 300], [2, 600], [3, 550], [4, 400], [5, 300]];
                $(document).ready(function () {
                    $.plot($(".graph"), [d1]);
                });
                $(window).resize(function() { $.plot($(".graph"), [d1]);});
            }
        }
    })


// A simple controller that shows a tapped item's data
.controller('PlayCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
});