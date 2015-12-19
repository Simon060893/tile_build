'use strict';
var product = ['http://pasku.net.ua/projects/tiles'],
    local = ['tiles'],
    usees = local;

app.factory("handler", function ($q) {
    return {
        success: function (response) {
            return response.data;
        },
        error: function (response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return $q.reject("An unknown error occurred.");
            }

            return $q.reject(response.data.message);
        }
    }
});

app.factory("request", function ($http, handler) {
    var url='api/route.php';

    function loadData(data,method) {
        return $http.post( url,{data:data,method:method}).then(
            handler.success,
            handler.error
        );
    }
    function addData(data,method) {
        return $http.post( url,{data:data,method:method}).then(
            handler.success,
            handler.error
        );
    }
    function session(method) {
        return $http.post( url,{method:method}).then(
            handler.success,
            handler.error
        );
    }

    return {
        get: loadData,
        session: session,
        add: addData
    };
});
app.factory('FeedService', ['$http', function($http){
    var state = {};

    var loadFeed = function(){
        $http.get(usees[0]).then(function(result){
            state.feed = result.items;
        });
    };

    // load the feed on initialisation
    loadFeed();

    return {
        getState: function(){
            return state;
        }
    };
}]);

