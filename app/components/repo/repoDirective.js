angular.module('githubSearch').directive('repoDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'repoController',
      templateUrl:'components/repo/repoView.html'
    }
 });