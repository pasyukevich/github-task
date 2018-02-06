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