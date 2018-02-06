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
angular.module('githubSearch').controller('listController', ($scope, githubSearchFactory, dataFactory, $stateParams, $state) => {
    const SIZE_OF_PAGE = 30;
    let currentPage = $stateParams.page || 1,
        currentList = githubSearchFactory.getCurrentListName();

    $scope.currentListName = githubSearchFactory.getCurrentListName();

    $scope.itemsPerPage = SIZE_OF_PAGE;
    $scope.currentPage = currentPage;
    $scope.maxSize = 10;
    $scope.totalItems = dataFactory.getItemsAmount(currentList);

    if($scope.totalItems==0) $scope.listIsEmpty=true;
    else $scope.listIsEmpty=false;

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
    }

    $scope.propertyName = '';
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
angular.module('githubSearch').directive('loadingDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      templateUrl:'components/loading/loadingView.html'
    }
 });
angular.module('githubSearch').factory('dataFactory', () => {
    const MAX_AMOUNT = 1020;
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
        setAll(usersData, repositoriesData, issuesData, codeData) {
            let data = {
                    users: usersData,
                    repositories: repositoriesData,
                    issues: issuesData,
                    code: codeData
                },
                amount;

            clearAll();
            
            for (let field in cache) {
                this.setData(field, '1', data[field].items);
                this.setData(field, 'total', data[field].total_count);
                amount = cache[field].total > MAX_AMOUNT ? MAX_AMOUNT : cache[field].total;
                this.setData(field, 'amount', amount);
            }
        },
        getData(field, page) {
            return cache[field][page];
        },
        setData(field, nestedField, data) {
            cache[field][nestedField] = data;
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
    let previous = null,
        currentList = 'users',
        promiseStatus = [],
        users,
        repos,
        issues,
        code;

    $http.defaults.headers.common.Authorization = 'token 3f99eb6ad10154e49c90ef1fc141024d4115677b';

    function getListUrl(field, page,searchWord) {
        switch (field) {
            case 'code':
                return `https://api.github.com/search/code?q=${previous}+repo:jquery/jquery&page=${page}`;
                break;
            default:
                return `https://api.github.com/search/${field}?q=${searchWord}&page=${page}`;
                break;
        }
    };

    function getSearchPromise(url){
      return $http.get(url);
    }

    return {
        getSearchWord(){
          return previous;
        },
        getSearchResult(searchWord) {
            promiseStatus[0] = false;   // this value display did we make new get request or we use previous
            if (previous !== searchWord) {
                previous = searchWord;
                promiseStatus[0] = true;
                users = getSearchPromise(getListUrl('users', 0,searchWord));
                repos = getSearchPromise(getListUrl('repositories', 0,searchWord));
                issues = getSearchPromise(getListUrl('issues', 0,searchWord));
                code = getSearchPromise(getListUrl('code', 0,searchWord));

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
            let list = dataFactory.getData(field, page,previous),
                getProm = $q.defer();
            if (!list) {
                let url = getListUrl(field, page,previous);
                getSearchPromise(url).then(response => {
                    dataFactory.setData(field, page, response.data.items);
                    list = dataFactory.getData(field, page);
                    getProm.resolve(list);
                });
            } else getProm.resolve(list);
            return getProm.promise;
        },
        getCurrentListName() {
            return currentList;
        },
        setCurrentListName(list) {
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
angular.module('githubSearch').factory('listItemFactory', ($state,dataFactory,githubSearchFactory) => {
    function changeCurrentItem(stateName,id){
        $state.go(stateName, {
            id
        }, {
            reload: true
        });
    }
    
    function getStateName(type){
         switch(type){
             case 'repositories':
                  return `main.repo`;
                  break;
             case 'users':
                   return 'main.user';
                   break;     
         }

    }
    return {
        isRightButtonDisabled(currentItemNumber,currentPage,SIZE_OF_PAGE,type){
            let amount = dataFactory.getItemsAmount(type);
            return +currentItemNumber+(currentPage-1)*SIZE_OF_PAGE == amount - 1;
        },
        isLeftButtonDisabled (cyrrentItemNumber,currentPageNumber) {
            return cyrrentItemNumber == 0 && currentPageNumber == 1;
        },
        goToNextItem(currentItemNumber,currentPage,SIZE_OF_PAGE,items,type){
            let stateName=getStateName(type)
            currentItemNumber++;
            if(currentItemNumber>SIZE_OF_PAGE-1||currentItemNumber==items.length){
                githubSearchFactory.getList(type, ++currentPage).then(response => {
                    items = response;
                    changeCurrentItem(stateName,items[0].id);
                });
            } else changeCurrentItem(stateName,items[currentItemNumber].id);
        },
        goToPreviousItem(currentItemNumber,currentPage,SIZE_OF_PAGE,items,type){
            let stateName=getStateName(type);
            currentItemNumber--;
            if(currentItemNumber<0){
                githubSearchFactory.getList(type, --currentPage).then(response => {
                    items = response;
                    changeCurrentItem(stateName,items[SIZE_OF_PAGE-1].id);
                })
            }else changeCurrentItem(stateName,items[currentItemNumber].id);
        }
    }
});
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
        return listItemFactory.isRightButtonDisabled(currentRepo, currentPage, SIZE_OF_PAGE, 'repositories');
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
angular.module('githubSearch').directive('repoDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'repoController',
      templateUrl:'components/repo/repoView.html'
    }
 });
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
angular.module('githubSearch').directive('userDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'userController',
      templateUrl:'components/user/userView.html'
    }
 });
angular.module('githubSearch').controller('resultsController', ($scope, items, githubSearchFactory, dataFactory, $stateParams, $state) => {
    let query = $stateParams.query;       

    $scope.items = items;
    $scope.loading=true;
     
    if (query===undefined)  $state.go('main');

    githubSearchFactory.getSearchResult(query).then(response => {
        if (response.promiseStatus[0]) {                                //if we have the previous search word we
            dataFactory.setAll(response.users.data, response.repos.data,//don't need to reset our data
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
angular.module('githubSearch').directive('resultsDirective',()=>{
    return{
      scope:{},
      restrict:'E',
      controller:'resultsController',
      templateUrl:'components/results/resultsView.html'
    }
 });
angular.module('githubSearch').value("items", [
    {
        name: 'users',
        amount: 'usersAmount'
    },
    {
        name: 'repositories',
        amount: 'reposAmount'
    },
    {
        name: 'issues',
        amount: 'issuesAmount'
    },
    {
        name: 'code',
        amount: 'codeAmount'
    }
]);
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