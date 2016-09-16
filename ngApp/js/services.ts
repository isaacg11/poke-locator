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
    public TrainerResource;
    public TeamResource;
    public PokemonResource;

    constructor(
      private $resource: ng.resource.IResourceService
    ){
      this.TrainerResource = $resource('/api/pokemon/trainer/:username');
      this.TeamResource = $resource('/api/pokemon/team/:type');
      this.PokemonResource = $resource('/api/pokemon');
    }

    public post(pokemon) {
      return this.PokemonResource.save(pokemon).$promise;
    }

    public getTrainerPokemon(username) {
      return this.TrainerResource.query({username: username});
    }

    public getTeamPokemon(team) {
      return this.TeamResource.query({type: team});
    }
  }

  // register services with main app module
  angular.module('app').service('userService', UserService);
  angular.module('app').service('pokemonService', PokemonService);
}
