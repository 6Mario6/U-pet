angular.module('upetapp.controllers', [])

.controller('AppController', ['$scope', '$state', '$rootScope', '$ionicHistory', '$stateParams','$window','Loader',
    function($scope, $state, $rootScope, $ionicHistory, $stateParams,$window,Loader) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }
    if (!$rootScope.isLoggedIn) {
         $state.go('welcome');
         $window.location.reload(true);
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
.controller('newCtrl', function($rootScope, $scope, $window, Loader) {
  $scope.data = {
    pet: "",
    id:"",
    species:"",
    breed:"",
    gender:"",
    birthdate:""

  };
  $scope.close = function() {
    $scope.modal.hide();
  };
$scope.createNew = function() {
    var name = this.data.pet;
    var idm = this.data.idm;
    var species = this.data.species;
    var breed = this.data.breed;
    var gender = this.data.gender;
    var birthdate = this.data.birthdate;
     if (!name  ||!idm  || !species|| !breed|| !gender|| !birthdate) {
      Loader.toggleLoadingWithMessage("Por favor ingrese los datos", 2000);
      return false;
    }
    var pet = Parse.Object.extend("pet");
    var query = new Parse.Query(pet);
    query.equalTo("idm", idm);


    $scope.modal.hide();
    var user = Parse.User.current();   
    var pet = new Parse.Object("pet");
    pet.set("idm", idm);
    pet.set("name", name);
    pet.set("species", species);
    pet.set("breed", breed);
    pet.set("gender", gender);
    pet.set("birthdate", birthdate);
    var relation = pet.relation("User");
    $rootScope.relation=user.relation("pet");
    relation.add(user);
    $rootScope.user=user;
    pet.save(null, {
        success: function(pet) {
        var relation=$rootScope.relation;
        relation.add(pet);
        $rootScope.user.save();
         Loader.toggleLoadingWithMessage("Se ingreso la mascota con éxito", 2000);
     },
         error: function(pet, error) {
            Loader.toggleLoadingWithMessage("No se pudo ingresar la mascota", 2000);
        }
});

 };

})
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

.controller('PetController', function($scope, $state, $rootScope,$ionicModal,$window) {

    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.pets = [];

        



        if ($scope.pets.length == 0) {
          $scope.noData = true;
      } else {
          $scope.noData = false;
      }


       $ionicModal.fromTemplateUrl('templates/newPet.html', function(modal) {
        $scope.newTemplate = modal;
        });
       $scope.newPet = function() {
        $scope.newTemplate.show();
        };




  } else {
     $state.go('welcome');
     $window.location.reload(true);
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
