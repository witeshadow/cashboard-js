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
  get_url: function() {
    if (this.links !== null) {
      return this.links.self;
    }
  },
  // Posts an update to the server
  update: function(data, callbacks) {
    CASHBOARD.put(this.get_url(), data, callbacks);
  },
  // Destroys this object on the server
  destroy: function(callbacks) {
    CASHBOARD.destroy(this.get_url(), callbacks);
  }
});


var CASHBOARD = {
  VERSION: 0.9,

  // Codes defined by Cashboard -----------------------------------------------

  LINE_ITEM_TYPE_CODES: {
    custom: 0,
    task: 1,
    product: 2
  },

  PROJECT_BILLING_CODES: {
    non_billable: 0,
    task_rate: 1,
    employee_rate: 2,
  },

  PROJECT_CLIENT_VIEW_TIME_CODES: {
    show_when_invoiced: 0,
    show_when_billable: 1,
    show_never: 2
  },

  // Our version of "class variables" -----------------------------------------

 // _api_url: 'https://api.cashboardapp.com',
<<<<<<< .merge_file_a07352
  _api_url: 'http://witeshadow.com/php_proxy_simple.php?url=https://api.cashboard.com',
=======
  _api_url: 'http://witeshadow.com/ba-simple-proxy.php?url=',
>>>>>>> .merge_file_a02180
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
    // Call CASHBOARD as 'this' is ambiguous from callback context
    CASHBOARD.notify(str);
  },

  // Standard way of reporting an error if no onFailure callback is defined.
  callback_failure: function(code, message) {
    var str = "Cashboard API Error " + code + ": " + message;
    // Call CASHBOARD as 'this' is ambiguous from callback context
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

  // Sets callbacks to perform when certain things happen with our request.
  set_callbacks: function(c, data_type, callbacks) {
    callbacks = callbacks || {};
    callbacks["onSuccess"] = callbacks["onSuccess"] || this.callback_success;
    callbacks["onFailure"] = callbacks["onFailure"] || this.callback_failure;

    // Run onLoading for UI updating inside HTML.
    if (typeof callbacks["onLoading"] !== 'undefined') {
      callbacks["onLoading"]();
    }

    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        if (c.status == 200 || c.status == 201) {
          // Try to parse JSON in response.
          // If no JSON, then simply return text.
          var parsed_json = null;
          var return_val = null;
          try {
            parsed_json = JSON.parse(c.responseText);
            return_val = parsed_json;
          } catch(err) {
            return_val = c.responseText;
          }

          // Cast returning objects as appropriate type if we have one
          if (parsed_json !== null && data_type !== null) {
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
  },

  // Opens an asynchronous connection to the Cashboard server,
  // after specifying proper JSON headers and callbacks.
  get_connection: function(http_method, url, callbacks, data_type) {
    // Even though browsers might cache the API login info
    // ensure we've got them set in memory before making any requests.
    if (this._subdomain == '' || this._api_key == '') {
      throw "Please call CASHBOARD.authenticate to set login credentials";
    }
    // Some URLs passed in already have the domain name...others do not.
    if (url.indexOf('https') == -1) {
      full_url = this._api_url + url;
    } else {
      full_url = url;
    }
    var c = new XMLHttpRequest();
    c.open(http_method, full_url, true, this._subdomain, this._api_key);
    this.set_headers(c);
    this.set_callbacks(c, data_type, callbacks);
    return c;
  },

  get: function(url, callbacks, data_type) {
    var conn = this.get_connection("GET", url, callbacks, data_type);
    conn.send();
  },
  put: function(url, data, callbacks, data_type) {
    var conn = this.get_connection("PUT", url, callbacks, data_type);
    conn.send(JSON.stringify(data));
  },
  post: function(url, data, callbacks, data_type) {
    var conn = this.get_connection("POST", url, callbacks, data_type);
    conn.send(JSON.stringify(data));
  },
  destroy: function(url, callbacks) {
    var conn = this.get_connection("DELETE", url, callbacks);
    conn.send();
  },


  // Resource definitions -----------------------------------------------------

  // Metaprogramming to define resources instead of repeating code a bunch
  // of times.
  //
  // Defines resource associations like CASHBOARD.invoices, etc.
  //
  // This method is called after definition of the namespace.
  // Resources are defined inside the method so that we can bind to runtime
  // instead of when the code is parsed.
  define_resources: function() {
    // Resource path, CashboardObject, CashboardResource [optional]
    var resources = [
      ['account', 'Account'],
      ['client_contacts', 'ClientContact'],
      ['client_companies', 'ClientCompany'],
      ['company_memberships', 'CompanyMembership'],
      ['document_templates', 'DocumentTemplate'],
      ['employees', 'Employee'],
      ['estimates', 'Estimate', CASHBOARD.EstimatesResource],
      ['expenses', 'Expense'],
      ['invoice_line_items', 'InvoiceLineItem'],
      ['invoice_payments', 'InvoicePayment'],
      ['invoices', 'Invoice'],
      ['line_items', 'LineItem', CASHBOARD.LineItemsResource],
      ['payments', 'Payment'],
      ['project_assignments', 'ProjectAssignment'],
      ['projects', 'Project', CASHBOARD.ProjectsResource],
      ['time_entries', 'TimeEntry']
    ];

    for (var i=0; i<resources.length; i++) {
      var r = resources[i];
      // Name / path of the resource
      var r_name = r[0];
      // CashboardObject or a descendant
      var r_obj = r[1];
      // CashboardResource or a descendant
      var r_resource = (r[2] || CashboardResource);
      this[r_name] = new r_resource('/'+r_name, this[r_obj]);
    }
  },

  // Resource overrides -------------------------------------------------------

  EstimatesResource: CashboardResource.extend({
    active: function(callbacks) {
      var url = this.active_url(true);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    closed: function(callbacks) {
      var url = this.active_url(false);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    // We can list active or closed estimates only by using this parameter
    // on the standard resource GET operation.
    active_url: function(show_active_bool) {
      var url = new String(this._url);
      url += "?show_active=" + show_active_bool;
      return url;
    }
  }),

  // Includes convenience methods for listing line item by type
  // by passing the type_code paramater to our list method.
  LineItemsResource: CashboardResource.extend({
    tasks: function(callbacks) {
      var url = this.typed_line_item_url(CASHBOARD.LINE_ITEM_TYPE_CODES.task);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    products: function(callbacks) {
      var url = this.typed_line_item_url(CASHBOARD.LINE_ITEM_TYPE_CODES.product);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    customs: function(callbacks) {
      var url = this.typed_line_item_url(CASHBOARD.LINE_ITEM_TYPE_CODES.custom);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    // Certain line item types are fetched by appending a
    // type_code param to the base 'line_items' url.
    typed_line_item_url: function(line_item_type) {
      var url = new String(this._url);
      url += "?type_code=" + line_item_type;
      return url;
    }
  }),

  ProjectsResource: CashboardResource.extend({
    active: function(callbacks) {
      var url = this.active_url(true);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    closed: function(callbacks) {
      var url = this.active_url(false);
      CASHBOARD.get(url, callbacks, this._data_type);
    },
    // We can list active or closed projects only by using this parameter
    // on the standard resource GET operation.
    active_url: function(show_active_bool) {
      var url = new String(this._url);
      url += "?show_active=" + show_active_bool;
      return url;
    }
  }),

  // Data objects & overrides -------------------------------------------------

  Account:           CashboardObject.extend({
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

  Invoice:           CashboardObject.extend({
    // Lists all invoice_line_items associated with an invoice
    line_items: function(callbacks) {
      CASHBOARD.get(
        this.links.line_items,
        callbacks,
        CASHBOARD.InvoiceLineItem
      );
    },
    // Imports uninvoiced time, expenses, and tasks.
    //
    // Options should look like this
    //     {
    //       projects: {
    //         id: some_project_id,
    //         id: some_other_project_id
    //       },
    //       start_date: "mm/dd/yyyy",
    //       end_date: "mm/dd/yyyy"
    //     }
    import_uninvoiced_items: function(options, callbacks) {
      CASHBOARD.put(
        this.links.import_uninvoiced_items,
        options,
        callbacks,
        CASHBOARD.InvoiceLineItem
      );
    },
  }),
  LineItem:          CashboardObject.extend(),
  Payment:           CashboardObject.extend(),
  ProjectAssignment: CashboardObject.extend(),

  Project:           CashboardObject.extend({
    // All employees assigned to this project
    assigned_employees: function(callbacks) {
      CASHBOARD.get(
        this.links.assigned_employees,
        callbacks,
        CASHBOARD.Employee
      );
    },
    // Tasks assigned to this project
    line_item_tasks: function(callbacks) {
      CASHBOARD.get(this.links.line_item_tasks, callbacks, CASHBOARD.LineItem);
    },
    // Toggle between active / closed
    toggle_status: function(callbacks) {
      CASHBOARD.put(this.links.toggle_status, null, callbacks, this._data_type);
    }
  }),

  // Toggling a timer will return the toggled timer and any other timer
  // that was stopped as a result of this toggle.
  TimeEntry:         CashboardObject.extend({
    // Toggle timer between running / stopped
    toggle_timer: function(callbacks) {
      CASHBOARD.put(this.links.toggle_timer, null, callbacks, this._data_type);
    }
  })
};

CASHBOARD.define_resources();
