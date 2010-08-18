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
 *    cb_conn = new Cashboard('my_subdomain', '12345');
 *    var employees = cb_conn.employees.list({
 *      onSuccess: referenceToSuccessFunction,
 *      onFailure: referenceToFailureFunction
 *    });
 */
var Cashboard = Class.extend({
  _api_url: 'https://api.cashboardapp.com',
  _mime_type: 'application/json',

  init: function(subdomain, api_key) {
    this._subdomain = subdomain;
    this._api_key = api_key;
    
    // Resource definitions
    this.account             = new CashboardResource(this, '/account');
    this.client_contacts     = new CashboardResource(this, '/client_contacts');
    this.client_companies    = new CashboardResource(this, '/client_companies');
    this.company_memberships = new CashboardResource(this, '/company_memberships');
    this.document_templates  = new CashboardResource(this, '/document_templates');
    this.employees           = new CashboardResource(this, '/employees');
    this.estimates           = new CashboardResource(this, '/estimates');
    this.expenses            = new CashboardResource(this, '/expenses');
    this.invoice_line_items  = new CashboardResource(this, '/invoice_line_items');
    this.invoice_payments    = new CashboardResource(this, '/invoice_payments');
    this.invoices            = new CashboardResource(this, '/invoices');
    this.line_items          = new CashboardResource(this, '/line_items');
    this.payments            = new CashboardResource(this, '/payments');
    this.project_assignments = new CashboardResource(this, '/project_assignments');
    this.projects            = new CashboardResource(this, '/projects');
    this.time_entries        = new CashboardResource(this, '/time_entries');
  },
  
  // Standard way of reporting success if no onSuccess callback is defined.
  callback_success: function(str) {
	  if (typeof console === 'object') {
      console.log(str);
    } else {
      alert(str);
    }
  },
  // Standard way of reporting an error if no onFailure callback is defined.
  callback_failure: function(code, message) {
    var str = "Cashboard API Error " + code + ": " + message;
	  if (typeof console === 'object') {
      console.log(str);
    } else {
      alert(str);
    }
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

  // Opens an asynchronous request to the Cashboard server,
  // after specifying proper JSON headers.
  get_connection: function(http_method, url, callbacks) {
    callbacks = callbacks || {};
    callbacks["onSuccess"] = callbacks["onSuccess"] || this.callback_success;
    callbacks["onFailure"] = callbacks["onFailure"] || this.callback_failure;
    
    var full_url = this._api_url + url;
    
    var c = new XMLHttpRequest(); // for brevity
    c.open(http_method, full_url, true, this._subdomain, this._api_key);
    this.set_headers(c);

    // Define callbacks
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
    var conn = this.get_connection("GET", url, callbacks);
    conn.send();
  },
  put: function(url, data, callbacks) {
    var conn = this.get_connection("PUT", url, callbacks);
    conn.send(JSON.stringify(data));
  },
  post: function(url, data, callbacks) {
    var conn = this.get_connection("POST", url, callbacks);
    conn.send(JSON.stringify(data));
  },
  destroy: function(url, callbacks) { 
    var conn = this.get_connection("DELETE", url, callbacks);
    conn.send();
  }
});