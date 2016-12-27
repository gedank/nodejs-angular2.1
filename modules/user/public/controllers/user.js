var App = angular.module('User', ['ngRoute','ngResource']);
var base_url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

App.filter('trust', ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

App.config(function($routeProvider) {
    $routeProvider
    .when('/users', {
		templateUrl:'../user/public/views/user-list.html',
		controller:'UserListController',
	})
	.when('/users/add', {
		templateUrl:'../user/public/views/user-add.html',
		controller:'UserAddController',
	})
	.when('/users/edit/:id', {
		templateUrl:'../user/public/views/user-add.html',
		controller:'UserEditController',
	})
	.when('/users/del/:id', {
		templateUrl:'../user/public/views/user-del.html',
		controller:'UserDelController',
	})
	.when('/users/detail/:id', {
		templateUrl:'../user/public/views/user-detail.html',
		controller:'UserDetailController',
	})
});


//controller
App.controller('UserListController', function($scope, $http, $location){
	$scope.titles = 'User';
	$scope.orderProp = 'name';
	var page = '';
	var limit = '';
	if(isEmpty($location.search())){
	}else{
		page = $location.search().page;
		if(typeof $location.search().limit != 'undefined'){
			limit = $location.search().limit;
		}
	}
	var _page = '';
	if(page!=''){
		_page = '?page='+page;
		if(limit!=''){
			_page += '&limit='+limit;
		}
	}
	// console.log(_page);
	$http.get(base_url+'/api-user/users'+_page).success(function(data, status){
		$scope.users = data.data;
		$scope.offset = data.offset;
		$scope.pagination = data.paginator;
		$scope.count = data.count;
		$scope.no = data.no;
		$scope.limit = data.limit;
		limitc(data.limit);
	});
});

App.controller('UserAddController', function($scope, $http, $location){
	$scope.titles = 'Add User';
	$scope.user = {
		_id: '',
		username: '',
		email: '',
		name: ''
	};
	$scope.submit = function(){
		console.log('Saving New User', $scope.user);
		$http.post(base_url+'/api-user/users/add',$scope.user).success(function(data, status){
			if(data.redirect==true){
				window.location.href = '/'+data.server+'/#/users';
			}
		});
	};
});

App.controller('UserEditController', function($scope, $http, $location, $route, $routeParams){
	$scope.titles = 'Edit User';
	$http.get(base_url+'/api-user/users/edit/'+$routeParams.id).success(function(data, status){
		$scope.user = data.data;
	});
	$scope.submit = function(){
		console.log('User updated with id ', $scope.user._id);
		$http.put(base_url+'/api-user/users/edit/'+$scope.user._id,$scope.user).success(function(data, status){
			if(data.redirect==true){
				window.location.href = '/'+data.server+'/#/users';
			}
		});
	};
});

App.controller('UserDelController', function($scope, $http, $location, $route, $routeParams){
	$http.delete(base_url+'/api-user/users/delete/'+$routeParams.id).success(function(data, status){
		if(data.redirect==true){
			window.location.href = '/'+data.server+'/#/users';
		}
	});
});

App.controller('UserDetailController', function($scope, $http, $location, $route, $routeParams){
	$scope.titles = 'Detail User';

	$http.get(base_url+'/api-user/users/edit/'+$routeParams.id).success(function(data, status){
		$scope.user = data.data;
	});
});