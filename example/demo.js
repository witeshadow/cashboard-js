var DEMO = {
  cb_conn: null, // Cashboard connection
  auth_cookie_name: 'demo-credentials',
  cached_items: {},
    
  // STUFF THAT INTERACTS WITH THE API ----------------------------------------

  // Fetches account properties from API, then displays.
  get_account: function() {
    this.authenticate();
    CASHBOARD.account.list({
      onLoading: DEMO.show_loading, 
      onFailure: DEMO.display_error,
      // Will be passed a typecasted CASHBOARD.Account object.
      onSuccess: function(cb_account) {
        DEMO.display_cb_collection('Account', [cb_account]);
      }
    });
  },
    
  get_estimates: function() {
    this.authenticate();
    CASHBOARD.estimates.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Estimate objects.
      onSuccess: function(cb_estimates) {
        DEMO.display_cb_collection('Estimate', cb_estimates);
      }
    });
  },
  
  get_projects: function(options) {
    options = options || {};
    // Allow listing only active projects
    if (options['active'] && options['active'] === true) {
      list_function = 'active';
    } else {
      list_function = 'list';
    }
    this.authenticate();
    CASHBOARD.projects[list_function]({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Project objects.
      onSuccess: function(cb_projects) {
        DEMO.display_cb_collection('Project', cb_projects);
      }
    });
  },
  
  get_line_items: function(options) {
    options = options || {};
    // allow passing in the type of item to list
    if (options['type'] && options['type'] === 'task') {
      type = 'Task Line Item';
      list_function = 'tasks';
    } else if (options['type'] && options['type'] === 'product') {
      type = 'Product Line Item';
      list_function = 'products';
    } else {
      type = 'Line Item';
      list_function = 'list';
    }
    this.authenticate();
    CASHBOARD.line_items[list_function]({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.LineItem objects.
      onSuccess: function(cb_line_items) {
        DEMO.display_cb_collection(type, cb_line_items);
      }
    });
  },
  
  get_invoices: function() {
    this.authenticate();
    CASHBOARD.invoices.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Invoice objects.
      onSuccess: function(cb_invoices) {
        DEMO.display_cb_collection('Invoice', cb_invoices);
      }
    });
  },
  
  get_payments: function() {
    this.authenticate();
    CASHBOARD.payments.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Payment objects.
      onSuccess: function(cb_payments) {
        DEMO.display_cb_collection('Payment', cb_payments);
      }
    });
  },

  // UTILITY METHODS ----------------------------------------------------------

  // Grabs authentication credentials from HTML form and creates
  // new Cashboard API connection.
  //
  // Allows us to change credentials in the HTML page multiple times
  // for testing purposes.
  authenticate: function() {
    var subdomain = document.getElementById('subdomain').value;
    var api_key = document.getElementById('api_key').value;
    // Store credentials for page load refreshes.
    COOKIES.set(
      DEMO.auth_cookie_name, 
      JSON.stringify({
        subdomain: subdomain,
        api_key: api_key
      }),
      COOKIES.getExpDate(90,0,0)
    );
    CASHBOARD.authenticate(subdomain, api_key);
  },
  
  // Shortcut to grab display reference
  display: function(content, skip_hide_loading) {
    if (skip_hide_loading != true) {
      DEMO.hide_loading();
    }
    var area = document.getElementById('display_area');
    area.innerHTML = content;
  },
  
  // Simple way to display errors on screen instead of logging
  // to the console or alerting (default).
  //
  // See Cashboard.callback_failure as a template for overriding.
  display_error: function(code, message) {
    DEMO.display("Cashboard API Error " + code + ": " + message);
  },
  
  // Displays a collection of Cashboard objects on the page.
  display_cb_collection: function(item_type, objs) {
    // Cache items for lookup later (when deleting / updating)
    DEMO.cached_items[item_type] = objs;
    
    console.log(item_type + "...");
    console.log(objs);
    var html = "<h1>"+objs.length+" "+item_type+"(s)</h1>";
    for (var i=0; i<objs.length; i++) {
      html += DEMO.get_html_for_cb_object(item_type, objs[i]);
    }
    DEMO.display(html);
  },


  destroy: function(obj_type, obj_id) {
    var obj = null;
    var collection = DEMO.cached_items[obj_type];
    if (collection == null || collection.size == 0) {
      throw "No items in collection for " + obj_type;
    }
    // Find item in cached collection that was populated when displaying.
    for (var i=0; i<collection.length; i++) {
      if (obj_id === collection[i].id) {
        obj = collection[i];
        break;;
      }
    }
    if (obj == null) {
      throw "Object not found in cached list";
    }
    console.log(obj);
    if (confirm("Do you really want to delete this item?")) {
      obj.destroy({
        onLoading: DEMO.show_loading,
        onFailure: DEMO.display_error,
        onSuccess: function(response_thing) {
          DEMO.display(obj_type + " #" + obj_id + " was deleted successfully.");
        }
      })
    }
  },


  // Quick and dirty way to display a Cashboard obj in the HTML.
  // You should probably be using the DOM to make stuff, but I'm
  // going for speed of writing here.  
  get_html_for_cb_object: function(obj_type, cb_obj) {
    
    var html = "<h2>"+ obj_type +" "+ (cb_obj['id'] || '');
    html += "<a href='#' onclick='DEMO.destroy(\""+ obj_type +"\", "+ cb_obj.id +");return false;'>Delete</a>";
    html += "</h2>";
    html += "<table class='properties'>";
    for(prop in cb_obj._data) {
      html += "<tr><th>"+prop+"</th><td>";
      html += cb_obj._data[prop];
      html += "</td></tr>";
    }
    html += "</table>";
    return html;    
  },
  
  // Simply shows a loading indicator graphic
  show_loading: function() {
    var loading = document.getElementById('loading_message');
    loading.style.display = 'block';
    var buttons = document.getElementById('buttons');
    buttons.style.display = 'none';
    DEMO.display('', true);
  },
  hide_loading: function() {
    var loading = document.getElementById('loading_message');
    loading.style.display = 'none';
    var buttons = document.getElementById('buttons');
    buttons.style.display = 'block';
  },
  
  // Run on page load
  init: function() {
    // Try to set auth credentials from cookie
    var auth_cookie = COOKIES.get(DEMO.auth_cookie_name);
    if (auth_cookie !== null) {
      var auth_vals = JSON.parse(auth_cookie);
      document.getElementById('subdomain').value = auth_vals['subdomain'];
      document.getElementById('api_key').value = auth_vals['api_key']
    }
  }
};

addEvent(window, 'load', DEMO.init);