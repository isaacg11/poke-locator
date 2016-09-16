// globals
let MJ;
let L;
let toastr;
let map1;
let currentLocation;
let token = window.localStorage['token'];
let payload;

namespace app.Controllers {

  // navbar
  export class NavbarController {
    public loggedIn;

    public logout() {
      localStorage.removeItem('token');
      this.$window.location = "/";
    };

    constructor(
      public $window
    ) {
      if(token) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    }
  }

  // login
  export class LoginController {
    public user;

    public login() {
      this.userService.login(this.user).then((res) => {
        if(res.message === 'Correct') {
          window.localStorage['token'] = res.jwt;
          this.$window.location = "/profile";
        } else {
          toastr.error(res.message);
        }
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService,
      public $window
    ) {
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
      else if(this.user.mystic === true) {
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
        this.$window.location = "/profile";
      })
    }

    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService,
      public $window) {
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

    public add() {
      let formData = this.info;
      formData.teamTag = this.payload.team;
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
        toastr.info('Sighting recorded!');

        map1.panTo([info.location.lat, info.location.lng]);
        map1.setZoom(18);
        let marker = L.marker([info.location.lat, info.location.lng], {icon: myIcon}).addTo(map1);

        marker.bindPopup(
          '<p><b> Name</b>: ' + info.name + '<p>' +
          '<p><b> CP Level</b>: ' + info.level.toString() + '<p>' +
          '<p><b> Date</b>: ' + new Date(info.date) + '<p>' +
          '<p><b> Location</b>: ' + info.address + '<p>'
        ).openPopup();
      }
    }

    constructor(
      private pokemonService: app.Services.PokemonService,
      public $state: ng.ui.IStateService,
      public $stateParams: ng.ui.IStateParamsService,
      public $window
    ) {

      this.payload = JSON.parse(window.atob(token.split('.')[1]));
      this.pokemon = this.pokemonService.getTrainerPokemon(this.payload.username);
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

          let marker = L.marker([myPokemon[i].location.lat, myPokemon[i].location.lng], {icon: myIcon}).addTo(map1);

          marker.bindPopup(
            '<p><b> Name</b>: ' + myPokemon[i].name + '<p>' +
            '<p><b> CP Level</b>: ' + myPokemon[i].level.toString() + '<p>' +
            '<p><b> Date</b>: ' + new Date(myPokemon[i].date) + '<p>' +
            '<p><b> Location</b>: ' + myPokemon[i].address + '<p>'
          );
        }
      }
    }
  }

  // team feed
  export class FeedController {
    public pokemon;
    public team;

    public display(info) {
      let myIcon = L.icon({
        iconUrl: 'images/pointer3.png'
      });

      map1.panTo([info.location.lat, info.location.lng]);
      map1.setZoom(18);
      let marker = L.marker([info.location.lat, info.location.lng], {icon: myIcon}).addTo(map1);

      marker.bindPopup(
        '<p><b> Name</b>: ' + info.name + '<p>' +
        '<p><b> CP Level</b>: ' + info.level.toString() + '<p>' +
        '<p><b> Seen</b>: ' + info.date + '<p>' +
        '<p><b> Location</b>: ' + info.address + '<p>'
      ).openPopup();
    }

    constructor(
      public $state: ng.ui.IStateService,
      private pokemonService: app.Services.PokemonService
    ) {
        payload = JSON.parse(window.atob(token.split('.')[1]));
        this.team = payload.team;
        this.pokemon = this.pokemonService.getTeamPokemon(payload.team);
        let teamPokemon = this.pokemon;

        navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
          currentLocation = position;
          map1 = new MJ.map('mapDiv', {
            centerMap: [position.coords.latitude, position.coords.longitude],
            zoom: 10,
            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2FmNmM5YzUxM2E3MDM2MDAyNzcxNzkiLCJpc3MiOiJtYXBqYW0uY29tIn0.2COM3S6NWaWy7i5RBA9Os6_TzuZPLR87180lLMeyJMA ',
            markers:[]
          });

          for(let i = 0; i < teamPokemon.length; i++) {
            let myIcon = L.icon({
              iconUrl: 'images/pointer3.png'
            });

            let marker = L.marker([teamPokemon[i].location.lat, teamPokemon[i].location.lng], {icon: myIcon}).addTo(map1);
            marker.bindPopup(
              '<p><b> Name</b>: ' + teamPokemon[i].name + '<p>' +
              '<p><b> CP Level</b>: ' + teamPokemon[i].level.toString() + '<p>' +
              '<p><b> Date</b>: ' + new Date(teamPokemon[i].date) + '<p>' +
              '<p><b> Location</b>: ' + teamPokemon[i].address + '<p>'
            );
          }
        }
        if (payload.exp < Date.now() / 1000) {
          this.$state.go("Login");
        }
    }
  }

  // register controllers with the main app module
  angular.module('app').controller('HomeController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('ProfileController', ProfileController);
  angular.module('app').controller('FeedController', FeedController);
  angular.module('app').controller('NavbarController', NavbarController);
}
