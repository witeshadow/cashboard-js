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
  _url: null,
  init: function(url) {
    this._url = url;
  },
  list: function(callbacks) {
    CASHBOARD.get(this._url, callbacks);
  },
  create: function(data, callbacks) {
    CASHBOARD.post(this._url, data, callbacks);
  }
});


// Represents a single Cashboard data object.
// Wraps data from the server with useful methods to interact with it.
var CashboardObject = Class.extend({
  _data: {},
  // Initialize new CashboardObject with JSON.
  // Most likely this comes from a CashboardResource object's list method.
  init: function(data) {
    this._data = data;
  },
  // The unique URL of this object on the server
  url: function() {
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
  get_connection: function(http_method, url, callbacks) {
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
          callbacks["onSuccess"](JSON.parse(c.responseText));
        } else {
          callbacks["onFailure"](c.status, c.statusText);
        }
      }
    };
    
    return c;
  },
    
  get: function(url, callbacks) {
    var conn = CASHBOARD.get_connection("GET", url, callbacks);
    conn.send();
  },
  put: function(url, data, callbacks) {
    var conn = CASHBOARD.get_connection("PUT", url, callbacks);
    conn.send(JSON.stringify(data));
  },
  post: function(url, data, callbacks) {
    var conn = CASHBOARD.get_connection("POST", url, callbacks);
    conn.send(JSON.stringify(data));
  },
  destroy: function(url, callbacks) { 
    var conn = CASHBOARD.get_connection("DELETE", url, callbacks);
    conn.send();
  },
  
  
  // Resource definitions------------------------------------------------------
  
  account:             new CashboardResource('/account'),
  client_contacts:     new CashboardResource('/client_contacts'),
  client_companies:    new CashboardResource('/client_companies'),
  company_memberships: new CashboardResource('/company_memberships'),
  document_templates:  new CashboardResource('/document_templates'),
  employees:           new CashboardResource('/employees'),
  estimates:           new CashboardResource('/estimates'),
  expenses:            new CashboardResource('/expenses'),
  invoice_line_items:  new CashboardResource('/invoice_line_items'),
  invoice_payments:    new CashboardResource('/invoice_payments'),
  invoices:            new CashboardResource('/invoices'),
  line_items:          new CashboardResource('/line_items'),
  payments:            new CashboardResource('/payments'),
  project_assignments: new CashboardResource('/project_assignments'),
  projects:            new CashboardResource('/projects'),
  time_entries:        new CashboardResource('/time_entries'),
  
  
  // Data objects -------------------------------------------------------------
  
  Account:           CashboardObject.extend({
    // Override url method. This is the only 'singular' resource.
    url: '/account',
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