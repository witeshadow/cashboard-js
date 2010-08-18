/**
 * Cashboard Javscript API wrapper library.
 * Copyright (c) 2010 Subimage LLC
 *
 * http://www.getcashboard.com
 * http://api.cashboardapp.com
 * http://github.com/subimage/cashboard-js
 *
 * This library attempts to provide a clean object oriented approach
 * for dealing with the Cashboard API.
 *
 * All methods that go across the wire (list, create, update, destroy)
 * expect to be passed "callback" functions onSuccess and onFailure.
 *
 * Callback functions will be returned either single or multiple
 * CashboardObjects inside an array.
 *
 * Simple Usage:
 *    CASHBOARD.authenticate('my_subdomain', '12345');
 *    var employees = CASHBOARD.employees.list({
 *      onSuccess: referenceToSuccessFunction,
 *      onFailure: referenceToFailureFunction
 *    });
 */

// Represents a resource on the Cashboard API.
// 
// Gives us simple utility methods to list and create CashboardObjects of 
// a certain type.
var CashboardResource = Class.extend({
  _url: null, // url to access resource
  _data_type: null, // what type of object to create from returned data
  init: function(url, data_type) {
    this._url = url;
    this._data_type = data_type;
  },
  list: function(callbacks) {
    CASHBOARD.get(this._url, callbacks, this._data_type);
  },
  create: function(data, callbacks) {
    CASHBOARD.post(this._url, data, callbacks, this._data_type);
  }
});


// Represents a single Cashboard data object.
// Wraps data from the server with useful methods to interact with it.
var CashboardObject = Class.extend({
  _data: null, // stores json
  
  // Initialize new CashboardObject from JSON object.
  init: function(json_obj) {
    this._data = json_obj;    
    for (var prop in json_obj) {
      this[prop] = json_obj[prop]; 
    }
  },
  // The unique URL of this object on the server
  url: function() {
    if (this.links !== null) {
      return this.links.self;
    }
  },
  // Posts an update to the server
  update: function(data, callbacks) {
    CASHBOARD.put(this.url, data, callbacks);
  },
  // Destroys this object on the server
  destroy: function(callbacks) {
    CASHBOARD.destroy(this.url, data, callbacks);
  }
});
 

