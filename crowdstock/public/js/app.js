window.addEventListener("load", function () {
    // Set a timeout...
    setTimeout(function () {
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);
});

angular.module('starter', ['ionic', 'starter.controllers', 'ngAnimate', 'pubnub.angular.service'])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('info', {
                url: '/info/:company',
                templateUrl: 'js/info-tmplt.html',
                controller: "InfoCtrl"
            })
            .state('home', {
                url: '/home',
                templateUrl: 'js/home.tmplt.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');
    })
    .controller("MainCtrl", function ($scope, $state) {
        $scope.backClick = function () {
            $state.go("home");
        };
    });

