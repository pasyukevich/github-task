angular.module('githubSearch').directive('loadingDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      templateUrl:'components/loading/loadingView.html'
    }
 });