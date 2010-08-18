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
    this.cb_conn = new Cashboard(subdomain, api_key);
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
  
  // Notice that we're using the global reference DEMO.cb_conn
  // to pass to the new CashboardObject.
  get_account: function() {
    this.authenticate();
    this.cb_conn.account.list({
      onFailure: DEMO.display_error,
      onSuccess: function(json_obj) {
        acct = new CashboardObject(DEMO.cb_conn, json_obj);
        console.log(acct);
      }
    });
  },
    
  get_estimates: function() {
    this.authenticate();
    this.cb_conn.estimates.list({
      onFailure: DEMO.display_error
    });
  },
  
  get_projects: function() {
    this.authenticate();
    this.cb_conn.projects.list({
      onFailure: DEMO.display_error
    });
  },
  
  get_tasks: function() {
    this.authenticate();
    this.cb_conn.tasks.list({
      onFailure: DEMO.display_error
    });
  },
  
  get_invoices: function() {
    this.authenticate();
    this.cb_conn.invoices.list({
      onFailure: DEMO.display_error
    });
  },
  
  // create_new_invoice: function() {
  //   this.cb_conn.invoices.create(
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