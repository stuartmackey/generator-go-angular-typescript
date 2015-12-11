(function() {
  'use strict';

  angular.module('app')
  .config(function($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider, $httpProvider:any) {
    $stateProvider
    .state('home', {
      url:'',
      templateUrl:'app/controllers/home.html',
      controller:'HomeCtrl',
      controllerAs:'vm',
      resolve: {
        $title: function() { return 'Home'; }
      }
    });
  });
})();