(function(){
  // document.ready(function(){
  //   window.setInterval(function() {
  //     var elem = document.getElementById('chatPanel-div');
  //     elem.scrollTop = elem.scrollHeight;
  //   }, 1000);
  // });


  var app = angular.module('chat', ["ngSanitize"]);

  app.value("socket", io.connect('http://10.0.21.67:8080/'));

  app.factory('onblurBlinkCtr', [function() {
    var onblurBlinkCtr = {};

    window.onblur = function(){
      onblurBlinkCtr.is_onblur = true;
    };

    window.onfocus = function(){
      onblurBlinkCtr.is_onblur = false;
    };

    onblurBlinkCtr = {
      is_onblur : false,
      newExcitingAlerts : (function () {
        var oldTitle = document.title;
        var msg = "ESS系統";
        var timeoutId;
        var blink = function() {
          document.title = document.title == msg ? oldTitle : msg;
        };

        var oldOnfocusFunc = window.onfocus;
        var clear = function() {
          clearInterval(timeoutId);
          document.title = oldTitle;
          timeoutId = null;

          window.onfocus = oldOnfocusFunc;
          oldOnfocusFunc();
        };

        return function () {
          if (!timeoutId) {
            timeoutId = setInterval(blink, 1500);
            window.onfocus = clear;
          }
        };
      })()
    };

    return onblurBlinkCtr;
  }]);

  app.controller('MainController', ["$scope", "socket", "onblurBlinkCtr", function($scope, socket, onblurBlinkCtr){
    $scope.nickName = cookies.getCookie('nickName') || '無名';
    $scope.setNickName = function(){
      cookies.setCookie('nickName', $scope.nickName);
    };
    // $scope.messages = [];
    $scope.chatPanel = '<p>進入秘密基地</p>';
    socket.on('echo_back', function(m) {
      $scope.$apply(function(){
        $scope.chatPanel += '<br>'+m;
        var elem = document.getElementById($scope.chatPanelDiv);
        elem.scrollTop = elem.scrollHeight;
      });
      if(onblurBlinkCtr.is_onblur){
        onblurBlinkCtr.newExcitingAlerts();
      }
    });

    $scope.talk = function(){
      socket.emit('echo_post', $scope.nickName, $scope.chat);
      $scope.chat = "";
      if(onblurBlinkCtr.is_onblur)
        onblurBlinkCtr.newExcitingAlerts();
    };
  }]);

})();
