// globals
let MJ;
let L;
let map1;
let currentLocation;
let token = window.localStorage['token'];
let payload;

namespace app.Controllers {

  // login
  export class LoginController {
    public user;

    public login() {
      this.userService.login(this.user).then((res) => {
        if(res.message === 'Correct') {
          window.localStorage['token'] = res.jwt;
          this.$state.go('Profile');
        } else {
          alert(res.message);
        }
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService) {
    		if(token) {
          payload = JSON.parse(window.atob(token.split('.')[1]));
          if (payload.exp > Date.now() / 1000) {
            this.$state.go("Profile");
          }
    		}
      }
  }

  // register
  export class RegisterController {
    public user;

    public register() {
      if(this.user.instinct === true) {
        this.user.team = 'instinct';
        this.process(this.user);
      }
      else if(this.user.mystic ===true) {
        this.user.team = 'mystic';
        this.process(this.user);
      }
      else if(this.user.valor === true) {
        this.user.team = 'valor';
        this.process(this.user);
      }
    }

    public process(user) {
      this.userService.register(user).then((res) => {
        window.localStorage['token'] = res.jwt;
        this.$state.go('Profile');
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService) {
        if(token) {
          payload = JSON.parse(window.atob(token.split('.')[1]));
          if (payload.exp > Date.now() / 1000) {
            this.$state.go("Profile");
          }
    		}
      }
  }

  // profile
  export class ProfileController {
    public info;
    public pokemon;
    public payload;

    public post() {
      let formData = this.info;
      formData.trainer = this.payload.username;
      let myIcon = L.icon({
        iconUrl: 'images/pointer3.png'
      });

      if(formData.current === true) {
        formData.latitude = currentLocation.coords.latitude;
        formData.longitude = currentLocation.coords.longitude;
        this.pokemonService.post(formData).then((res) => {
          this.pokemon.length = this.pokemon.length + 1;
          addMarker(res);
        })
      } else {
        this.pokemonService.post(formData).then((res) => {
          this.pokemon.length = this.pokemon.length + 1;
          addMarker(res);
        })
      }
      function addMarker(info) {
        map1.panTo([info.location.lat, info.location.lng]);
        map1.setZoom(18);
        L.marker([info.location.lat, info.location.lng], {icon: myIcon}).addTo(map1);
      }
    }

    public logout() {
      localStorage.removeItem('token');
      this.$window.location = "/";
    };

    constructor(
      private pokemonService: app.Services.PokemonService,
      public $state: ng.ui.IStateService,
      public $stateParams: ng.ui.IStateParamsService,
      public $window
    ) {
      this.payload = JSON.parse(window.atob(token.split('.')[1]));
      this.pokemon = this.pokemonService.getAll(this.payload.username);
      let myPokemon = this.pokemon;

      navigator.geolocation.getCurrentPosition(showPosition);

      function showPosition(position) {
        currentLocation = position;
        map1 = new MJ.map('mapDiv', {
          centerMap: [position.coords.latitude, position.coords.longitude],
          zoom: 12,
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2FmNmM5YzUxM2E3MDM2MDAyNzcxNzkiLCJpc3MiOiJtYXBqYW0uY29tIn0.2COM3S6NWaWy7i5RBA9Os6_TzuZPLR87180lLMeyJMA ',
          markers:[]
        });

        for(let i = 0; i < myPokemon.length; i++) {
          let myIcon = L.icon({
            iconUrl: 'images/pointer3.png'
          });

          L.marker([myPokemon[i].location.lat, myPokemon[i].location.lng], {icon: myIcon}).addTo(map1);
        }
      }
    }
  }

  // register controllers with the main app module
  angular.module('app').controller('HomeController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('ProfileController', ProfileController);
}
