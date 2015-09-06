angular.module('kksspotify.controllers', [])

.controller('PlaylistCtrl', function($scope, $stateParam, Spotify){
	var listid = $stateParam.listid;
	var userid = $stateParam.userid;
	$scope.listname = $stateParam.listname;

	$scope.audio = new Audio();
	$scope.tracks = [];
	Spotify.getUserPlaylists(userid, listid).then(function(data) {
		$scope.tracks = data.tracks.items;
	});

	$scope.playTrack = function(trackInfo) {
		$scope.audio.src = trackInfo.track.preview_url;
		$scope.audio.play();
	};

	$scope.stop = function() {
		if($scope.audio.src) {
			$scope.audio.pause();
		}
	};

	$scope.play = function() {
		if($scope.audio.src) {
			$scope.audio.play();
		}
	};

	$scope.openSpotify = function() {
		window.open(link, '_blank', 'location=yes');
	};	
})

.controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify){
	var clientId = 'cdaa89939cef42cc9b99987cb1f7da0e';
	$scope.playlists = [];

	$ionicPlatform.ready(function() {
		alert('ready ...');
		var storedToken = window.localStorage.getItem('spotify-token');
		if(storedToken !== null) {
			Spotify.setAuthToken(storedToken);
			$scope.updateInfo();
		} else {
			$scope.performLogin();
		}
	});

	$scope.performLogin = function() {
		alert('performLogin: ' + clientId);
		$cordovaOauth.spotify(clientId, ['user-read-private','playlist-read-private']).then(function(result) {
			window.localStorage.setItem('spotify-token', result.access_token);
			Spotify.setAuthToken(result.access_token);
			$scope.updateInfo();		
		}, function(error) {
			console.log('ERROR: ' + error);
			alert('ERROR: ' + error);
		});
	};

 	// $scope.performLogin = function() {
  //     	$cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
  //       	window.localStorage.setItem('spotify-token', result.access_token);
  //       	Spotify.setAuthToken(result.access_token);
  //       	$scope.updateInfo();
  //     	}, function(error) {
  //         	console.log("Error -> " + error);
  //     	});
  //   };

    $scope.updateInfo = function() {
      Spotify.getCurrentUser().then(function (data) {
        $scope.getUserPlaylists(data.id);
      }, function(error) {
        $scope.performLogin();
      });
    };

  	$scope.getUserPlaylists = function(userid) {
      	Spotify.getUserPlaylists(userid).then(function (data) {
        	$scope.playlists = data.items;
      });
    };


});