app.config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$translateProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider){
            $urlRouterProvider.otherwise('/');
            var url = 'partials/';

            $stateProvider.state('home_en',{url: '/', controller: function(){ console.log('init en');} })
                .state('home_ru',{url: '/ru', templateUrl:url+'home.html', controller: function($state, $translate){ $translate.use('ru'); $state.go('/');} })
                .state('info', {url: '/info', templateUrl: url+'user-info.html', controller: 'UserInfo' })
                .state('home', {url: '/home', templateUrl: url+'/home.html', controller: 'HomeCtrl' })
                .state('comments', {url: '/comments', templateUrl: url+'comments.html', controller: function(){ console.log('init comCntrl')} })
                .state('products', {url: '/sorts/:sortID/products', templateUrl: url+'products.html', controller: 'ProductsCntrl' })
                .state('productsID', {url: '/sorts/:sortID/products/:productId', templateUrl: url+'edit/comments.html', controller: 'ProductsCntrl' })
                .state('productsCreate', {url: '/sorts/:sortID/products/create', templateUrl: url+'create/comments.html', controller: 'ProductsCntrl' })
                .state('sorts', {url: '/sorts', templateUrl: url+'sorts.html', controller: 'ProductsCntrl' })
                .state('sign_in', {url: '/sign_in', templateUrl: 'partials/sign_in.html', controller: 'AuthCtrl' })
                .state('sign_up', {url: '/sign_up', templateUrl: 'partials/sign_up.html', controller: 'AuthCtrl' });

            $locationProvider.html5Mode({ enabled: true, requireBase: false });
            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/data/langs/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');
        }]
);