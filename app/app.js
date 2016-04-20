'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngResource',
    'facebook'
])

.config(['$routeProvider', '$httpProvider', 'FacebookProvider', function($routeProvider, $httpProvider, FacebookProvider) {
    FacebookProvider.init('999706743399600');
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["content-type"] = "application/json";
}])

.controller('mainCtrl', function($http, $scope, $resource, $window, Facebook) {
    $scope.loggedIn = false;
    $scope.donated = 'true';
    $scope.disclose = false;
    $scope.number = false;
    $scope.drawn = false;
    $scope.amount = 0;
    $scope.donors = [];
    $scope.userDonated = false;
    $scope.downloadError = "";
    $scope.saveClicked = false;
    $scope.site = "";

    $scope.showButton = function(){
    	return $scope.donated != 'true' || ($scope.amount < 0 && $scope.disclose != true);
    };

    $scope.login = function() {
        Facebook.login(function(response) {
            if (response.status == 'connected') {
                $scope.loggedIn = true;
                $scope.me();
            } else {
                $scope.loggedIn = false;
            }
        });
    };

    $scope.logout = function() {
        Facebook.logout(function(response) {
            $scope.loggedIn = false;
            clearLogout();
        });
    };

    function clearLogout() {
        document.getElementById("im").innerHTML = '<div class="box">?</div>';
        $scope.drawn = false;
    }

    $scope.saveImage = function() {
        var canvas = document.getElementById('canvas1200');
        try{
        	var dataURL = canvas.toDataURL("image/png");
    	}catch(error){
    		$scope.downloadError = "Image couldn't be downloaded. Please, refresh the page (it might take a few times). Also, make sure your browser is Google Chrome or Mozilla Firefox.";
    	}
        //dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        var img = document.createElement('img');
        img.crossorigin = "anonymous";
        img.id = 'conv';
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = dataURL;
        document.getElementById("converted").innerHTML = '';
        //document.getElementById("converted").appendChild(img);

        var a = document.createElement('a');
        a.href = dataURL;
        a.download = "five4ecuador.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        var win = window.open(dataURL, '_blank');
      	win.focus();
    }

    $scope.sendData = function() {
        var first_name = encodeURIComponent($scope.user.first_name);
        var id = encodeURIComponent($scope.user.id);
        var last_name = encodeURIComponent($scope.user.last_name);
        var picture = '';
        if ($scope.user.picture && $scope.user.picture.data) {
            picture = encodeURIComponent($scope.user.picture.data.url);
        }
        var donation = $scope.amount;
        var date = encodeURIComponent(new Date());
        var number = encodeURIComponent($scope.number);
        var donated = encodeURIComponent($scope.donated);
        var site = encodeURIComponent($scope.site);

        var req = {
            method: 'JSONP',
            url: 'http://1forecuador.mybluemix.net/addDonor?first_name=' + first_name + '&id=' + id + '&last_name=' + last_name + '&picture=' + picture + '&donation=' + donation + '&date=' + date + '&number=' + number + '&donated=' + donated + '&site=' + site,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        return $http(req);
    };

    $scope.setNum = function(num){
    	$scope.num = num;
    };

    $scope.setCounter = function(num){
    	var req = {
            method: 'JSONP',
            url: 'http://1forecuador.mybluemix.net/count?c='+encodeURIComponent(num),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        $http(req).then(function() {}, function() {});
    }

    $scope.setDonors = function(donors) {
    	$scope.donors = JSON.parse(donors);
    };

    $scope.getLoginStatus = function(login) {
        return Facebook.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                $scope.loggedIn = true;
                $scope.me();
            } else {
                $scope.loggedIn = false;
                clearLogout();
                if (login) {
                    $scope.login();
                }
            }
        });
    };

    function drawCanvas(id, width, height) {
        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        context.globalAlpha = 1.0;
        context.drawImage(img1, 0, 0, width, height);
        context.globalAlpha = 0.5;
        context.drawImage(img2, 0, 0, width, height);

        var fontSize = width * 0.15;
        var text = '$5';
        var x = (width / 2) - ((text.length / 2) * fontSize * 1.2);
        var y = height - (height / 3) + fontSize * 0.1;
        context.globalAlpha = 0.9;
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);

        var y = height - (height / 3) - fontSize * 0.2;
        var fontSize = fontSize * 0.3;
        var text = 'for';
        context.globalAlpha = 0.9;
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        var x = (width / 2) - ((text.length / 2) * fontSize * 0.2);
        context.fillText(text, x, y);

        var text = 'Ecuador';
        context.fillStyle = 'yellow';
        var y = y + fontSize;
        context.fillText(text, x, y);

        context.fillStyle = 'white';
        fontSize = width * 0.03;
        text = 'I\'m the donor:';
        x = (width / 2) - ((text.length / 2) * fontSize / 2.2);
        y = height - (height / 6);

        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        //context.fillText(text, x, y);

        y = y + fontSize * 1.7;
        fontSize = fontSize * 1.7;
        text = '1236';
        x = (width / 2) - ((text.length / 2) * fontSize / 1.8);
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        //context.fillText(text, x, y);


        fontSize = width * 0.033;
        text = 'http://bit.ly/1VB8gFz';
        x = (width / 2) - ((text.length / 2) * fontSize / 2.30);
        y = y + fontSize * 1.2;

        context.font = "bold " + fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);
    }

    function drawCanvasNumber(id, width, height) {
        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');

        context.globalAlpha = 0.5;

        var fontSize = width * 0.15;
        var text = '$5';
        var x = (width / 2) - ((text.length / 2) * fontSize * 1.2);
        var y = height - (height / 3) + fontSize * 0.1;
        context.globalAlpha = 0.9;
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        //context.fillText(text, x, y);

        var y = height - (height / 3) - fontSize * 0.2;
        var fontSize = fontSize * 0.3;
        var text = 'for';
        context.globalAlpha = 0.9;
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        var x = (width / 2) - ((text.length / 2) * fontSize * 0.2);
        //context.fillText(text, x, y);

        var text = 'Ecuador';
        context.fillStyle = 'yellow';
        var y = y + fontSize;
        //context.fillText(text, x, y);

        context.fillStyle = 'white';
        fontSize = width * 0.03;
        text = 'I\'m the donor:';
        x = (width / 2) - ((text.length / 2) * fontSize / 2.2);
        y = height - (height / 6);

        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);

        y = y + fontSize * 1.7;
        fontSize = fontSize * 1.7;
        text = $scope.number+"";
        x = (width / 2) - ((text.length / 2) * fontSize / 1.8);
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);


        fontSize = width * 0.033;
        text = 'http://bit.ly/1VB8gFz';
        x = (width / 2) - ((text.length / 2) * fontSize / 2.30);
        y = y + fontSize * 1.2;

        context.font = "bold " + fontSize + "px Calibri";
        context.fillStyle = 'white';
        //context.fillText(text, x, y);
    }

    function draw() {
        drawCanvas('canvas400', 400, 400);
        drawCanvas('canvas1200', 1200, 1200);
        $.getJSON('http://alloworigin.com/get?url=http%3A//1forecuador.mybluemix.net/getDonor%3Fid%3D'+ $scope.user.id + '&callback=?', function(data) {
        	data.contents = JSON.parse(data.contents);
    		if(data && data.contents && data.contents.number){
    			var user = data.contents;
    			$scope.number = user.number;
    			$scope.drawNumber();
    		}
	    });
    }

    $scope.drawNumber = function(hide){
    	if(!$scope.drawn){
    		$scope.drawn = true;
    		$scope.userDonated = true;
    		$scope.$digest();
    		drawCanvasNumber('canvas400', 400, 400);
        	drawCanvasNumber('canvas1200', 1200, 1200);
        	if(hide){
        		$('#myModal').modal('hide');
        	}
    	}
    };

    $scope.me = function() {
        Facebook.api('/me?fields=id,email,first_name,last_name,picture.width(1200).height(1200)', function(response) {
            $scope.user = response;
            $scope.name = $scope.user.first_name;
            $scope.profileUrl = $scope.user.picture.data.url;
            generateImg();
        });
    };

    function generateImg() {
        var img = document.createElement('img');
        img.id = 'img1';
        img.crossorigin = 'anonymous';
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = $scope.profileUrl;
        img.width = '250';
        img.height = '250';
        img.onload = draw;
        document.getElementById("im").innerHTML = '';
        document.getElementById("im").appendChild(img);
    }

    $scope.saveUser = function(){
    	$scope.saveClicked = true;
    	$.getJSON('http://alloworigin.com/get?url=http%3A//1forecuador.mybluemix.net/getDonor%3Fid%3D'+ $scope.user.id + '&callback=?', function(data) {
    		data.contents = JSON.parse(data.contents);
    		if(data && data.contents && data.contents.number){
    			var user = data.contents;
    			$scope.number = user.number;
    			$scope.drawNumber(true);
    		}else{
    			createNew();
    		}
	    });
    };

    function createNew(){
    	$.getJSON('http://whateverorigin.org/get?url=http%3A//1forecuador.mybluemix.net/increaseCount&callback=?', function(data) {
    		data.contents = JSON.parse(data.contents);
    		try{
    			$scope.number = parseInt(data.contents.c);
    			$scope.sendData().then(function(){},function(){});
    			$scope.drawNumber(true);
    		}catch(error){

    		}
	    });
    }

    $scope.$watch(function() {
        return Facebook.isReady();
    }, function(ready) {
        if (ready) {
            $scope.getLoginStatus(false);
        }
    });
});