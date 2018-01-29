angular.module('githubSearch').controller('userController', ($scope, githubSearchFactory, dataFactory, $state, $stateParams) => {
    let currentPage,
        currentUser,
        users;
    
    userId = $stateParams.id;
    repoName = $stateParams.repo;
   
    [currentPage, currentUser] = dataFactory.getUserArrayAndIndexById(userId);

    function changeUser(id) {
        $state.go('main.user', {
            id
        }, {
            reload: true
        });
    }

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
        let amount = dataFactory.getItemsAmount('users');
        return currentUser == amount - 1;
    }

    $scope.isLeftButtonDisabled = function () {
        return currentUser == 0 && currentPage == 1;
    }

    $scope.goToNextUser = function () {
        currentUser++;
        console.log(currentUser);
        if (currentUser > 29 || currentUser == users.length) {
            githubSearchFactory.getList('users', ++currentPage).then(response => {
                users = response;
                changeUser(users[0].id);
            }).catch(error => {
                changeUser($stateParams.id);
            });
        } else changeUser(users[currentUser].id);
    }

    $scope.goToPrevUser = function () {
        currentUser--;
        if (currentUser < 0) {
            githubSearchFactory.getList('users', --currentPage).then(response => {
                users = response;
                changeUser(users[29].id);
            })
        } else changeUser(users[currentUser].id);
    }

    $scope.goToSearchResults=function(){
        let word=githubSearchFactory.getSearchWord();
        $state.go('main.results', {
            query: word,
            page: ''
        });
    }

    $scope.goToUser=function(){
        $state.go('main.user', {
            userId,
            repo:''
        }, {
            reload: true
        });
    }
});