/**
 * Represents a resource on the Cashboard API.
 *
 * Gives us simple utility methods to list and create CashboardObjects of 
 * a certain type.
 */
var CashboardResource = Class.extend({
  _connection: null,
  _url: null,
  
  // Stores a reference ot the CashboardConnection that created it
  // and the proper URL to access this resource.
  init: function(connection, url) {
    this._connection = connection;
    this._url = url;
  },
  
  list: function(callbacks) {
    this._connection.get(this._url, callbacks);
  },
  
  create: function(data, callbacks) {
    this._connection.post(this._url, data, callbacks);
  }
});


/**
 * Represents a single Cashboard object.
 *
 * Allows us to wrap data from the server with useful methods
 * that update and destroy data.
 */
var CashboardObject = Class.extend({
  _connection: null,
  _data: {},
  
  // Initialize new CashboardObject with JSON.
  // Most likely this comes from a CashboardResource object's list method.
  init: function(connection, data) {
    this._connection = connection;
    this._data = data;
  },
  
  // The unique URL of this object on the server
  url: function() {
  },
  
  // Posts an update to the server
  update: function(data, callbacks) {
    this._connection.put(this.url, data, callbacks);
  },
  
  // Destroys this object on the server
  destroy: function(callbacks) {
    this._connection.destroy(this.url, data, callbacks);
  }
});