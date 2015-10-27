angular.module('upetapp.factory', [])
 .value ('PARSE_CREDENTIALS', {
    APP_ID: 'buDe6GYunFIHzcumek87hGdVlyr26BP5PL6o7kq6',
    REST_API_KEY: 'BFjBk4Jqrj0dfc89mwYhdb64M18VZenDDRl3DHB0'
})
.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {

	var LOADERAPI = {

		showLoading: function(text) {
			text = text || 'Cargando...';
			$ionicLoading.show({
				template: text
			});
		},

		hideLoading: function() {
			$ionicLoading.hide();
		},

		toggleLoadingWithMessage: function(text, timeout) {
			var self = this;

			self.showLoading(text);

			$timeout(function() {
				self.hideLoading();
			}, timeout || 3000);
		}

	};
	return LOADERAPI;
}]);
