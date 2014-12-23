"use strict";angular.module("negawattClientApp",["angularMoment","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","leaflet-directive","config","LocalStorageModule","ui.router","googlechart","angular-md5"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){b.otherwise("/dashboard"),a.state("login",{url:"/",templateUrl:"views/login.html"}).state("dashboard",{"abstract":!0,templateUrl:"views/dashboard/main.html",resolve:{meters:["Meter",function(a){return a.get()}],messages:["Message",function(a){return a.get()}],mapConfig:["Map",function(a){return a.getConfig()}],categories:["Category",function(a){return a.get()}],profile:["Profile",function(a){return a.get()}],usage:["ChartUsage",function(a){return a.get()}]},controller:"DashboardCtrl"}).state("dashboard.controls",{url:"/dashboard",views:{map:{templateUrl:"views/dashboard/main.map.html"},menu:{templateUrl:"views/dashboard/main.menu.html"},categories:{templateUrl:"views/dashboard/main.categories.html"},messages:{templateUrl:"views/dashboard/main.messages.html"},details:{templateUrl:"views/dashboard/main.details.html"},usage:{templateUrl:"views/dashboard/main.usage.html",controller:"DashboardCtrl"}}}).state("dashboard.controls.categories",{url:"/category/:categoryId",views:{"map@dashboard":{templateUrl:"views/dashboard/main.map.html",resolve:{meters:["Meter","$stateParams",function(a,b){return a.get(b.categoryId)}]},controller:"DashboardCtrl"}}}).state("dashboard.controls.markers",{url:"/marker/:markerId",views:{"usage@dashboard":{templateUrl:"views/dashboard/main.usage.html",resolve:{usage:["ChartUsage","$stateParams",function(a,b){return a.get("meter",b.markerId)}]}},"details@dashboard":{templateUrl:"views/dashboard/main.details.html",controller:"DashboardCtrl"}}}),c.interceptors.push(["$q","Auth","$location","localStorageService",function(a,b,c,d){return{request:function(a){return a.url.match(/login-token/)||(a.headers={access_token:d.get("access_token")}),a},response:function(a){return a.data.access_token&&d.set("access_token",a.data.access_token),a},responseError:function(c){return 401===c.status&&b.authFailed(),a.reject(c)}}}])}]),angular.module("negawattClientApp").controller("AccessCtrl",["$scope","Auth","$state",function(a,b,c){a.loginButtonEnabled=!0,a.loginFailed=!1,a.login=function(d){a.loginButtonEnabled=!1,b.login(d).then(function(){c.go("dashboard.controls")},function(){c.go("login"),a.loginButtonEnabled=!0,a.loginFailed=!0})},a.logout=function(){b.logout(),c.go("login")}}]),angular.module("negawattClientApp").controller("DashboardCtrl",["$scope","$state","$stateParams","ChartUsage","Meter","Map","meters","messages","mapConfig","categories","profile","usage",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(b){a.meters[b].select(),a.meterSelected=a.meters[b]}f.setCenter(k.account.center),a.defaults=i,a.meters=g,a.center=f.getCenter(),a.messages=h,a.categories=j,a.profile=k,a.usageChart=l,c.markerId&&m(c.markerId),a.$on("leafletDirectiveMarker.click",function(a,c){b.go("dashboard.controls.markers",{markerId:c.markerName})})}]),angular.module("negawattClientApp").service("Meter",["$q","$http","$timeout","$filter","$state","$rootScope","Config","Marker","Utils",function(a,b,c,d,e,f,g,h,i){function j(){var c=a.defer(),d=g.backend+"/api/iec_meters";return b({method:"GET",url:d,transformResponse:l}).success(function(a){k(a),c.resolve(n.data)}),c.promise}function k(a){n={data:a,timestamp:new Date},c(function(){n.data=void 0},6e4),f.$broadcast("negawattMetersChanged")}function l(a){var b={};return angular.isString(a)&&(a=angular.fromJson(a).data),angular.forEach(a,function(a){b[a.id]=a,a.location&&(b[a.id].lat=parseFloat(a.location.lat),b[a.id].lng=parseFloat(a.location.lng),delete a.location),angular.extend(b[a.id],h),b[a.id].unselect()}),b}function m(b,c){var e=a.defer();return b.then(function(a){a=i.indexById(d("filter")(i.toArray(a),{meter_categories:c},!0)),e.resolve(a)}),e.promise}var n={};this.get=function(b){var c=a.when(n.data||j());return angular.isDefined(b)&&(c=m(c,b)),c}}]),angular.module("negawattClientApp").service("Category",["$q","$http","$timeout","$rootScope","$filter","Config","Utils",function(a,b,c,d,e,f,g){function h(){var c=a.defer(),d=f.backend+"/api/meter_categories";return b({method:"GET",url:d,transformResponse:j}).success(function(a){i(a),c.resolve(n.data)}),c.promise}function i(a){n={data:a,timestamp:new Date},c(function(){n.data=void 0},6e4),d.$broadcast("negawatt.categories.changed")}function j(a){var b={},c=angular.fromJson(a).data;return b.collection=k(c),b.tree=l(c),b}function k(a){return g.indexById(a)}function l(a){{var b;e("filter")(a,{depth:0})}return a=m(a),b=e("filter")(a,{depth:0})}function m(a){var b=g.indexById(a),c=[];return angular.forEach(a,function(a){angular.forEach(a.children,function(c,d){a.children[d]=b[c]}),this.push(a)},c),a}var n={selected:{}};this.get=function(){return a.when(n.data||h())}}]),angular.module("negawattClientApp").service("ChartUsage",["$q","Electricity","moment",function(a,b,c){var d=this;this.get=function(c,e){var f=a.defer(),g=Math.floor(Date.now()/1e3)-63072e3,h={type:"month",timestamp:{value:g,operator:">"}};return c&&(h[c]=e),b.get(h).then(function(a){var b=d.transformDataToDatasets(a);f.resolve(b)}),f.promise},this.transformDataToDatasets=function(a){var b={};angular.forEach(a,function(a){a.timestamp in b||(b[a.timestamp]={}),a.rate_type in b[a.timestamp]||(b[a.timestamp][a.rate_type]=0),b[a.timestamp][a.rate_type]+=+a.kwh});var d=[{id:"month",label:"Month",type:"string",p:{}},{id:"flat",label:"Flat",type:"number",p:{}},{id:"peak",label:"Peak",type:"number",p:{}},{id:"mid",label:"Mid",type:"number",p:{}},{id:"low",label:"Low",type:"number",p:{}}],e=[];angular.forEach(b,function(a,b){var d=c.unix(b).format("MM-YYYY"),f=[{v:d},{v:a.flat},{v:a.peak},{v:a.mid},{v:a.low}];e.push({c:f})});var f={type:"ColumnChart",cssStyle:"height:210px; width:500px;",data:{cols:d,rows:e},options:{title:"Electricity Consumption",isStacked:"true",bar:{groupWidth:"75%"},fill:20,displayExactValues:!0,vAxis:{title:'קוט"ש',gridlines:{count:6}},hAxis:{title:"חודש"}},formatters:{},displayed:!0};return f}}]),angular.module("negawattClientApp").service("Electricity",["$q","$http","$timeout","$rootScope","Config","md5",function(a,b,c,d,e,f){function g(c,d){var f=a.defer(),g=e.backend+"/api/electricity",j={};return c&&(j={},angular.forEach(c,function(a,b){"object"==typeof a?angular.forEach(a,function(a,c){j["filter["+b+"]["+c+"]"]=a}):j["filter["+b+"]"]=a})),b({method:"GET",url:g,params:j}).success(function(a){h(a.electricity,d),f.resolve(i[d].data)}),f.promise}function h(a,b){i[b]={data:a,timestamp:new Date},c(function(){i[b].data=void 0},6e4),d.$broadcast("negawatt.electricity.changed")}var i={};this.get=function(b){var c=f.createHash(JSON.stringify(b));return a.when(i[c]&&i[c].data||g(b,c))}}]),angular.module("negawattClientApp").service("Auth",["$injector","Utils","localStorageService","Config",function(a,b,c,d){this.login=function(c){return a.get("$http")({method:"GET",url:d.backend+"/api/login-token",headers:{Authorization:"Basic "+b.Base64.encode(c.username+":"+c.password)}})},this.logout=function(){c.remove("access_token")},this.isAuthenticated=function(){return!!c.get("access_token")},this.authFailed=function(){a.get("$state").go("login"),this.logout()}}]),angular.module("negawattClientApp").service("Map",["leafletData",function(a){var b={};this.getConfig=function(){return{tileLayer:"https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png",zoomControlPosition:"bottomleft",minZoom:8,maxZoom:16}},this.setCenter=function(a){b.center=a},this.getCenter=function(){return b.center},this.centerMapByMarker=function(b){a.getMap().then(function(a){a.setView(b.getPosition())})}}]),angular.module("negawattClientApp").factory("Marker",["$state","Map",function(a,b){function c(a){return e[a]}var d,e={"default":{iconUrl:"../images/marker-blue.png",shadowUrl:"../images/shadow.png",iconSize:[40,40],shadowSize:[26,26],iconAnchor:[32,30],shadowAnchor:[25,7]},selected:{iconUrl:"../images/marker-red.png",shadowUrl:"../images/shadow.png",iconSize:[40,40],shadowSize:[26,26],iconAnchor:[32,30],shadowAnchor:[25,7]}};return{unselect:function(){this.icon=c("default")},select:function(){angular.isDefined(d)&&d.unselect(),d=this,this.icon=c("selected"),b.centerMapByMarker(this)},getPosition:function(){return{lat:this.lat,lng:this.lng}}}}]),angular.module("negawattClientApp").service("Message",["$q","$http","$rootScope","$state","$timeout","$sce","Config",function(a,b,c,d,e,f,g){function h(){var c=a.defer(),d=g.backend+"/api/anomalous_consumption";return b({method:"GET",url:d,transformResponse:i}).success(function(a){j(a),c.resolve(k.data)}),c.promise}function i(a){var b=angular.fromJson(a).data;return angular.forEach(b,function(a){a["long-text"]=a["long-text"].replace("%23","#"),a["long-text"]=a["long-text"].replace("90","50"),a.text=a.text.replace("%23","#"),a.text=a.text.replace("90","50")}),b}function j(a){k={data:a,timestamp:new Date},e(function(){k.data=void 0},6e4),c.$broadcast("negawatt.messages.changed")}var k={};this.get=function(){return a.when(k.data||h())}}]),angular.module("negawattClientApp").service("Profile",["$q","$http","$timeout","$state","$rootScope","Config",function(a,b,c,d,e,f){function g(){var b,c=a.defer();return b=a.all([h(),i()]),b.then(function(a){j(a),c.resolve(m.data)}),c.promise}function h(){var a=f.backend+"/api/me";return b({method:"GET",url:a,transformResponse:k})}function i(){var a=f.backend+"/api/accounts";return b({method:"GET",url:a,transformResponse:l})}function j(a){m={data:{user:a[0].data,account:a[1].data},timestamp:new Date},c(function(){m.data=void 0},6e4),e.$broadcast(n)}function k(a){return angular.fromJson(a).data}function l(a){var b=angular.fromJson(a).data[0];return b.center={lat:parseFloat(b.location.lat),lng:parseFloat(b.location.lng),zoom:parseInt(b.zoom)},delete b.location,delete b.zoom,b}var m={},n="nwProfileChanged";this.get=function(){return a.when(m.data||g())}}]),angular.module("negawattClientApp").service("Utils",function(){var a=this;this.Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(b){var c,d,e,f,g,h,i,j="",k=0;for(b=a.Base64._utf8_encode(b);k<b.length;)c=b.charCodeAt(k++),d=b.charCodeAt(k++),e=b.charCodeAt(k++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),j=j+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return j},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}},this.indexById=function(a){var b={};return angular.forEach(a,function(a){this[a.id]=a},b),b},this.toArray=function(a){var b=[];return angular.forEach(a,function(a){this.push(a)},b),b}});