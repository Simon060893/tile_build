app.controller("Main", ["$scope", "$rootScope", "request", function ($scope, $rootScope, request) {
    $scope.menuBtn = true;
    $scope.menu = {
        btn: true,
        front: '',
        back: '',
        changeM: function (flag, flag1) {
            $scope.menu.front = flag ? 'opened-nav' : '';
            $scope.menu.back = flag ? 'on-overlay' : '';
            $scope.menu.btn = !flag;
            if (flag) {
                $scope.containerVis = !flag;
            } else if (flag1) {
                $scope.containerVis = flag1;
            }
        }

    };
    $scope.session = {};
    $scope.loadData = {};
    $scope.methods = {
        isAuth: function () {
            return $scope.session.user
        },
        exit: function () {
            request.session('clearSession').then(function (response) {
                $scope.session = response['session'];
            });
        }
    }
    $scope.$watch('goHome', function (newValue) {
        if (newValue) {
            $scope.goHome = false;
            $scope.containerVis = false;
        }

    });
    $scope.$watch('containerVis', function (newValue) {
        if (newValue) {
            phoneSound.play();
        }else{
            phoneSound.pause();
        }

    });


    request.session('getSession').then(function (response) {
        $scope.session = response['session'];
        request.get({},'getProducts').then(function (response) {
            $scope.loadData.products = response.data;
            loadIframe(response.data);
        });
    });

    console.log('init Main Cntr');
}
]);
app.controller("HomeCtrl", ["$scope", "$state", "request", "$controller", function ($scope, $state, request, $controller) {
    console.log('init Home Cntr');
    //angular.extend(this, $controller('Main', {$scope: $scope,$state:$state}));

}]);

app.controller("UserInfo", ["$scope", "$state", "request", "$controller", function ($scope, $state, request, $controller) {
    //angular.extend(this, $controller('Main', {$scope: $scope,$state:$state}));
}]);

app.controller("ProductsCntrl", ["$scope", "$state", "request", function ($scope, $state, request) {
    loader(true);
    var $parent = $scope.$parent;
    $scope.sort = {
        submitted: false,
        editSubmitted: false,
        newInputDt: { }
    };
    $scope.sorts = [];
    $scope.auth = {
        isAuth: function(){
            return $parent.methods.isAuth() && $parent.session.user.usr_type == 'executor';
        }
    };
    $scope.product = 'icon-plus';//icon-shopping-cart
    $scope.methods = {
        allSorts: function () {
            if($parent.sorts){
                $scope.sorts = $parent.loadData.sorts;
                loader();
            }else{
                request.get($parent.session.user, 'getSorts').then(function (data) {
                    if (data['error']) {
                        console.log(data);
                    } else {
                        $scope.sorts = data['data'];
                        $parent.loadData.sorts = $scope.sorts;
                        loader();
                    }
                    $scope.sort.newInputDt.srt_phone=$parent.session.user?$parent.session.user.usr_phone:null
                });
            }
        },
        createSort: function (isValid) {
            $scope.sort.submitted = true;
            if ($scope.auth.isAuth() && isValid) {
                request.add($scope.sort.newInputDt, 'saveSort').then(function (data) {
                    if (data['error']) {
                        alert(data['error']);
                        animate('sort-create');
                    } else {
                        $scope.sorts.push(  angular.copy($scope.sort.newInputDt));
                        $scope.isAddSort = false;
                    }
                });

            }else{
                animate('sort-create');
            }
        },
        dropCurSort: function (id, idSorts, event) {
            event.stopPropagation();

        },
        editCurSort: function (data,isValid, event) {
            $scope.sort.editSubmitted=true;
            if(isValid){
                data.disabled = !data.disabled;
                if(data.disabled){
                    var copyData = jQuery.extend(true, {}, data);
                    delete copyData['disabled'];
                    delete copyData['listProducts'];
                    delete copyData['Active'];
                    request.add(copyData,'editSort').then(function(data){
                        if(data['error']){
                            console.log(data);
                        }else{
                            console.log(data);
                        }
                    });
                }
            }

            event.stopPropagation();
        },
        selectCurProduct: function () {

        },
        dropCurProduct: function () {

        },
        close:function(){
            $parent.containerVis = false;
            $parent.goHome=true;
        }
    }
    console.log('init Sort Cntr');
}]);

