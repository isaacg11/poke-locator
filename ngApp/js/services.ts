namespace app.Services {

  // users
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

  // pokemon
  export class PokemonService {
    public PokemonResource;

    public post(pokemon) {
      return this.PokemonResource.save(pokemon).$promise;
    }

    constructor(
      private $resource: ng.resource.IResourceService){
        this.PokemonResource = $resource('/api/users/pokemon');
    }
  }

  // register services with main app module
  angular.module('app').service('userService', UserService);
  angular.module('app').service('pokemonService', PokemonService);
}
