(function(){
  // document.ready(function(){
  //   window.setInterval(function() {
  //     var elem = document.getElementById('chatPanel-div');
  //     elem.scrollTop = elem.scrollHeight;
  //   }, 1000);
  // });


  var app = angular.module('chat', ["ngSanitize"]);

  app.value("socket", io.connect('http://10.0.11.67:8080/'));

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

    // init chatPanel 避免 chatPanel一開始是undefined
    $scope.chatPanel = "<big>基地司令官&nbsp;說:&nbsp;歡迎加入秘密小隊</big>";
    $scope.appendChat = function(talker, content, date){
      if(!$scope.chatPanelElem) 
        $scope.chatPanelElem = document.getElementById($scope.chatPanelDiv);

      var echo_msg = "<big>" + talker + "&nbsp;說:&nbsp;" + content + "</big><small>";
      echo_msg += "<i>&nbsp;at&nbsp;<time>" + date.getHours() + ":" + date.getMinutes() + "</time></i></small>";
      
      $scope.chatPanel += '<br>'+echo_msg;

      $scope.chatPanelElem.scrollTop = $scope.chatPanelElem.scrollHeight;
    };

    // ECHO ~BACK~ HERE!!!
    socket.on('echo_back', function(data) {
      $scope.$apply(function(){
        $scope.appendChat(data['name'], data['data'], new Date(data['date']));
      });

      if(onblurBlinkCtr.is_onblur)
        onblurBlinkCtr.newExcitingAlerts();
    });


    // ECHO ~POST~ HERE!!!
    $scope.talk = function(){
      socket.emit('echo_post', $scope.nickName, $scope.chat);
      $scope.chat = "";
      if(onblurBlinkCtr.is_onblur)
        onblurBlinkCtr.newExcitingAlerts();
    };
  }]);

})();
