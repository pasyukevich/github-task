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