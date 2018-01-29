angular.module('githubSearch').controller('resultsController', ($scope, githubSearchFactory, dataFactory, $stateParams, $state) => {
    let query = $stateParams.query;

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
    })

    $scope.setTo = function (setList) {
        githubSearchFactory.setCurrentList(setList);
        $state.go('main.results', {
            query,
            page: ''
        }, {
            reload: true
        });

    }

    $scope.isActive = function (checkList) {
        return githubSearchFactory.getCurrentList() === checkList;
    }
});