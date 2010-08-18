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
  
  // Simple way to display errors on screen instead of logging
  // to the console or alerting (default).
  //
  // See Cashboard.callback_failure as a template for overriding.
  display_error: function(code, message) {
    DEMO.display("Cashboard API Error " + code + ": " + message);
  },
  
  // Fetches account properties from API, then displays.
  get_account: function() {
    this.authenticate();
    CASHBOARD.account.list({
      onFailure: DEMO.display_error,
      // Will be passed a typecasted CASHBOARD.Account object.
      onSuccess: function(cb_account) {
        console.log(cb_account);
      }
    });
  },
    
  get_estimates: function() {
    this.authenticate();
    CASHBOARD.estimates.list({
      onFailure: DEMO.display_error,
      // Will be passed an array of typecasted CASHBOARD.Estimate objects.
      onSuccess: function(cb_estimates) {
        console.log(cb_estimates);
      }
    });
  },
  
  get_projects: function() {
    this.authenticate();
    CASHBOARD.projects.list({
      onFailure: DEMO.display_error
    });
  },
  
  get_tasks: function() {
    this.authenticate();
    CASHBOARD.tasks.list({
      onFailure: DEMO.display_error
    });
  },
  
  get_invoices: function() {
    this.authenticate();
    CASHBOARD.invoices.list({
      onFailure: DEMO.display_error
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