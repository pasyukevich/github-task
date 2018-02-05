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
            promiseStatus[0] = false;
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
                let url = getListUrl(field, page);
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