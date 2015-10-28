angular.module('upetapp.controllers', [])

.controller('AppController', ['$scope', '$state', '$rootScope', '$ionicHistory', '$stateParams','$window','Loader',
    function($scope, $state, $rootScope, $ionicHistory, $stateParams,$window,Loader) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }
    if (!$rootScope.isLoggedIn) {
        
         $state.go('welcome');
         
    }
    $scope.logout = function() {
        Parse.User.logOut();
        Loader.toggleLoadingWithMessage("Saliendo...", 2000);
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome');
    };
}])
.controller('newCtrl', function($rootScope, $scope, $window, Loader) {
  
 $scope.datepickerObject = {
      titleLabel: 'Fecha de nacimiento', 
      todayLabel: 'Hoy',  
      closeLabel: 'Cerrar',  
      setLabel: 'OK',  
      setButtonType : 'button-royal',  
      todayButtonType : 'button-royal',  
      closeButtonType : 'button-royal',  
      inputDate: new Date(),   
      mondayFirst: true,  
      templateType: 'popup', 
      showTodayButton: 'false', 
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive', 
      from: new Date(1988, 8, 2),  
      to: new Date(2018, 8, 25),   
      callback: function (val) {    
        datePickerCallback(val);
      }
    };

  var datePickerCallback = function (val) {
  if (typeof(val) === 'undefined') {
    console.log('No date selected');
  } else {
  
    $scope.datepickerObject.inputDate = val;
  }
};
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
    var birthdate = $scope.datepickerObject.inputDate ;

     if (!name  ||!idm  || !species|| !breed|| !gender|| !birthdate) {
      Loader.toggleLoadingWithMessage("Por favor ingrese los datos", 2000);
      return false;
    }
    var pet = Parse.Object.extend("pet");
    var query = new Parse.Query(pet);

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
        $window.location.reload(true);

     },
         error: function(pet, error) {
            Loader.toggleLoadingWithMessage("No se pudo ingresar la mascota", 2000);
        }
});

 };

})
.controller('WelcomeController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if (!$rootScope.isLoggedIn) {
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
     if (!$rootScope.isLoggedIn) {
        
         $state.go('welcome');
         
    }
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.pets = [];

        var relation = currentUser.relation("pet");
         relation.query().find({
            success: function(list) {
                if (list.length == 0) {
                    $scope.noData = true;
                } else {
                $scope.noData = false;
                 for (var i = 0; i < list.length; i++) {
                     var item = {
                        name: "",
                        species:""
                     };
                    item.name= list[i].get('name');
                    item.species= list[i].get('species');
                    $scope.pets.push(item);
                  }
                }
        }
        });
       $ionicModal.fromTemplateUrl('templates/newPet.html', function(modal) {
        $scope.newTemplate = modal;
        });
       $scope.newPet = function() {
        $scope.newTemplate.show();
        };
  } else {
     $state.go('welcome');
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
;
