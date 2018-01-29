angular.module('githubSearch').run(['$templateCache', function($templateCache) {$templateCache.put('components/list/listView.html','<div class="col col-xs-10 col-sm-10">\r\n    \r\n    <div ng-show="isActive(\'users\')">\r\n        <loading-directive ng-hide="users"></loading-directive>\r\n        <label class="col col-xs-offset-7" ng-show="users">Filter :\r\n            <input ng-model="usersSearch.login">\r\n        </label>\r\n        <ul class="list-group">\r\n            <li class="list-group-item" ng-repeat="user in users |filter:usersSearch">\r\n                <b>User login:\r\n                    <b>\r\n                        <i>\r\n                            <a ui-sref="main.user({id:user.id,repo:\'\'})"> {{user.login}}</a>\r\n                        </i>\r\n            </li>\r\n            <ul class="pagination-sm" uib-pagination boundary-link-numbers="true" items-per-page="itemsPerPage" ng-change="nextPage()"\r\n                total-items="totalItems" max-size="maxSize" ng-model="currentPage"></ul>\r\n        </ul>\r\n    </div>\r\n\r\n    <div ng-show="isActive(\'repositories\')">\r\n        <loading-directive ng-hide="repositories"></loading-directive>\r\n        <button type="button" class="btn btn-primary" ng-show="repositories" ng-click="sortBy(\'name\')">Sort by name</button>\r\n        <button type="button" class="btn btn-primary" ng-show="repositories" ng-click="sortBy(\'forks\')">Sort by forks</button>\r\n        <button type="button" class="btn btn-primary" ng-show="repositories" ng-click="sortBy(\'open_issues\')">Sort by open_issues</button>\r\n        <button type="button" class="btn btn-primary" ng-show="repositories" ng-click="sortBy(\'size\')">Sort by size</button>\r\n        <label class="col col-xs-offset-8" ng-show="repositories">Search for:\r\n            <input ng-model="reposSearch.name">\r\n        </label>\r\n        <ul class="list-group">\r\n            <li class="list-group-item" ng-repeat="repo in repositories | filter:reposSearch | orderBy:propertyName:reverse">\r\n                <b>\r\n                    <a ui-sref="main.repo({id:repo.id})">Repo: {{repo.name}}</a>\r\n                </b>\r\n                <i>forks: {{repo.forks}}, open issues: {{repo.open_issues}}, size: {{repo.size}}</i>\r\n            </li>\r\n            <ul class="pagination-sm" uib-pagination boundary-link-numbers="true" items-per-page="itemsPerPage" ng-change="nextPage()"\r\n                total-items="totalItems" max-size="maxSize" ng-model="currentPage"></ul>\r\n        </ul>\r\n    </div>\r\n\r\n    <div ng-show="isActive(\'issues\')">\r\n        <loading-directive ng-hide="issues"></loading-directive>\r\n        <ul class="list-group">\r\n            <li class="list-group-item" ng-repeat="issue in issues">\r\n                <h3>issue: {{issue.id}}</h3>\r\n            </li>\r\n            <ul class="pagination-sm" uib-pagination boundary-link-numbers="true" items-per-page="itemsPerPage" ng-change="nextPage()"\r\n                total-items="totalItems" max-size="maxSize" ng-model="currentPage"></ul>\r\n        </ul>\r\n    </div>\r\n\r\n    <div ng-show="isActive(\'code\')">\r\n        <loading-directive ng-hide="code"></loading-directive>\r\n        <ul class="list-group">\r\n            <li class="list-group-item" ng-repeat="result in code">\r\n                <h3>code: {{result.name}}</h3>\r\n            </li>\r\n            <ul class="pagination-sm" uib-pagination boundary-link-numbers="true" items-per-page="itemsPerPage" ng-change="nextPage()"\r\n                total-items="totalItems" max-size="maxSize" ng-model="currentPage"></ul>\r\n        </ul>\r\n    </div>\r\n\r\n</div>');
$templateCache.put('components/repo/repoView.html','<section class="container">\r\n        <div class="row">\r\n\r\n            <button type="button" ng-disabled="isLeftButtonDisabled()"  \r\n            class="btn btn-primary btn-lg col col-xs-2 col-sm-2" ng-click="goToPrevRepo()">prev</button>\r\n\r\n            <button type="button" ng-click="goToSearchResults()" \r\n            class="btn btn-primary col col-xs-2 col-sm-2 col-xs-offset-3">back to search results</button>\r\n\r\n            <button type="button" ng-disabled="isRightButtonDisabled()" \r\n            class="btn btn-primary btn-lg col col-xs-2 col-sm-2 col-xs-offset-3" ng-click="goToNextRepo()">next</button>\r\n            \r\n        </div>\r\n        <div class="row">\r\n           <h2 class="text-center">{{repo.name}}</h2>\r\n           <p class="text-center">size: <span class="badge">{{repo.size}} kb</span><br>\r\n            created at : {{repo.created_at}} <br>\r\n            forks: <span class="badge">{{repo.forks}}kb</span>\r\n          </p>\r\n        </div>\r\n    </section>');
$templateCache.put('components/loading/loadingView.html','<div class="loader"></div>');
$templateCache.put('components/results/resultsView.html','<section class="container">\r\n    <div class="row">\r\n        <aside class="col col-xs-2 col-sm-2">\r\n            <ul class="list-group">\r\n                <li class="list-group-item" ng-class="{selected:isActive(\'users\')}">\r\n                    <a href ng-click="setTo(\'users\')">users <span class="badge">{{usersAmount||0}}</span></a>\r\n                </li>\r\n                <li class="list-group-item" ng-class="{selected:isActive(\'repositories\')}">\r\n                    <a href ng-click="setTo(\'repositories\')">repos <span class="badge">{{reposAmount||0}}</span></a>\r\n                </li>\r\n                <li class="list-group-item" ng-class="{selected:isActive(\'issues\')}">\r\n                    <a href ng-click="setTo(\'issues\')">issues <span class="badge">{{issuesAmount||0}}</span></a>\r\n                </li>\r\n                <li class="list-group-item" ng-class="{selected:isActive(\'code\')}">\r\n                    <a href ng-click="setTo(\'code\')">code <span class="badge">{{codeAmount||0}}</span></a>\r\n                </li>\r\n            </ul>\r\n        </aside>\r\n        <ui-view></ui-view>\r\n    </div>\r\n</section>');
$templateCache.put('components/search/searchView.html','<section class="container">\r\n  <h1 class="text-center">GitSearch</h1>\r\n  <div class="row">\r\n    <form class="form-inline col-xs-4 col-sm-4 col-sm-offset-5" novalidate  >\r\n      <div class="form-group">\r\n        <input type="search" ng-model=\'searchRequest\' class="form-control">\r\n     <button type="button" class="btn btn-primary fa fa-search" ng-click=\'makeSearch()\'></button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n  </section>\r\n  <ui-view></ui-view>');
$templateCache.put('components/user/userView.html','<section class="container">\r\n    <div ng-hide="repo">\r\n        <div class="row">\r\n            <button type="button" ng-disabled="isLeftButtonDisabled()" \r\n            class="col col-xs-2 col-sm-2 btn btn-primary btn-lg" ng-click="goToPrevUser()">prev</button>\r\n\r\n            <button type="button" ng-click="goToSearchResults()" \r\n            class="btn btn-primary col col-xs-2 col-sm-2 col-xs-offset-3">back to search results</button>\r\n\r\n            <button type="button" ng-disabled="isRightButtonDisabled()" \r\n            class="col col-xs-2 col-sm-2 col-xs-offset-3 btn btn-primary btn-lg"\r\n                ng-click="goToNextUser()">next</button>\r\n\r\n        </div>\r\n        <div class="row">\r\n            <h2 class="text-center">{{user.login}}</h2>\r\n        </div>\r\n        <div class="row">\r\n            <img class="col col-xs-5 col-sm-5" ng-src="{{user.avatar_url}}" />\r\n            <ul class="list-group col col-xs-7 col-sm-7">\r\n                <h2 class="text-center">repos</h2>\r\n                <loading-directive ng-hide="userRepos"></loading-directive>\r\n                <li class="list-group-item" ng-repeat="repo in userRepos">\r\n                    <h3>\r\n                        <a ui-sref="main.user({id:user.id,repo:repo.name,inf:repo})">{{repo.name}}</a>\r\n                    </h3>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n\r\n    <div ng-show="repo">\r\n        <div class="row">\r\n            \r\n            <button type="button" ng-click="goToUser()" \r\n            class="btn btn-primary col col-xs-2 col-sm-2 col-xs-offset-5">back to user</button>\r\n\r\n        </div>\r\n        <div class="row">\r\n            <h2 class="text-center">{{repo.name}}</h2>\r\n            <p class="text-center">size:\r\n                <span class="badge">{{repo.size}} kb</span>\r\n                <br> created at : {{repo.created_at}}\r\n                <br> forks:\r\n                <span class="badge">{{repo.forks}}kb</span>\r\n            </p>\r\n        </div>\r\n\r\n    </div>\r\n</section>');}]);