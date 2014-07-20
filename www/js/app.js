window.addEventListener("load", function () {
    // Set a timeout...
    setTimeout(function () {
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);
});

angular.module('starter', ['ionic', 'starter.controllers', 'ngAnimate'])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('info', {
                url: '/info',
                templateUrl: 'js/info/info-tmplt.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/info');
    });

