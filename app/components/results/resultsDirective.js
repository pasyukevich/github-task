angular.module('githubSearch').directive('resultsDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'resultsController',
      templateUrl:'components/results/resultsView.html'
    }
 });