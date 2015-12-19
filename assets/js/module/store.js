var app = angular.module("Store", [
    'flow',
    //"swipe",
    "ui.router",
    //"angular-carousel",
    //"snapscroll",
    //"ngSanitize",
    //"ngAnimate",
    "ngResource",
    'pascalprecht.translate'
    ,
    'ezfb'
])
/*    .filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])*/
    .config(function (ezfbProvider) {
        ezfbProvider.setInitParams({
            appId: '1658512877766570'
        });
    }
    );