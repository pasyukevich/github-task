angular.module('githubSearch').controller('resultsController', ($scope, items, githubSearchFactory, dataFactory, $stateParams, $state) => {
    let query = $stateParams.query;       

    $scope.items = items;
    $scope.loading=true;
     
    if (query===undefined)  $state.go('main');

    githubSearchFactory.getSearchResult(query).then(response => {
        if (response.promiseStatus[0]) {                                
            dataFactory.setAll(response.users.data, response.repos.data,
                response.issues.data, response.code.data);
        }
        $scope.usersAmount = dataFactory.getItemsTotal('users');
        $scope.reposAmount = dataFactory.getItemsTotal('repositories');
        $scope.issuesAmount = dataFactory.getItemsTotal('issues');
        $scope.codeAmount = dataFactory.getItemsTotal('code');
        $state.go('.list');
        $scope.loading = false;
    })

    $scope.setTo = function (ListName) {
        githubSearchFactory.setCurrentListName(ListName);
        $state.go('main.results', {
            query,
            page: ''
        }, {
            reload: true
        });

    }

    $scope.isActive = function (checkList) {
        return githubSearchFactory.getCurrentListName() === checkList;
    }
});