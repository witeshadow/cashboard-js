var DEMO = {
  cb_conn: null, // Cashboard connection
  auth_cookie_name: 'demo-credentials',
    
  // STUFF THAT INTERACTS WITH THE API ----------------------------------------

  // Fetches account properties from API, then displays.
  get_account: function() {
    this.authenticate();
    CASHBOARD.account.list({
      onLoading: DEMO.show_loading, 
      onFailure: DEMO.display_error,
      // Will be passed a typecasted CASHBOARD.Account object.
      onSuccess: function(cb_account) {
        DEMO.hide_loading();
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
        DEMO.hide_loading();
        DEMO.display_cb_collection('Estimate', cb_estimates);
      }
    });
  },
  
  get_projects: function() {
    this.authenticate();
    CASHBOARD.projects.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Project objects.
      onSuccess: function(cb_projects) {
        DEMO.hide_loading();
        DEMO.display_cb_collection('Project', cb_projects);
      }
    });
  },
  
  get_line_items: function() {
    this.authenticate();
    CASHBOARD.line_items.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.LineItem objects.
      onSuccess: function(cb_line_items) {
        DEMO.hide_loading();
        DEMO.display_cb_collection('Line Item', cb_line_items);
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
        DEMO.hide_loading();
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
        DEMO.hide_loading();
        DEMO.display_cb_collection('Payment', cb_payments);
      }
    });
  },
  
  // create_new_invoice: function() {
  //   CASHBOARD.invoices.create(
  //     {
  //       assigned_id: 'INV-00010',
  //       client_id: 12345,
  //       client_type: 'Company',
  //       due_date: "1/10/2012"
  //     },
  //     {
  //       onSuccess: displayStatusMessage,
  //       onFailure: displayStatusMessage
  //     }
  //   );
  // },
  // 
  // update_invoice: function() {
  //   my_invoice.update(
  //     {
  //       due_date: "1/15/2012"
  //     },
  //     {
  //       onSuccess: doSomething,
  //       onFailure: doSomethingElse
  //     }
  //   );    
  // },
  // 
  // destroy_invoice: function() {
  //   my_invoice.destroy();
  // },
  

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
  display: function(content) {
    var area = document.getElementById('display_area');
    area.innerHTML = content;
  },
  
  // Simple way to display errors on screen instead of logging
  // to the console or alerting (default).
  //
  // See Cashboard.callback_failure as a template for overriding.
  display_error: function(code, message) {
    DEMO.hide_loading();
    DEMO.display("Cashboard API Error " + code + ": " + message);
  },
  
  // Displays a collection of Cashboard objects on the page.
  display_cb_collection: function(item_type, objs) {
    console.log(item_type + "...");
    console.log(objs);
    var html = "<h1>"+objs.length+" "+item_type+"(s)</h1>";
    for (var i=0; i<objs.length; i++) {
      html += DEMO.get_html_for_cb_object(item_type, objs[i]);
    }
    DEMO.display(html);
  },

  // Quick and dirty way to display a Cashboard obj in the HTML.
  // You should probably be using the DOM to make stuff, but I'm
  // going for speed of writing here.  
  get_html_for_cb_object: function(obj_type, cb_obj) {
    
    var html = "<h2>"+ obj_type +" "+ (cb_obj['id'] || '') +"</h2>";
    html += "<table class='properties'>";
    for(prop in cb_obj._data) {
      html += "<tr><th>"+prop+"</th><td>";
      html += cb_obj._data[prop];
      html += "</td></tr>";
    }
    html += "</table>"
    return html;    
  },
  
  // Simply shows a loading indicator graphic
  show_loading: function() {
    var loading = document.getElementById('loading_message');
    loading.style.display = 'block';
    var buttons = document.getElementById('buttons');
    buttons.style.display = 'none';
    DEMO.display('');
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