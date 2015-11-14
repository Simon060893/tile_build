var app = angular.module("Store", [
    "swipe",
    "ui.router",
    "angular-carousel",
    "snapscroll",
    "ngSanitize",
    "ngAnimate",
    "ngResource",
    'pascalprecht.translate'
]).filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);