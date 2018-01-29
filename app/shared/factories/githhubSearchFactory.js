angular.module('githubSearch').factory('githubSearchFactory', ($http, $q, dataFactory) => {
    let prev = null,
        currentList = 'users',
        promiseStatus = [];

    $http.defaults.headers.common.Authorization = 'token 14474ef8fc9ebbcfb9e203f52ca8b3da1cd61ce2';

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
                let url = this.getListUrl(field, page);
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