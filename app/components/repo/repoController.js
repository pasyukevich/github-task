angular.module('githubSearch').controller('repoController', ($scope, githubSearchFactory, dataFactory, $state, $stateParams) => {
    const SIZE_OF_PAGE=30;
    let currentPage,
        currentRepo,
        repos;

    $scope.repoId = $stateParams.id;

    [currentPage, currentRepo] = dataFactory.getRepoArrayAndIndexById($scope.repoId);

    function changeRepo(id) {
        $state.go('main.repo', {
            id
        }, {
            reload: true
        });
    }

    if (!currentPage && !currentRepo) {
        $state.go('main');
    } else {
        repos = dataFactory.getData('repositories', currentPage);
        $scope.repo = repos[currentRepo];
    }
    
    $scope.isRightButtonDisabled = function () {
        let amount = dataFactory.getItemsAmount('repositories');
        return currentRepo == amount - 1;
    }

    $scope.isLeftButtonDisabled = function () {
        return currentRepo == 0 && currentPage == 1;
    }

    $scope.goToNextRepo = function () {
        currentRepo++;
        if (currentRepo > SIZE_OF_PAGE-1 || currentRepo == repos.length) {
            githubSearchFactory.getList('repositories', ++currentPage).then(response => {
                repos = response;
                changeRepo(repos[0].id);
            }).catch(error => {

            });
        } else changeRepo(repos[currentRepo].id);
    }

    $scope.goToPrevRepo = function () {
        currentRepo--;
        if (currentRepo < 0) {
            githubSearchFactory.getList('repositories', --currentPage).then(response => {
                repos = response;
                changeRepo(repos[SIZE_OF_PAGE-1].id);
            })
        } else changeRepo(repos[currentRepo].id);
    }

    $scope.goToSearchResults=function(){
        let word=githubSearchFactory.getSearchWord();
        $state.go('main.results', {
            query: word,
            page: ''
        });
    }

});