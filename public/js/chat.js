var app = angular.module('myApp', ['ngSanitize']);

app.config(['$httpProvider', function($httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller('planetController', function($scope, $http, $location) {
  $scope.searchR = function(query) {
    var url = $location.protocol() + "://" + location.host + "/BOTeo/reply";
    var payload = {
      message: query,
      vars:{name:"a"}};
      //vars:{}};
    $http.post(url, payload, {
      headers: {'Content-Type': 'application/json'}
    })
      .then(function(response) {
        ga('send', 'event', 'chaTeo', 'question', query.toLowerCase());
        
	$scope.myreply = response.data.reply;
	//$scope.history = response.data.vars["__history__"];
	$scope.query = "";
      });
  };
  $scope.myreply = "Tell me something, I'll try to answer you...";
});
