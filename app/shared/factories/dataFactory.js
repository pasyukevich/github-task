angular.module('githubSearch').factory('dataFactory', () => {
    const MAX_AMOUNT = 1000;
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
            // this.setData('users','1',usersData.items);
            // this.setData('users','total',usersData.total_count);
            // this.setData('users','amount',usersData.items);
            //   cache.users[1] = usersData.items;
            //    cache.users.total = usersData.total_count;
            // cache.users.amount = cache.users.total > MAX_AMOUNT ? MAX_AMOUNT : cache.users.total;
            // cache.repositories[1] = reposData.items;
            // cache.repositories.total = reposData.total_count;
            // cache.repositories.amount = cache.repositories.total > MAX_AMOUNT ? MAX_AMOUNT : cache.repositories.total;
            // cache.issues[1] = issuesData.items;
            // cache.issues.total = issuesData.total_count;
            // cache.issues.amount = cache.issues.total > MAX_AMOUNT ? MAX_AMOUNT : cache.issues.total;
            // cache.code[1] = codeData.items;
            // cache.code.total = codeData.total_count;
            // cache.code.amount = cache.code.total > MAX_AMOUNT ? MAX_AMOUNT : cache.code.total;
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