app.controller("AuthCtrl", ["$scope", "$state", "request", "$rootScope", function ($scope, $state, request, $rootScope) {

    $scope.data = {
        types: ['customer', 'executor']
    };
    $scope.validate = {
        dft: {
            help: 'help-block',
            feedback: ['glyphicon-ok', 'glyphicon-warning-sign', 'glyphicon-remove'],
            hasFeedback: ['has-success', 'has-warning', 'has-error']
        },
        lgn: {
            help: 'help',
            feedback: 'help',
            hasFeedback: '',
            text: 'email or phone number'
        },
        usr_email: {
            help: 'help',
            feedback: 'help',
            hasFeedback: ''
        },
        usr_name: {
            help: 'help',
            feedback: 'help',
            hasFeedback: ''
        },
        usr_psw: {
            help: 'help',
            feedback: 'help',
            hasFeedback: '',
            text: 'enter password'
        },
        usr_phone: {
            help: 'help',
            feedback: 'help',
            hasFeedback: ''
        },
        checkName: function (flag) {
            var usrName = flag ? $scope.userData.lgn : $scope.userData.usr_name,
                type = flag ? 'lgn' : 'usr_name',
                text = flag ? 'lgn' : 'name';
            if (usrName && usrName.length == 1) {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your ' + text + ' is too short',
                    feedback: this.dft.feedback[1],
                    hasFeedback: this.dft.hasFeedback[1]
                });
            } else if (usrName && usrName.length > 1 && (flag || /[A-z]/.test(usrName))) {
                $scope.validate.setVal(type, {
                    help: 'help',
                    text: '',
                    feedback: this.dft.feedback[0],
                    hasFeedback: this.dft.hasFeedback[0]
                });
            } else {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your ' + text + ' is not correct',
                    feedback: this.dft.feedback[2],
                    hasFeedback: this.dft.hasFeedback[2]
                });
            }
        },
        checkPsw: function (flag) {
            var psw = $scope.userData.usr_psw,
                type = 'usr_psw';
            if (!psw) {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your password is empty',
                    feedback: this.dft.feedback[2],
                    hasFeedback: this.dft.hasFeedback[2]
                });
            } else if (!(/^\S+$/.test(psw))) {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'you have some spaces in your password',
                    feedback: this.dft.feedback[1],
                    hasFeedback: this.dft.hasFeedback[1]
                });
            } else if (psw && (flag || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,}$/.test(psw))) {
                $scope.validate.setVal(type, {
                    help: 'help',
                    text: '',
                    feedback: this.dft.feedback[0],
                    hasFeedback: this.dft.hasFeedback[0]
                });
            } else {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your password is not strong enough',
                    feedback: this.dft.feedback[1],
                    hasFeedback: this.dft.hasFeedback[1]
                });
            }
        },
        checkEmail: function () {
            var type = 'usr_email';
            if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test($scope.userData.usr_email)) {
                $scope.validate.setVal(type, {
                    help: 'help',
                    text: '',
                    feedback: this.dft.feedback[0],
                    hasFeedback: this.dft.hasFeedback[0]
                });
            } else {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your email is not correct',
                    feedback: this.dft.feedback[2],
                    hasFeedback: this.dft.hasFeedback[2]
                });
            }

        },
        checkPhone: function () {
            var type = 'usr_phone';
            if (/^[0-9]\d{9}$/.test($scope.userData.usr_phone)) {
                $scope.validate.setVal(type, {
                    help: 'help',
                    text: '',
                    feedback: this.dft.feedback[0],
                    hasFeedback: this.dft.hasFeedback[0]
                });
            } else {
                $scope.validate.setVal(type, {
                    help: this.dft.help,
                    text: 'your mobile  phone is not correct',
                    feedback: this.dft.feedback[2],
                    hasFeedback: this.dft.hasFeedback[2]
                });
            }

        },
        setVal: function (el, val) {
            el = $scope.validate[el];
            el.feedback = val.feedback;
            el.help = val.help;
            el.hasFeedback = val.hasFeedback;
            el.text = val.text;
        }
    };
    $scope.userData = {
        usr_email: null,
        usr_name: null,
        usr_phone: null,
        usr_type: $scope.data.types[0],
        usr_psw: null
    };
    $scope.sign = {
        isAuth: false,
        inn: function () {
            var user = $scope.userData,
                vldt = $scope.validate,
                v = vldt.dft,
                $parent = $scope.$parent;
            if (!user.lgn || !user.usr_psw) {
                animate('signIn');
                return;
            }
            request.get($scope.userData, 'getUser').then(function (data) {
                if (data['error']) {
                    vldt.setVal(data['type'], {
                        help: v.help,
                        text: data['text'],
                        feedback: v.feedback[2],
                        hasFeedback: v.hasFeedback[2]
                    });
                    animate('signIn');
                } else {
                    $parent.session.user = data['data'];
                    $parent.goHome = true;
                }
            });
        },
        up: function () {
            var user = $scope.userData,
                vldt = $scope.validate,
                $parent = $scope.$parent;
            //simple validate
            for (var key in user) {
                if (!user[key] || (vldt[key] && vldt[key]['hasFeedback'] == vldt.dft.hasFeedback[2])) {
                    animate('signUp');
                    return;
                }
            }
            user.usr_solt = new Date().getTime();
            request.add(user, 'saveUser').then(function (data) {
                if (data['error']) {
                    if (data['type']) {
                        alert(data['type']);
                        animate('signUp');
                    } else {
                        console.log(data['error']);
                    }
                } else {
                    $parent.session.user = user;
                    $parent.goHome = true;
                    alert(data['success']);
                }
            });
        }
    }

    console.log('init Auth Cntr');
}]);
