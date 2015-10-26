angular.module('upetapp.controllers', [])

.controller('AppController', ['$scope', '$state', '$rootScope', '$ionicHistory', '$stateParams','Loader',
    function($scope, $state, $rootScope, $ionicHistory, $stateParams,Loader) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }
    alert($rootScope.isLoggedIn);
    if (!$rootScope.isLoggedIn) {
         $state.go('welcome');
    }
    $scope.logout = function() {
        Parse.User.logOut();
        Loader.toggleLoadingWithMessage("Saliendo...", 2000);
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };
}])

.controller('WelcomeController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.login = function() {
        $state.go('login');
    };

    $scope.signUp = function() {
        $state.go('register');
    };

    if ($rootScope.isLoggedIn) {
        $state.go('app.pet');
    }
})

.controller('PetController', function($scope, $state, $rootScope) {

    if (!$rootScope.isLoggedIn) {
         $state.go('welcome');
    }
    $scope.pets = [];
     if ($scope.pets.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
})

.controller('LoginController', [ '$scope', '$state', '$rootScope', 'Loader',
    function($scope, $state, $rootScope, Loader) {

        $scope.user = {
        username: null,
        password: null
        };

    $scope.error = {};

    $scope.login = function() {
       Loader.showLoading();

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {
                Loader.hideLoading();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.pet', {
                    clear: true
                });
            },
            error: function(user, err) {
                Loader.hideLoading();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Credenciales de acceso invalidas';
                } else {
                    $scope.error.message = 'Se ha producido un error desconocido, ' +
                        'por favor intente de nuevo.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('forgot');
    };
    $scope.back = function() {
        $state.go('welcome');
    };
    }
])

.controller('ForgotPasswordController', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Dirección de correo electrónico no existe';
                } else {
                    $scope.error.message = 'Se ha producido un error desconocido, ' +
                        'por favor intente de nuevo.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('login');
    };
    $scope.back = function() {
        $state.go('login');
    };
})

.controller('RegisterController', [ '$scope', '$state', '$rootScope', 'Loader',
    function($scope, $state, $rootScope, Loader){


    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {

        // TODO: add age verification step

        Loader.showLoading();

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function(user) {
                
                Loader.hideLoading();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.pet', {
                    clear: true
                });
            },
            error: function(user, error) {
                Loader.hideLoading();
                if (error.code === 125) {
                    $scope.error.message = 'Por favor, indique una dirección de correo electrónico válida';
                } else if (error.code === 202) {
                    $scope.error.message = 'La dirección de correo electrónico ya está registrado';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
     $scope.back = function() {
        $state.go('welcome');
    };
}
])
.controller('MainController',[ '$scope', '$state', '$rootScope', '$stateParams', '$ionicHistory','Loader', 
    function($scope, $state, $rootScope, $stateParams, $ionicHistory,Loader) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
    }

    $scope.rightButtons = [{
        type: 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {
            $scope.sideMenuController.toggleRight();
        }
    }];

    $scope.logout = function() {
        Parse.User.logOut();
        Loader.toggleLoadingWithMessage("Saliendo...", 2000);
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };

    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleRight();
    };
    }
]);
