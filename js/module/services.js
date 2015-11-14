'use strict';

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

    function getData(data,method) {
        return $http.post( url,{data:data,method:method}).then(
            handler.success,
            handler.error
        );
    }


    return {
        get: getData
    };
});