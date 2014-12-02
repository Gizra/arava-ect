'use strict';

angular.module('app')
  .service('Utils', function () {
    var Utils = this;

    /**
     * Convert a object properties to an array.
     *
     * @param {*} object
     *
     * @returns {Array} - collection of the object's properties into an array.
     */
    this.toArray = function(object) {
      var result = [];

      angular.forEach(object, function(property){
        this.push(property);
      }, result);

      return result;
    };

    /**
     * Convert a collection of objects to an object index by property id.
     *
     * @param collection {*[]}
     *  Colection of objects.
     * @returns {*}
     *  Object indexed with properties id of each item.
     */
    this.indexById = function(collection) {
      var indexed = {};
      angular.forEach(collection, function(item) {
        this[item.id] = item;
      }, indexed);

      return indexed;
    };

    /**
     * Return query string for restful module. (Drupal 7.0)
     *
     * @param {*} filters - object with filters, where the key is the name of the field to
     * filter the response, equal the value.
     *
     *  {
     *    key: value,
     *    ...
     *  }
     *
     * @returns {string} - in the format ?filter[key]=value[&filter[key]=value...]
     */
    this.createQueryString = function(filters) {
      var queryString;

      angular.forEach(filters, function(value, key) {
        queryString = ((angular.isUndefined(queryString)) ? '?' : queryString + '&') + 'filter[' + key + ']=' + value;
      }, queryString);

      return queryString || '';
    };

    /**
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     */
    this.Base64 = {

        // private property
        _keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        // public method for encoding
        encode : function (input) {
          var output = '';
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;

          input = Utils.Base64._utf8_encode(input);

          while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

          }

          return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
          string = string.replace(/\r\n/g,'\n');
          var utftext = '';

          for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
              utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }

          }

          return utftext;
        }
      };

  });
