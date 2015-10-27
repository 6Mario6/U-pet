angular.module('upetapp',
        [ 'ionic', 'upetapp.controllers' ,'upetapp.factory','ionic-datepicker']
    )
.run(function($ionicPlatform,$state, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        Parse.initialize("OGavsRu0AOdcpU8ImgtulV1hHlnJGmtcvHvyLsp9", "WPfKn6uZxlMLT4Q9JXe2AJopRyVp0stSOOl6pL3E");
        var currentUser = Parse.User.current();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        if (currentUser) {
            $rootScope.user = currentUser;
            $rootScope.isLoggedIn = true;
            $state.go('app.pet');
        }
    });
})
    .config(function($stateProvider, $urlRouterProvider) {
$stateProvider.state('welcome', {
        url : '/welcome?clear',
        templateUrl : 'templates/welcome.html',
        controller : 'WelcomeController'
    })

    .state('app', {
        url : '/app?clear',
        abstract : true,
        templateUrl : 'templates/menu.html',
        controller : 'AppController'
    }).state('login', {
        url : '/login',
        templateUrl : 'templates/login.html',
        controller : 'LoginController'
    })
    .state('forgot', {
        url : '/forgot',
        templateUrl : 'templates/forgotPassword.html',
        controller : 'ForgotPasswordController'
    })

    .state('register', {
        url : '/register',
        templateUrl : 'templates/register.html',
        controller : 'RegisterController'
    })
    .state('app.pet', {
        url : '/pet',
        views : {
            'menuContent' : {
                templateUrl : 'templates/pet.html',
                controller: 'PetController'
            }
        }
    }).state('app.activity', {
        url : '/activity',
        views : {
            'menuContent' : {
                templateUrl : 'templates/activity.html',
            }
        }
    })
    .state('app.location', {
        url : '/location',
        views : {
            'menuContent' : {
                templateUrl : 'templates/location.html',
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/welcome');
    });
    

