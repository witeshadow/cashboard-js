// Namespaced cookie util functions. Jacked from a Danny Goodman example circa 2003.
var COOKIES = {
  getVal: function(offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1) {
      endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
  },
  // primary function to retrieve cookie by name
  get: function(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg) {
        return COOKIES.getVal(j);
      }
      i = document.cookie.indexOf(" ", i) + 1;
      if (i == 0) break; 
    }
    return null;
  },
  // store cookie value with optional details as needed
  set: function(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape (value) +
      ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  },
  // remove the cookie by setting ancient expiration date
  destroy: function(name,path,domain) {
    if (get(name)) {
      document.cookie = name + "=" +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
  },
  
  // utility function to retrieve a future expiration date in proper format;
  // pass three integer parameters for the number of days, hours,
  // and minutes from now you want the cookie to expire; all three
  // parameters required, so use zeros where appropriate
  getExpDate: function(days, hours, minutes) {
    var expDate = new Date();
    if (typeof days == "number" && typeof hours == "number" && typeof hours == "number") {
      expDate.setDate(expDate.getDate() + parseInt(days));
      expDate.setHours(expDate.getHours() + parseInt(hours));
      expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
      return expDate.toGMTString();
    }
  }
}