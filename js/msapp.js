// Controller
var app = angular.module('MaterialApp', []);

app.controller('MaterialCtrl', function($scope, $filter) {

  // load Bnum data from JSON file, set initial variables, handled json loading errors
  $scope.init= function () {
    request = new XMLHttpRequest();
    request.open('GET', '/data/MSApp.json', true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        console.log("Success! All is good in server land.");
        // Success!
        var loadedjson = JSON.parse(request.responseText);
        // Bnum holds the filtered list of B#s
        $scope.Bnum = loadedjson.Bnums;       
        // AllBnums variable holds complete list of all B#s in the model
        $scope.AllBnums = loadedjson.Bnums;
        // AllFilters holds all possible filters and values
        $scope.AllFilters = loadedjson.Filters;
        // Filters is used to manage the set filters
        $scope.Filters = [];
        // setFilters is used for the stage
        $scope.setFilters = [];
        $scope.AllFilters = $scope.capturefilters($scope.AllBnums);
        // Sort the B# list alphabetically by B# name
        $scope.sortBnums();

      } else {
        // Server found but there was an error
        console.log("Error! The server was not happy with us.");
      }
    };
    request.onerror = function() {
      // Did not reach the server. 
      console.log("Error! The server was not available.");
    };
    request.send();
  };


  $scope.capturefilters = function(Bnumlist) {
    // Build an array of all filtering values available in the sent Bnum list
    // Loop through all the Bnums looking for each filter. 
    // Collect the possible values for each filter and adds them to the Filters array. 
    // Differentiate between Bnum properties that have one or more values (arrays)

    // Make a deepcopy of the full array
    Filterlist = $scope.deepcopy($scope.AllFilters);
    // var TempList = Filterlist;  
    for (var i=0; i < Filterlist.length; i++) {
      // reset filter values to none for the current filter. We'll build it back up from the Bnum list sent.
      Filterlist[i].values = [];
      // take the id from each Filter to find the values in the Bnum data
      var currentfilterid = Filterlist[i].id;
      // loop across Bnums looking for the current filter and adding the value from the B# into the Filters.values array
      for (var j=0; j < Bnumlist.length; j++) {
        //check to see if the filter is an array (can have multiple values)
        //if not, its easier
        if (!Array.isArray(Bnumlist[j][currentfilterid])) {
          //look check to see if the value is already in the Filters values array. 
          var pos = Filterlist[i].values.map(function(e) { return e.id; }).indexOf(Bnumlist[j][currentfilterid]);
          if (pos == -1) { 
            // not already there so add to the filter array
            Filterlist[i].values.push(
            {
              "id": Bnumlist[j][currentfilterid],
              "applied": false,
              "disabled": false,
              "count": 1
            });
          } else {
            Filterlist[i].values[pos].count++;
          };  
        // if it is an array, we need to parse through the array for each value
        } else {
          //loop through the values in the Bnum property
          for (var k=0; k < Bnumlist[j][currentfilterid].length; k++) {
            //check to see if the value is already in the values array. 
            var pos = Filterlist[i].values.map(function(e) { return e.id; }).indexOf(Bnumlist[j][currentfilterid][k]);
            if (pos == -1) { 
            // not already there so add it        
              Filterlist[i].values.push({
                "id": Bnumlist[j][currentfilterid][k],
                "applied": false,
                "disabled": false,
                "count": 1
              });
              } else {
            Filterlist[i].values[pos].count++;
            };
          };
        };
      };
      // Sort filters so they are presented alphabetically
      Filterlist[i].values.sort(function(a, b){
        var numA=a.id.toLowerCase(), numB=b.id.toLowerCase()
        if (numA < numB) //sort string ascending
            return -1 
        if (numA > numB)
            return 1
        return 0 //default return value (no sorting)
      });
    };
    return Filterlist;
  };

  // Update the B# list shown to the user
  $scope.updateTable = function() {
    // create a temporary B# list of all B#s to filter down
    var TempBnums = $scope.AllBnums;
    // call the function to filter the temp full B# list by the setFilters list
    for(var i=0; i < $scope.setFilters.length; i++) {
      // loop through the list of attribute/value pairs filter TempBnums repeatedly for each pair
        var temp1 = $scope.setFilters[i].FilterId;
        var temp2 = $scope.setFilters[i].FilterValue;
        var TempBnums = $filter('filter')(TempBnums, { [temp1]: temp2 });
    };
    // reset the Bnum list to the new filtered list of Bnums
    $scope.Bnum = TempBnums;
    // reassess possible filter values and gray them out in the input controls
  };

  // Toggle checked filters on/off and remove from the set filters stage if needed
  $scope.toggleFilter = function(position, filterId, filterValue) {
    // take the inputs to create a attribute/value pair identifying the attribute and its set value
    attrvaluepair = {
      "Position": position,
      "FilterId": filterId.id,
      "FilterValue": filterValue.id
    };
    //Find the position of the filter value in the values array for the filter
    var valueposition = $scope.AllFilters[position].values.map(function(e) { return e.id; }).indexOf(filterValue.id);
    // Determine if the filter is checked or not and act accordingly
    // If it is checked, uncheck it and remove from the setFilters array
    if (filterValue.applied) {
      // Set the value of the 'applied' attribute to "false" so it will appear unchecked
      $scope.AllFilters[position].values[valueposition].applied = false;
      // Call the removeFilter function to remove the filter from the setFilters array/stage
      $scope.removeFilter(position, filterId.id, filterValue.id);
    // if not checked, then check it and add the setFilters array
    } else {
      // Add the attribute/value pair to the array of set filters 
      $scope.setFilters.push(attrvaluepair);
      // Set the value of the 'applied' attribute to "true" so it will appear checked
      $scope.AllFilters[position].values[valueposition].applied = true;
    };

    // Refilter the B# table using the updated setFilters array 
    $scope.updateTable();
    $scope.disablefiltervalues();
  };

  // Remove a filter from the setfilters stage
  $scope.removeFilter = function(position, filterId, filterValue) {
    // Loop through setFilters array looking for the filter valuepair
    for( var i = 0; i < $scope.setFilters.length; i++){ 
       if (($scope.setFilters[i].FilterId == filterId) && ($scope.setFilters[i].FilterValue == filterValue)) {
         // Update the Filters value applied property to "false"
         // - Find the setfilter in the Filters array
         var valueposition = $scope.AllFilters[position].values.map(function(e) { return e.id; }).indexOf(filterValue);
         $scope.AllFilters[position].values[valueposition].applied = false;
         // Remove the filter from the setFilters array
         $scope.setFilters.splice(i, 1); 
       };
    };
    $scope.updateTable();
    $scope.disablefiltervalues();
  };


  // Disable filter values that are no longer available for the filtered list of B#s
  $scope.disablefiltervalues = function() {
    // Capture a list of available filter values using the filtered (subset) Bnum List
    // We'll compare these to the full list of filter values to turn off values that aren't available
    // Clear out Filters array;
    var valuetofind = "";
    // Get all the filter values for the Bnum subset
    $scope.Filters = $scope.capturefilters($scope.Bnum);
    // Loop through the full list of filters
    for(var i=0; i < $scope.AllFilters.length; i++) {
      // For each Filter in the full list, loop through list of possible values
      for(var j=0; j < $scope.AllFilters[i].values.length; j++) {
        // Get the first id to look for
        let valuetofind = $scope.AllFilters[i].values[j].id;
        // Check to see if the value is in the list of values in the subset array;
        let posofvalueinsubset = $scope.Filters[i].values.map(function(e) { return e.id; }).indexOf(valuetofind)
        if (posofvalueinsubset == -1) {
          // Its not in the subset so disable the value and set count to 0
          $scope.AllFilters[i].values[j].disabled = true;
          $scope.AllFilters[i].values[j].count = 0;
          // It is in the subset so enable it and set the count value
        } else {
          $scope.AllFilters[i].values[j].count = $scope.Filters[i].values[posofvalueinsubset].count;
          if (($scope.Filters[i].values[posofvalueinsubset].count == $scope.Bnum.length) && !$scope.AllFilters[i].values[j].applied) {
            // the same value is found in all remainging B#s and the filter has not been selected
            $scope.AllFilters[i].values[j].disabled = true;
          } else {
          $scope.AllFilters[i].values[j].disabled = false;
          };
        };
      };    
    }; 
  };


$scope.Accordion = function(header) {
    var clicked = header.target;
    var panel = "";
    if (clicked.tagName == 'P') {
      // set the target div if the <p> text was clicked 
      var panel = clicked.parentElement.nextElementSibling;
    } else {
      // set the target div if the <div> was clicked
      panel = clicked.nextElementSibling;
    };
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
      panel.style.opacity = null;
      panel.style.overflow = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.opacity = 1;
      panel.style.overflow = "visible";
    }; 
  };


  // Sort the list of Bnums
  $scope.sortBnums = function() {
    // Sort the Bnum list by the num property so it is presented in alpha/numeric order
    $scope.Bnum.sort(function(a, b){
      var numA=a.num.toLowerCase(), numB=b.num.toLowerCase()
      if (numA < numB) //sort string ascending
          return -1 
      if (numA > numB)
          return 1
      return 0 //default return value (no sorting)
    });
  };


  // Deep copy of complex objects. Needed to support several function.
  $scope.deepcopy = function(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? $scope.deepcopy(v) : v;
    }
    return output;
  };

  $scope.init();

});










