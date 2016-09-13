// globals
let MJ;
let GeocoderJS;
var openStreetMapGeocoder = GeocoderJS.createGeocoder('openstreetmap');
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

    public postData() {

      let coords = this.pokemonService.geocode(this.info.address);
      console.log(coords);

      let formData = this.info;
      formData.trainer = payload.username;

        // openStreetMapGeocoder.geocode(this.info.address, function(result) {
        //
        //   formData.location = {
        //     lat: result[0].latitude,
        //     lng: result[0].longitude
        //   }
        //
        //   this.pkmnSvc.post(formData).then(() => {
        //     console.log('Success');
        //   })
        // })
    }


    constructor(
      private pokemonService: app.Services.PokemonService
    ) {

      this.pokemon = this.pokemonService.getAll(payload.username);
      console.log(this.pokemon);
      let myPokemon = this.pokemon;

      navigator.geolocation.getCurrentPosition(showPosition);

      function showPosition(position) {

        let map1 = new MJ.map('mapDiv', {
          centerMap: [position.coords.latitude, position.coords.longitude],
          zoom: 12,
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2FmNmM5YzUxM2E3MDM2MDAyNzcxNzkiLCJpc3MiOiJtYXBqYW0uY29tIn0.2COM3S6NWaWy7i5RBA9Os6_TzuZPLR87180lLMeyJMA ',
          markers:[]
        });

        for(let i = 0; i < myPokemon.length; i++) {
          console.log(myPokemon[i].location);

          let myMarker = new MJ.marker(map1, {
            latLng: [myPokemon[i].location.lat, myPokemon[i].location.lng],
            size: 'm'
          });
        }
      }
    }
  }

  // register controllers with the main app module
  angular.module('app').controller('HomeController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('ProfileController', ProfileController);
}
