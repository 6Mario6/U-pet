// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('upetapp', [ 'ionic', 'upetapp.controllers' ])

.run(function($ionicPlatform) {
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
				templateUrl : 'templates/pet.html'
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
