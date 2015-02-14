/**
 * A time entry control, similar to our first dashboard widgets.
 * This is a bit more complex example of doing something with the API.
 *
 * It first fetches active projects from the API, and tasks for the first
 * project returned - then renders a small control to screen.
 *
 * User can then enter time entry specifics, and save them to the server.
 */
var TIME_ENTRY = {
  _projects: null,
  _tasks: null,
  
  get_projects: function() {
    TIME_ENTRY.clear_form();
    DEMO.authenticate();
    CASHBOARD.projects.active({
      onLoading: TIME_ENTRY.show_loading,
      onFailure: TIME_ENTRY.handle_error,
      // Will be passed an array of typecasted CASHBOARD.Project objects.
      onSuccess: function(cb_projects) {
        TIME_ENTRY.hide_loading();
        TIME_ENTRY._projects = cb_projects;
        
        var drop = document.getElementById("te_projects_drop");
      	TIME_ENTRY.clear_drop_down(drop);

      	if (TIME_ENTRY._projects.length == 0) {
      		TIME_ENTRY.display_status("No projects returned");
      	} else {
      	  for (var i=0; i<TIME_ENTRY._projects.length; i++) { 
      	    project = TIME_ENTRY._projects[i];
      		  // add new options...
      			option = document.createElement("option");
      			option.value = project.id;
      			option_name = project.client_name + " - " + project.name;
      			option.innerHTML = option_name;
      			drop.appendChild(option);
      		}
      	}

      	// Now fill the task dropdown
      	TIME_ENTRY.get_tasks_for_project(TIME_ENTRY._projects[0]);
      } 
    });
  },
  
  get_tasks_for_project: function(project) {
    project.line_item_tasks({
      onLoading: TIME_ENTRY.show_loading,
      onFailure: TIME_ENTRY.handle_error,
      // Will be passed an array of typecasted CASHBOARD.LineItem objects.
      onSuccess: function(cb_line_items) {
        TIME_ENTRY.hide_loading();
        TIME_ENTRY._tasks = cb_line_items;
        
        var drop = document.getElementById("te_tasks_drop");
      	TIME_ENTRY.clear_drop_down(drop);

      	if (TIME_ENTRY._tasks.length == 0) {
      		TIME_ENTRY.display_status("No projects returned");
      	} else {
      	  for (var i=0; i<TIME_ENTRY._tasks.length; i++) { 
      	    task = TIME_ENTRY._tasks[i];
      		  // add new options...
      			option = document.createElement("option");
      			option.value = task.id;
      			option.innerHTML = task.title;
      			drop.appendChild(option);
      		}
      		TIME_ENTRY.enable_button();
      	}
      }
    });
  },
  // Event handler for changing the project drop-down.
  handle_project_drop_change: function() {
    TIME_ENTRY.clear_drop_down(
      document.getElementById("te_tasks_drop")
    );
    var drop = document.getElementById("te_projects_drop");
  	var selected_id = drop.options[drop.selectedIndex].value;
  	// find project from our internal store
    var project = null;
  	for (var i=0; i<this._projects.length; i++) {
  	  if (this._projects[i].id === parseInt(selected_id)) {
  	    project = this._projects[i];
  	    break;
  	  }
  	}
  	if (project == null) {
  	  throw "Project not found in global variable. Is the code working?";
  	} else {
  	  this.get_tasks_for_project(project);
	  }
  },
  
  // Simply shows a loading indicator graphic for the time entry area
  show_loading: function() {
    var ld = document.getElementById('te_loading');
    ld.style.display = 'block';
  },
  hide_loading: function() {
    var ld = document.getElementById('te_loading');
    ld.style.display = 'none';
  },
  
  // Allows us to show messages on screen.
  handle_error: function(code, message) {
    var msg = "API ERROR #" + code + " - " + message;
    TIME_ENTRY.display_status(msg);
  },
  
  display_status: function(message) {
    TIME_ENTRY.hide_loading();
    var status = document.getElementById('te_message');
    status.innerHTML = message;
  },
  clear_status: function() {
    document.getElementById('te_message').innerHTML = "";    
  },
  
  enable_button: function() {
    var button = document.getElementById('te_button');
    button.className = "";
    button.disabled = false;
  },
  disable_button: function() {
    var button = document.getElementById('te_button');
    button.className = "disabled";
    button.disabled = true;
  },
  
  // Removes all current options from a SELECT tag.
  clear_drop_down: function(drop) {
    while (drop.firstChild) { drop.removeChild(drop.firstChild); }
  },
  
  clear_form: function() {
    // Clear out both project and task drop
    TIME_ENTRY.clear_drop_down(
      document.getElementById("te_projects_drop")
    );
    TIME_ENTRY.clear_drop_down(
      document.getElementById("te_tasks_drop")
    );
  	document.getElementById("te_minutes").value = '';
  	document.getElementById("te_notes").value = '';    
  },
  
  // Actually logs time back to the API.
  log_time: function() {
    // Data for post
  	var task_drop = document.getElementById("te_tasks_drop");
  	var task_id = task_drop.options[task_drop.selectedIndex].value;
  	var minutes = document.getElementById("te_minutes").value;
  	var notes = document.getElementById("te_notes").value;

    // Form a proper JSON hash to create entry.
    var data = {
      time_entry: {
    	  line_item_id: task_id,
    	  minutes: minutes,
    	  description: notes
    	}
    }

  	CASHBOARD.time_entries.create(
  	  data,
  	  {
  	    onLoading: TIME_ENTRY.show_loading,
  	    onFailure: TIME_ENTRY.handle_error,
  	    onSuccess: function(time_entry) {
  	      TIME_ENTRY.display_status("Entry saved successfully.");
  	      document.getElementById("te_minutes").value = '';
        	document.getElementById("te_notes").value = '';
  	      console.log(time_entry);
  	    }
  	  }
  	)
  },
}