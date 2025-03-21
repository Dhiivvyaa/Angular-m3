(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItems);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
        ctrl.found = [];

        ctrl.narrowDown = function () {
            if (ctrl.searchTerm) {
                MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                    .then(function (result) {
                        ctrl.found = result;
                    });
            }
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (response) {
                var foundItems = [];
                var menuItems = response.data;
                for (var key in menuItems) {
                    var menuItem = menuItems[key];
                    if (menuItem.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                        foundItems.push(menuItem);
                    }
                }
                return foundItems;
            });
        };
    }

    function foundItems() {
        return {
            restrict: 'E',
            template: `
                <ul>
                    <li ng-repeat="item in found">
                        <p><strong>{{item.name}}</strong>, {{item.short_name}}, {{item.description}}</p>
                        <button class="remove-btn" ng-click="onRemove({index: $index})">Don't want this one!</button>
                    </li>
                </ul>
            `,
            scope: {
                found: '<',
                onRemove: '&'
            }
        };
    }

})();
