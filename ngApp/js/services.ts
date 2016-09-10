namespace app.Services {
  //UserService
  export class UserService {
    public RegisterResource;
    public LoginResource;

    public register(user) {
      return this.RegisterResource.save(user).$promise;
    }

    public login(user) {
      return this.LoginResource.save(user).$promise;
    }

    constructor(
      private $resource: ng.resource.IResourceService){
        this.RegisterResource = $resource('/api/users/register');
        this.LoginResource = $resource('/api/users/login');
    }
  }

  // register services with main app module
  angular.module('app').service('userService', UserService);
}