var CASHBOARD = {
  VERSION: 0.7,
  _api_url: 'https://api.cashboardapp.com',
  _mime_type: 'application/json',
  // Used for authentication
  _subdomain: '',
  _api_key: '',

  // Should be called before any requests are made.
  authenticate: function(subdomain, api_key) {
    this._subdomain = subdomain;
    this._api_key = api_key;
  },
   
  notify: function(str) {
    if (typeof console === 'object') {
      console.log(str);
    } else {
      alert(str);
    }
  },
  
  // Standard way of reporting success if no onSuccess callback is defined.
  callback_success: function(str) {
	  CASHBOARD.notify(str);
  },
  
  // Standard way of reporting an error if no onFailure callback is defined.
  callback_failure: function(code, message) {
    var str = "Cashboard API Error " + code + ": " + message;
    CASHBOARD.notify(str);
	},

  // Sets the proper JSON headers.
  set_headers: function(connection) {
    var headers = {};
		headers["Content-Type"] = this._mime_type;
		headers["Accept"] = this._mime_type;
		for (var header in headers) {
			connection.setRequestHeader(header, headers[header]);
		}
  },

  // Opens an asynchronous connection to the Cashboard server,
  // after specifying proper JSON headers and callbacks.
  get_connection: function(http_method, url, callbacks, data_type) {
    // Even though browsers might cache the API login info
    // ensure we've got them set in memory before making any requests.
    if (CASHBOARD._subdomain == '' || CASHBOARD._api_key == '') {
      throw "Please call CASHBOARD.authenticate to set login credentials";
    }
    
    callbacks = callbacks || {};
    callbacks["onSuccess"] = callbacks["onSuccess"] || CASHBOARD.callback_success;
    callbacks["onFailure"] = callbacks["onFailure"] || CASHBOARD.callback_failure;
    
    var full_url = this._api_url + url;
    var c = new XMLHttpRequest();
    c.open(http_method, full_url, true, this._subdomain, CASHBOARD._api_key);
    CASHBOARD.set_headers(c);

    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        if (c.status == 200 || c.status == 201) {
          var parsed_json = JSON.parse(c.responseText);
          var return_val = parsed_json;
          
          // Cast returning objects as appropriate type if we have one
          if (data_type !== null) {
            if (parsed_json instanceof Array) {
              return_val = [];
              for (var i=0; i<parsed_json.length; i++) {
                return_val.push(new data_type(parsed_json[i]));
              }
            } else {
              return_val = new data_type(parsed_json);
            }
          }
          
          callbacks["onSuccess"](return_val);
        } else {
          callbacks["onFailure"](c.status, c.statusText);
        }
      }
    };
    
    return c;
  },
    
  get: function(url, callbacks, data_type) {
    var conn = CASHBOARD.get_connection("GET", url, callbacks, data_type);
    conn.send();
  },
  put: function(url, data, callbacks, data_type) {
    var conn = CASHBOARD.get_connection("PUT", url, callbacks, data_type);
    conn.send(JSON.stringify(data));
  },
  post: function(url, data, callbacks, data_type) {
    var conn = CASHBOARD.get_connection("POST", url, callbacks, data_type);
    conn.send(JSON.stringify(data));
  },
  destroy: function(url, callbacks) { 
    var conn = CASHBOARD.get_connection("DELETE", url, callbacks);
    conn.send();
  },
  
  
  // Resource definitions -----------------------------------------------------
  
  resources: [
    ['account', 'Account'],
    ['client_contacts', 'ClientContact'],
    ['client_companies', 'ClientCompany'],
    ['company_memberships', 'CompanyMembership'],
    ['document_templates', 'DocumentTemplate'],
    ['employees', 'Employee'],
    ['estimates', 'Estimate'],
    ['expenses', 'Expense'],
    ['invoice_line_items', 'InvoiceLineItem'],
    ['invoice_payments', 'InvoicePayment'],
    ['invoices', 'Invoice'],
    ['line_items', 'LineItem'],
    ['payments', 'Payment'],
    ['project_assignments', 'ProjectAssignment'],
    ['projects', 'Project'],
    ['time_entries', 'TimeEntry']
  ],
  // Metaprogramming to define resources instead of repeating code a bunch
  // of times.
  define_resources: function() {
    for (var i=0; i<CASHBOARD.resources.length; i++) {
      var r = CASHBOARD.resources[i];
      var r_name = r[0];
      var r_obj = r[1];
      CASHBOARD[r_name] = new CashboardResource('/'+r_name, CASHBOARD[r_obj]);
    }
  },
  
  
  // Data objects -------------------------------------------------------------  
  
  Account:           CashboardObject.extend({
    url: '/account', // This is the only 'singular' resource.
    destroy: function() { throw "You can't destroy an account via the API" }
  }),
  ClientContact:     CashboardObject.extend(),
  ClientCompany:     CashboardObject.extend(),
  CompanyMembership: CashboardObject.extend(),
  DocumentTemplate:  CashboardObject.extend(),
  Employee:          CashboardObject.extend(),
  Estimate:          CashboardObject.extend(),
  Expense:           CashboardObject.extend(),
  InvoiceLineItem:   CashboardObject.extend(),
  InvoicePayment:    CashboardObject.extend(),
  Invoice:           CashboardObject.extend(),
  LineItem:          CashboardObject.extend(),
  Payment:           CashboardObject.extend(),
  ProjectAssignment: CashboardObject.extend(),
  Project:           CashboardObject.extend(),
  TimeEntry:         CashboardObject.extend()
};

CASHBOARD.define_resources();