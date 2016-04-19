'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'facebook'
])

.config(['$routeProvider','$httpProvider', 'FacebookProvider', function($routeProvider, $httpProvider, FacebookProvider) {
    FacebookProvider.init('999706743399600');
     $httpProvider.defaults.useXDomain = true;
 	delete $httpProvider.defaults.headers.common["X-Requested-With"];
 	$httpProvider.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
 	$httpProvider.defaults.headers.common["Accept"] = "application/json";
 	$httpProvider.defaults.headers.common["content-type"] = "application/json";
}])

.controller('mainCtrl', function($http, $scope, $window, Facebook) {
    $scope.loggedIn = false;
    $scope.donated = false;
    $scope.didDonate = false;

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
    }

    $scope.saveImage = function() {
        var canvas = document.getElementById('canvas1200');
        var dataURL = canvas.toDataURL("image/png");
        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
    }

    $scope.sendData = function() {
        var req = {
            method: 'POST',
            url: 'http://1forecuador.mybluemix.net/add?c1=1',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { test: 'test' }
        };

        $http(req).then(function() {}, function() {});
    };

    $scope.donated = function() {
        $scope.donated = true;
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
        context.fillText(text, x, y);

        y = y + fontSize * 1.7;
        fontSize = fontSize * 1.7;
        text = '1236';
        x = (width / 2) - ((text.length / 2) * fontSize / 1.8);
        context.font = fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);


        fontSize = width * 0.033;
        text = 'http://bit.ly/1SPs553';
        x = (width / 2) - ((text.length / 2) * fontSize / 2.30);
        y = y + fontSize * 1.2;

        context.font = "bold " + fontSize + "px Calibri";
        context.fillStyle = 'white';
        context.fillText(text, x, y);
    }

    function draw() {
        drawCanvas('canvas400', 400, 400);
        drawCanvas('canvas1200', 1200, 1200);
    }

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
        img.src = $scope.profileUrl;
        img.width = '250';
        img.height = '250';
        img.onload = draw;
        img.crossorigin = 'anonymous';
        img.setAttribute('crossOrigin', 'anonymous');
        document.getElementById("im").innerHTML = '';
        document.getElementById("im").appendChild(img);
    }

    $scope.$watch(function() {
        return Facebook.isReady();
    }, function(ready) {
        if (ready) {
            $scope.getLoginStatus(false);
        }
    });
});