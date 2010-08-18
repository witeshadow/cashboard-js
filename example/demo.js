var DEMO = {
  // Cashboard connection
  cb_conn: null,
  

  // Grabs authentication credentials from HTML form and creates
  // new Cashboard API connection.
  //
  // Allows us to change credentials in the HTML page multiple times
  // for testing purposes.
  authenticate: function() {
    var subdomain = document.getElementById('subdomain').value;
    var api_key = document.getElementById('api_key').value;
    CASHBOARD.authenticate(subdomain, api_key);
  },
  // Shortcut to grab display reference
  display: function(content) {
    var area = document.getElementById('display_area');
    area.innerHTML = content;
  },
  // Quick and dirty way to display a Cashboard obj in the HTML.
  // You should probably be using the DOM to make stuff, but I'm
  // going for speed here.
  display_cb_object: function(cb_obj) {
    var html = "";
    for(prop in cb_obj._data) {
      html = html + "<b>"+prop+"</b> - ";
      html = html + cb_obj._data[prop];
      html = html + "<br/>";
    }
    DEMO.display(html);
  },
  
  // Simply shows a loading indicator graphic
  show_loading: function() {
    var loading = document.getElementById('loading_message');
    loading.style.display = 'block';
    var buttons = document.getElementById('buttons');
    buttons.style.display = 'none';
  },
  hide_loading: function() {
    var loading = document.getElementById('loading_message');
    loading.style.display = 'none';
    var buttons = document.getElementById('buttons');
    buttons.style.display = 'block';
  },
  
  // Simple way to display errors on screen instead of logging
  // to the console or alerting (default).
  //
  // See Cashboard.callback_failure as a template for overriding.
  display_error: function(code, message) {
    DEMO.hide_loading();
    DEMO.display("Cashboard API Error " + code + ": " + message);
  },
  
  // Fetches account properties from API, then displays.
  get_account: function() {
    this.authenticate();
    CASHBOARD.account.list({
      onLoading: DEMO.show_loading, 
      onFailure: DEMO.display_error,
      // Will be passed a typecasted CASHBOARD.Account object.
      onSuccess: function(cb_account) {
        DEMO.hide_loading();
        console.log(cb_account);
        DEMO.display("Account retreived, please see the debugger console");
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
        console.log(cb_estimates);
        DEMO.display("Estimates retreived, please see the debugger console");
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
        console.log(cb_projects);
        DEMO.display("Projects retreived, please see the debugger console");
      }
    });
  },
  
  get_tasks: function() {
    this.authenticate();
    CASHBOARD.tasks.list({
      onLoading: DEMO.show_loading,
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.LineItem objects.
      onSuccess: function(cb_line_items) {
        DEMO.hide_loading();
        console.log(cb_line_items);
        DEMO.display("Tasks retreived, please see the debugger console");
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
        console.log(cb_invoices);
        DEMO.display("Invoices retreived, please see the debugger console");
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
  // }
};