// globals
let MJ;
let GeocoderJS;
var openStreetMapGeocoder = GeocoderJS.createGeocoder('openstreetmap');
let currentLocation;

namespace app.Controllers {

  // login
  export class LoginController {
    public user;

    public login() {
      this.userService.login(this.user).then((res) => {
        if(res.message === 'Correct') {
          window.localStorage['token'] = res.jwt;
          this.$state.go('Locator');
        } else {
          alert(res.message);
        }
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService) {
        let token = window.localStorage['token'];
    		if(token) {
    			let payload = JSON.parse(window.atob(token.split('.')[1]));
          if (payload.exp > Date.now() / 1000) {
            this.$state.go("Locator");
          }
    		}
      }
  }

  // register
  export class RegisterController {
    public user;

    public register() {
      this.userService.register(this.user).then(() => {
        this.$state.go('Locator');
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService) {
    }
  }

  // locator
  export class LocatorController {
    public info;

    public post() {
      let formData = this.info;

      if(formData.current === true) {

        formData.location = {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        }

        console.log(formData);

      } else {
        openStreetMapGeocoder.geocode(this.info.address, function(result) {

          formData.location = {
            lat: result[0].latitude,
            lng: result[0].longitude
          }

          console.log(formData);

        })
      }

      // this.pokemonService.post(this.info).then(() => {
      //   console.log('Success');
      // })
    }

    constructor(
      private pokemonService: app.Services.PokemonService
    ) {
      navigator.geolocation.getCurrentPosition(showPosition);

      function showPosition(position) {
        currentLocation = position;

        let map1 = new MJ.map('mapDiv', {
          centerMap: [position.coords.latitude, position.coords.longitude],
          zoom: 16,
          accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2FmNmM5YzUxM2E3MDM2MDAyNzcxNzkiLCJpc3MiOiJtYXBqYW0uY29tIn0.2COM3S6NWaWy7i5RBA9Os6_TzuZPLR87180lLMeyJMA ',
          markers:[]
        });
      }
    }

  }

  // register controllers with the main app module
  angular.module('app').controller('HomeController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('LocatorController', LocatorController);
}
