angular.module('githubSearch').directive('userDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'userController',
      templateUrl:'components/user/userView.html'
    }
 });