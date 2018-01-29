angular.module('githubSearch').directive('searchDirective',()=>{
   return{
     scope:{},
     restrict:'E',
     controller:'searchController',
     templateUrl:'components/search/searchView.html'
   }
});