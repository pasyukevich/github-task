angular.module('githubSearch').controller('searchController', ($scope, githubSearchFactory, $state,dataFactory) => {
    $scope.makeSearch = function () {
        if ($scope.searchRequest !== undefined && $scope.searchRequest !== '') {
            $state.go('main.results', {
                query: $scope.searchRequest,
                page: ''
            });
        }
    }
});