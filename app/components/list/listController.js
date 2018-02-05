angular.module('githubSearch').controller('listController', ($scope, githubSearchFactory, dataFactory, $stateParams, $state) => {
    const SIZE_OF_PAGE = 30;
    let currentPage = $stateParams.page || 1,
        currentList = githubSearchFactory.getCurrentListName();

    $scope.currentListName = githubSearchFactory.getCurrentListName();

    $scope.itemsPerPage = SIZE_OF_PAGE;
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
    }


    $scope.propertyName = 'forks';
    $scope.reverse = true;

    $scope.sortBy = function (propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
});