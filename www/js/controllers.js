angular.module('kksspotify.controllers', [])

.controller('PlaylistCtrl', function(){})

.controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify){
	var clientId = 'cdaa89939cef42cc9b99987cb1f7da0e';
	$scope.playlists = [];

	$scope.performLogin = function() {
		$cordovaOauth.spotify(clientId, ['user-read-private','playlist-read-private']).then(function(result) {
			window.localStorage.setItem('spotify-token', result.access_token);
			Spotify.setAuthToken(result.access_token);			
		}, function(error) {
			console.log('ERROR: ' + error);
		});
	};

	$scope.updateInfo = function() {
		Spotify.getCurrentUser().then(function(data) {
			getUserPlaylists(data.id);
		}, function(error) {
			$scope.performLogin();	
		});
	};

	$scope.getUserPlaylists = function(userid) {
		Spotify.getUserPlaylists(userid).then(function(data) {
			$scope.playlists = data.items;
		});
	};	

	$ionicPlatform.ready(function() {
		var storedToken = window.localStorage.getItem('spotify-token');
		if(storedToken !== null) {
			Spotify.setAuthToken(storedToken);
			$scope.updateInfo();
		} else {
			$scope.performLogin();
		}
	});

});