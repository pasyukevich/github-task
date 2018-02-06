angular.module('githubSearch').controller('repoController', ($scope, listItemFactory, githubSearchFactory, dataFactory, $state, $stateParams) => {
    const SIZE_OF_PAGE = 30;

    let currentPage,
        currentRepo,
        repos;

    $scope.repoId = $stateParams.id;

    [currentPage, currentRepo] = dataFactory.getRepoArrayAndIndexById($scope.repoId);


    if (!currentPage && !currentRepo) {
        $state.go('main');
    } else {
        repos = dataFactory.getData('repositories', currentPage);
        $scope.repo = repos[currentRepo];
    }

    $scope.isRightButtonDisabled = function () {
        return listItemFactory.isRightButtonDisabled(currentRepo, currentPage, 'repositories');
    }
    $scope.isLeftButtonDisabled = function () {
        return listItemFactory.isLeftButtonDisabled(currentRepo, currentPage);
    }

    $scope.goToNextRepo = function () {
        listItemFactory.goToNextItem(currentRepo, currentPage, SIZE_OF_PAGE, repos, 'repositories');
    }

    $scope.goToPrevRepo = function () {
        listItemFactory.goToPreviousItem(currentRepo, currentPage, SIZE_OF_PAGE, repos, 'repositories');
    }

    $scope.goToSearchResults = function () {
        let word = githubSearchFactory.getSearchWord();
        $state.go('main.results', {
            query: word,
            page: ''
        });
    }
});