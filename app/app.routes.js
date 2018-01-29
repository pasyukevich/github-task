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