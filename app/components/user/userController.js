angular.module('githubSearch').controller('userController', ($scope, listItemFactory, githubSearchFactory, dataFactory, $state, $stateParams) => {
    const SIZE_OF_PAGE = 30;

    let currentPage,
        currentUser,
        users;

    userId = $stateParams.id;
    repoName = $stateParams.repo;

    [currentPage, currentUser] = dataFactory.getUserArrayAndIndexById(userId);

    if (!currentPage && !currentUser) {
        $state.go('main');
    } else {
        users = dataFactory.getData('users', currentPage);
        $scope.user = users[currentUser]


        githubSearchFactory.getReposListForUser($scope.user.login).then(response => {
            $scope.userRepos = response.data;
        });

        if (repoName) {
            githubSearchFactory.getUserRepo($scope.user.login, repoName).then(response => {
                $scope.repo = response.data;
            })
        };

    }

    $scope.isRightButtonDisabled = function () {
        return listItemFactory.isRightButtonDisabled(currentUser, currentPage, SIZE_OF_PAGE, 'users');
    }

    $scope.isLeftButtonDisabled = function () {
        return listItemFactory.isLeftButtonDisabled(currentUser, currentPage);
    }

    $scope.goToNextUser = function () {
        listItemFactory.goToNextItem(currentUser, currentPage, SIZE_OF_PAGE, users, 'users');
    }

    $scope.goToPrevUser = function () {
        listItemFactory.goToPreviousItem(currentUser, currentPage, SIZE_OF_PAGE, users, 'users');
    }

    $scope.goToSearchResults = function () {
        let word = githubSearchFactory.getSearchWord();
        $state.go('main.results', {
            query: word,
            page: ''
        });
    }

    $scope.backToUser = function () {
        $state.go('main.user', {
            userId,
            repo: ''
        }, {
            reload: true
        });
    }
});