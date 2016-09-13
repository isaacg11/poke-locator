'use strict';
namespace app {
  angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap'])
    .config((
    $stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state('Login', {
      url: '/',
      templateUrl: '/templates/login.html',
      controller: app.Controllers.LoginController,
      controllerAs: 'vm'
    }).state('Register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: app.Controllers.RegisterController,
      controllerAs: 'vm'
    }).state('Profile', {
      url: '/profile',
      templateUrl: '/templates/profile.html',
      controller: app.Controllers.ProfileController,
      controllerAs: 'vm'
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });
}
