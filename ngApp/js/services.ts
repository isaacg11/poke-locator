namespace app.Services {

  // users
  export class UserService {
    public RegisterResource;
    public LoginResource;

    constructor(
      private $resource: ng.resource.IResourceService){
        this.RegisterResource = $resource('/api/users/register');
        this.LoginResource = $resource('/api/users/login');
    }

    public register(user) {
      return this.RegisterResource.save(user).$promise;
    }

    public login(user) {
      return this.LoginResource.save(user).$promise;
    }

  }

  // pokemon
  export class PokemonService {
    public PokemonResource;

    constructor(
      private $resource: ng.resource.IResourceService
    ){
      this.PokemonResource = $resource('/api/pokemon/:id');
    }

    public post(pokemon) {
      return this.PokemonResource.save(pokemon).$promise;
    }

    public getAll(username) {
      return this.PokemonResource.query({id: username});
    }

  }

  // register services with main app module
  angular.module('app').service('userService', UserService);
  angular.module('app').service('pokemonService', PokemonService);
}
