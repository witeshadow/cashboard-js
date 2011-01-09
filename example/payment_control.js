/**
 * A simple payment control to exercise saving payments
 */
var PAYMENT = {
  // Global to handle result of client fetch
  _clients: null,
  
  get_clients: function() {
    PAYMENT.clear_form();
    DEMO.authenticate();
    CASHBOARD.client_companies.list({
      onLoading: PAYMENT.show_loading,
      onFailure: PAYMENT.handle_error,
      // Will be passed an array of typecasted CASHBOARD.Project objects.
      onSuccess: function(cb_clients) {
        console.log(cb_clients);
        PAYMENT.hide_loading();
        PAYMENT._clients = cb_clients;
        
        var drop = document.getElementById("p_client_drop");
      	PAYMENT.clear_drop_down(drop);

      	if (PAYMENT._clients.length == 0) {
      		PAYMENT.display_status("No clients returned");
      	} else {
      	  for (var i=0; i<PAYMENT._clients.length; i++) { 
      	    client = PAYMENT._clients[i];
      		  // add new options...
      			option = document.createElement("option");
      			option.value = client.id;
      			option_name = client.name;
      			option.innerHTML = option_name;
      			drop.appendChild(option);
      		}
      	}
      	PAYMENT.enable_button();
      } 
    });
  },
  
  // Simply shows a loading indicator graphic for the time entry area
  show_loading: function() {
    var ld = document.getElementById('p_loading');
    ld.style.display = 'block';
  },
  hide_loading: function() {
    var ld = document.getElementById('p_loading');
    ld.style.display = 'none';
  },
  
  // Allows us to show messages on screen.
  handle_error: function(code, message) {
    var msg = "API ERROR #" + code + " - " + message;
    PAYMENT.display_status(msg);
  },
  
  display_status: function(message) {
    PAYMENT.hide_loading();
    var status = document.getElementById('p_message');
    status.innerHTML = message;
  },
  clear_status: function() {
    document.getElementById('p_message').innerHTML = "";    
  },
  
  enable_button: function() {
    var button = document.getElementById('p_button');
    button.className = "";
    button.disabled = false;
  },
    
  // Removes all current options from a SELECT tag.
  clear_drop_down: function(drop) {
    while (drop.firstChild) { drop.removeChild(drop.firstChild); }
  },
  
  clear_form: function() {
    // PAYMENT.clear_drop_down(
    //   document.getElementById("p_client_drop")
    // );
  	document.getElementById("p_amount").value = '';
  	document.getElementById("p_notes").value = '';
  	document.getElementById("p_id").value = '';
  },
  
  // Actually logs payment back to the API.
  save: function() {
    // Data for post
  	var client_drop = document.getElementById("p_client_drop");
  	var client_id = client_drop.options[client_drop.selectedIndex].value;
  	var amount = document.getElementById("p_amount").value;
  	var notes = document.getElementById("p_notes").value;
  	var assigned_id = document.getElementById("p_id").value;

    // Form a proper JSON hash to create entry.
    var data = {
      payment: {
    	  assigned_id: assigned_id,
    	  amount: amount,
    	  notes: notes,
    	  client_id: client_id,
    	  client_type: 'Company'
    	}
    }

    console.log(data);

  	CASHBOARD.payments.create(
  	  data,
  	  {
  	    onLoading: PAYMENT.show_loading,
  	    onFailure: PAYMENT.handle_error,
  	    onSuccess: function(payment) {
  	      PAYMENT.display_status("Entry saved successfully.");
          PAYMENT.clear_form();
  	      console.log(payment);
  	    }
  	  }
  	)
  },
  
  
};