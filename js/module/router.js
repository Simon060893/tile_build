app.config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$translateProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider){
            $urlRouterProvider.otherwise('/');

            $stateProvider.state('home_en',{url: '/', templateUrl:'', controller: 'HomeCtrl' })
                .state('home_ru',{url: '/ru', templateUrl:'partials/home.html', controller: function($state, $translate){ $translate.use('ru'); $state.go('home');} })
                .state('home', {url: '/home', templateUrl: 'partials/home.html', controller: 'HomeCtrl' })
                .state('sign_in', {url: '/sign_in', templateUrl: 'partials/sign_in.html', controller: 'AuthCtrl' });

            $locationProvider.html5Mode({ enabled: true, requireBase: false });
            $translateProvider.useStaticFilesLoader({
                prefix: 'data/langs/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');
        }]
);