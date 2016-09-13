// globals
let MJ;
let L;
let currentLocation;
let token = window.localStorage['token'];
let payload;
if(token) {
  payload = JSON.parse(window.atob(token.split('.')[1]));
}

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
      this.userService.register(this.user).then(() => {
        this.$state.go('Profile');
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService) {
    }
  }

  // profile
  export class ProfileController {
    public info;
    public pokemon;

    public post() {
      let formData = this.info;
      formData.trainer = payload.username;

      if(formData.current === true) {
        formData.latitude = currentLocation.coords.latitude;
        formData.longitude = currentLocation.coords.longitude;
        this.pokemonService.post(formData).then((res) => {
          console.log(res);
        })
      } else {
        this.pokemonService.post(formData).then((res) => {
          console.log(res);
        })
      }
    }


    constructor(
      private pokemonService: app.Services.PokemonService
    ) {

      this.pokemon = this.pokemonService.getAll(payload.username);
      let myPokemon = this.pokemon;

      navigator.geolocation.getCurrentPosition(showPosition);

      function showPosition(position) {
        currentLocation = position;
        let map1 = new MJ.map('mapDiv', {
          centerMap: [position.coords.latitude, position.coords.longitude],
          zoom: 12,
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2FmNmM5YzUxM2E3MDM2MDAyNzcxNzkiLCJpc3MiOiJtYXBqYW0uY29tIn0.2COM3S6NWaWy7i5RBA9Os6_TzuZPLR87180lLMeyJMA ',
          markers:[]
        });

        for(let i = 0; i < myPokemon.length; i++) {

          var myIcon = L.icon({
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
