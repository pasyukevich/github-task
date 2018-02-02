! function () {
    let app = angular.module('githubSearch', ['ui.router', 'ui.bootstrap']);
}();
angular.module('githubSearch').config(function ($stateProvider, $urlRouterProvider) {
    let states = [{
            name: 'main',
            url: '/',
            template: '<search-directive/>',

        },
        {
            name: 'main.results',
            url: `search?{query}{page}`,
            template: '<results-directive/>'
        },
        {
            name: 'main.results.list',
            url: '',
            template: '<list-directive/>'
        },
        {
            name: 'main.user',
            url: 'users/{id}/{repo}',
            template: '<user-directive/>'
        },
        {
            name: 'main.repo',
            url: 'repos/{id}/',
            template: '<repo-directive/>'
        }

    ];
    states.forEach((state)=> {
        $stateProvider.state(state);
    });
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/NotFound');
});
angular.module('githubSearch').run( ($uiRouter)=> {
    let StateTree = window['ui-router-visualizer'].StateTree;
    let el = StateTree.create($uiRouter, null, {
        height: 300,
        width: 300
    });
    el.className = 'statevis';
});
angular.module('githubSearch').directive('loadingDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      templateUrl:'components/loading/loadingView.html'
    }
 });
angular.module('githubSearch').controller('listController', ($scope, githubSearchFactory, dataFactory, $stateParams, $state) => {
    let currentPage = $stateParams.page || 1,
        currentList = githubSearchFactory.getCurrentList();

    $scope.itemsPerPage = 30;
    $scope.currentPage = currentPage;
    $scope.maxSize = 10;
    $scope.totalItems = dataFactory.getItemsAmount(currentList);

    githubSearchFactory.getList(currentList, currentPage).then(response => {
        $scope[currentList] = response;
    });


    $scope.nextPage = function () {
            $state.go('main.results', {
                query: $stateParams.query,
                page: $scope.currentPage > 1 ? $scope.currentPage : ''
            }, {
                reload: true
            });
        },
        $scope.isActive = function (checkList) {
            return githubSearchFactory.getCurrentList() === checkList;
        }


    $scope.propertyName = 'forks';
    $scope.reverse = true;
    
    $scope.sortBy = function (propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
});
angular.module('githubSearch').directive('listDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'listController',
      templateUrl:'components/list/listView.html'
    }
 });
angular.module('githubSearch').controller('repoController', ($scope, githubSearchFactory, dataFactory, $state, $stateParams) => {
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
        if (currentRepo > 29 || currentRepo == repos.length) {
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
                changeRepo(repos[29].id);
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
angular.module('githubSearch').directive('repoDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'repoController',
      templateUrl:'components/repo/repoView.html'
    }
 });
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
angular.module('githubSearch').directive('resultsDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'resultsController',
      templateUrl:'components/results/resultsView.html'
    }
 });
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
angular.module('githubSearch').directive('userDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'userController',
      templateUrl:'components/user/userView.html'
    }
 });
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
angular.module('githubSearch').directive('searchDirective',()=>{
   return{
     scope:{},
     restrict:'E',
     controller:'searchController',
     templateUrl:'components/search/searchView.html'
   }
});
angular.module('githubSearch').factory('dataFactory', () => {
    let cache = {
        users: {},
        repositories: {},
        issues: {},
        code: {}
    };
    function clearAll() {
        cache.users = {};
        cache.repositories = {};
        cache.users = {};
        cache.issues = {};
    };

    return {
        setAll(usersData, reposData, issuesData, codeData) {
            clearAll();
            cache.users[1] = usersData.items;
            cache.users.total = usersData.total_count;
            cache.users.amount = cache.users.total > 1000 ? 1000 : cache.users.total;
            cache.repositories[1] = reposData.items;
            cache.repositories.total = reposData.total_count;
            cache.repositories.amount = cache.repositories.total > 1000 ? 1000 : cache.repositories.total;
            cache.issues[1] = issuesData.items;
            cache.issues.total = issuesData.total_count;
            cache.issues.amount = cache.issues.total > 1000 ? 1000 : cache.issues.total;
            cache.code[1] = codeData.items;
            cache.code.total = codeData.total_count;
            cache.code.amount = cache.code.total > 1000 ? 1000 : cache.code.total;
        },
        getData(field, page) {
            return cache[field][page];
        },
        setData(field, page, data) { //data should be an  array of items
            cache[field][page] = data;
        },
        getItemsAmount(field) {
            return cache[field].amount;
        },
        getItemsTotal(field) {
            return cache[field].total;
        },
        getUserArrayAndIndexById(id) {
            if (Object.keys(cache.users).length === 0) return [null, null];
            for (let page in cache.users) {
                for (let user in cache.users[page]) {
                    if (cache.users[page][user].id == id) return [page, user];
                }
            }
        },
        getRepoArrayAndIndexById(id) {
            if (Object.keys(cache.repositories).length === 0) return [null, null];
            for (let page in cache.repositories) {
                for (let repo in cache.repositories[page]) {
                    if (cache.repositories[page][repo].id == id) return [page, repo]
                }
            }
        }
    }
});
angular.module('githubSearch').factory('githubSearchFactory', ($http, $q, dataFactory) => {
    let prev = null,
        currentList = 'users',
        promiseStatus = [];

    

    function getListUrl(field, page) {
        switch (field) {
            case 'code':
                return `https://api.github.com/search/code?q=${prev}+repo:jquery/jquery&page=${page}`;
                break;
            default:
                return `https://api.github.com/search/${field}?q=${prev}&page=${page}`;
                break;
        }
    };
    return {
        getSearchWord(){
          return prev;
        },
        getSearchResult(searchWord) {
            promiseStatus[0] = false;
            if (prev !== searchWord) {
                prev = searchWord;
                promiseStatus[0] = true;
                users = $http.get(`https://api.github.com/search/users?q=${searchWord}`);
                repos = $http.get(`https://api.github.com/search/repositories?q=${searchWord}`);
                issues = $http.get(`https://api.github.com/search/issues?q=${searchWord}`);
                code = $http.get(`https://api.github.com/search/code?q=${searchWord}+repo:jquery/jquery`);

                prom = $q.all({
                    users,
                    repos,
                    issues,
                    code,
                    promiseStatus
                });
            }
            return prom;
        },
        getList(field, page) {
            let list = dataFactory.getData(field, page),
                getProm = $q.defer();
            if (!list) {
                let url = getListUrl(field, page);
                $http.get(url).then(response => {
                    dataFactory.setData(field, page, response.data.items);
                    list = dataFactory.getData(field, page);
                    console.log('start the getList promise')
                    getProm.resolve(list);
                });
            } else getProm.resolve(list);
            return getProm.promise;
        },
        getCurrentList() {
            return currentList;
        },
        setCurrentList(list) {
            currentList = list;
        },
        getReposListForUser(login){
            return $http.get(`https://api.github.com/users/${login}/repos`);
        },
        getUserRepo(login,repo){
            return $http.get(`https://api.github.com/repos/${login}/${repo}`);
        }
    }
});