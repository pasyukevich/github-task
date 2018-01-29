angular.module('githubSearch').directive('listDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'listController',
      templateUrl:'components/list/listView.html'
    }
 });