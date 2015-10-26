angular.module('upetapp.factory', [])
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
