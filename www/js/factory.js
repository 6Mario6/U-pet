angular.module('upetapp.factory', [])
 .value ('PARSE_CREDENTIALS', {
    APP_ID: 'OGavsRu0AOdcpU8ImgtulV1hHlnJGmtcvHvyLsp9',
    REST_API_KEY: 'tZeSChsWZzsXCPzx66Si2C7LMgqEb3IYNyWaGV4o'
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
}])
;
