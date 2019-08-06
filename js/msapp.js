// Controller
var app = angular.module("MaterialApp", []);

app.controller("MaterialCtrl", function($scope, $filter, $http) {

    $scope.init = function() {
        // load Bnum data from JSON file,
        var request = {
            method: "get",
            url: "data/MSApp.json",
            dataType: "json",
            contentType: "application/json"
        };

        $http(request)
            // Set initial variables
            .success(function(jsonData) {
                console.log("Success! All is good in server land.");
                // Success!
                var loadedjson = jsonData;
                // Bnum holds the filtered list of B#s
                $scope.Bnum = loadedjson.Bnums;
                // AllBnums holds complete list of all B#s in the model
                $scope.AllBnums = loadedjson.Bnums;
                // AllFilters holds all possible filters and values
                $scope.AllFilters = loadedjson.Filters;
                // Filters is used to manage the set filters
                $scope.Filters = [];
                // setFilters is used for the filter stage
                $scope.setFilters = [];
                $scope.AllFilters = $scope.capturefilters($scope.AllBnums);
            })
            .error(function(errorresponse) {
                // Server found but there was an error
                console.log("Error! The server was not happy." + errorresponse);
            });
    };

    $scope.capturefilters = function(Bnumlist) {
        // Build an array of all filtering values from the sent Bnum list
        // Loop through all the Bnums looking for each filter.
        // Collect the possible values for each filter
        // Add them to the Filters array.
        // Differentiate between Bnum properties of one or more values (arrays)
        // Make a deepcopy of the full array
        Filterlist = $scope.deepcopy($scope.AllFilters);
        for (var i = 0; i < Filterlist.length; i++) {
            // Reset filter values to none for the current filter.
            // We'll build it back up from the Bnum list sent.
            Filterlist[i].values = [];
            // Take the id from each Filter to find the values in the Bnum data
            var currentfilterid = Filterlist[i].id;
            // Loop across Bnums looking for the current filter
            // Add the value from the B# into the Filters.values array
            for (var j = 0; j < Bnumlist.length; j++) {
                //Check if the filter is an array (has multiple values)
                //if not, its easier
                if (!Array.isArray(Bnumlist[j][currentfilterid])) {
                    //Check to see if the value is already in the Filters values array.
                    var pos = Filterlist[i].values.map(function(e) {
                        return e.id;
                    }).indexOf(Bnumlist[j][currentfilterid]);
                    if (pos == -1) {
                        // If NOT already there, add to the filter array
                        Filterlist[i].values.push({
                            "id": Bnumlist[j][currentfilterid],
                            "applied": false,
                            "disabled": false,
                            "count": 1
                        });
                    } else {
                        // If there, just increment the count
                        Filterlist[i].values[pos].count++;
                    };
                    // If it is an array, we need to parse through the array for each value
                } else {
                    //Loop through the values in the Bnum property
                    for (var k = 0; k < Bnumlist[j][currentfilterid].length; k++) {
                        //Check to see if the value is already in the values array.
                        var pos = Filterlist[i].values.map(function(e) {
                            return e.id;
                        }).indexOf(Bnumlist[j][currentfilterid][k]);
                        if (pos == -1) {
                            // IF not already there, add it
                            Filterlist[i].values.push({
                                "id": Bnumlist[j][currentfilterid][k],
                                "applied": false,
                                "disabled": false,
                                "count": 1
                            });
                        } else {
                            // IF its already there, just increment the count
                            Filterlist[i].values[pos].count++;
                        };
                    };
                };
            };
        };
        return Filterlist;
    };

    // Update the B# list shown to the user
    $scope.updateTable = function() {
        // Create a temporary B# list of all B#s to filter down
        var TempBnums = $scope.AllBnums;

        for (var i = 0; i < $scope.setFilters.length; i++) {
            // Loop through the list of attribute/value pairs in the stage (setFilters array)
            // Filter TempBnums repeatedly for each pair
            var tempFilterId = $scope.setFilters[i].FilterId;
            var tempFilterValue = $scope.setFilters[i].FilterValue;
            // call the filter method
            var TempBnums = TempBnums.filter(trimBnumlist);
            function trimBnumlist(bnumtocheck) {
              // check to see if the filter values are an array (multiple)
              // if it is not an array (single value) return on check
              if (!Array.isArray(bnumtocheck[tempFilterId])) {
                // its not an array so check the single filter value
                return bnumtocheck[tempFilterId] == tempFilterValue;
              // it is an array so, loop through all the values
              } else {
                for (var j = 0; j  < bnumtocheck[tempFilterId].length; j++) {
                  if (bnumtocheck[tempFilterId][j] == tempFilterValue) {
                    return true; // kick out if the value is found
                  };
                };
                return false; // value was not found after looping the array
              };
            };
        };
        // Reset the Bnum list to the new filtered list of Bnums
        $scope.Bnum = TempBnums;
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
        var valueposition = $scope.AllFilters[position].values.map(function(e) {
            return e.id;
        }).indexOf(filterValue.id);
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
        for (var i = 0; i < $scope.setFilters.length; i++) {
            if (($scope.setFilters[i].FilterId == filterId) && ($scope.setFilters[i].FilterValue == filterValue)) {
                // Update the Filters value applied property to "false"
                // Find the setfilter in the Filters array
                var valueposition = $scope.AllFilters[position].values.map(function(e) {
                    return e.id;
                }).indexOf(filterValue);
                if (valueposition !== -1) {
                    $scope.AllFilters[position].values[valueposition].applied = false;
                };
                // Remove the filter from the setFilters array
                $scope.setFilters.splice(i, 1);
            };
        };
        $scope.updateTable();
        $scope.disablefiltervalues();
    };

    $scope.setSearchFilter = function(event) {
        // remove leading and trailing spaces
        var searchterm = event.target.previousElementSibling.value.trim();
        // check to see if the term is empty
        if (searchterm) {
            // search filtering is different as this is not an attribute of the Bnum object
            attrvaluepair = {
                "Position": "5",
                "FilterId": "$", // lets angular filter know to search across the whole object
                "FilterValue": searchterm // the value to search for
            };
            $scope.setFilters.push(attrvaluepair);
            $scope.updateTable();
            $scope.disablefiltervalues();
            event.target.previousElementSibling.value = ""; //clear the input form
        };
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
        for (var i = 0; i < $scope.AllFilters.length; i++) {
            // For each Filter in the full list, loop through list of possible values
            for (var j = 0; j < $scope.AllFilters[i].values.length; j++) {
                // Get the first id to look for
                let valuetofind = $scope.AllFilters[i].values[j].id;
                // Check to see if the value is in the list of values in the subset array;
                let posofvalueinsubset = $scope.Filters[i].values.map(function(e) {
                    return e.id;
                }).indexOf(valuetofind)
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

    // Accordian function used to collapse/expand filters
    // Old code - needs refactoring
    $scope.Accordion = function(header, filternumber) {
        $scope.AllFilters[filternumber].filteropen = !$scope.AllFilters[filternumber].filteropen;
        var clicked = header.target;
        var panel = "";
        if (clicked.tagName == 'P') {
            // set the target div if the <p> text was clicked (filter or Bnum text)
            panel = clicked.parentElement.nextElementSibling;
        } else {
            // set the target div if the <div> was clicked (Bnum)
            panel = clicked.nextElementSibling;
        };

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.style.opacity = null;
            panel.style.overflow = null;
            panel.previousElementSibling.style.background = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.opacity = 1;
            panel.style.overflow = "visible";
        };
    };


    // Accordian function used to collapse/expand Bnums
    $scope.AccordionBnums = function(header) {
        var clicked = header.target;
        var panel = "";
        if (clicked.tagName == "P") {
            // set the target div if the <p> text was clicked (filter or Bnum text)
            panel = clicked.parentElement.nextElementSibling;
        } else {
            // set the target div if the <div> was clicked (Bnum)
            panel = clicked.nextElementSibling;
        };
        if (panel.style.display === "flex") {
            panel.style.display = "none"
            panel.previousElementSibling.classList.remove("BR-MatSelApp__BnumHeader--Open");
            panel.previousElementSibling.classList.add("BR-MatSelApp__BnumHeader--Closed");
        } else {
            panel.style.display = "flex";
            panel.previousElementSibling.classList.remove("BR-MatSelApp__BnumHeader--Closed");
            panel.previousElementSibling.classList.add("BR-MatSelApp__BnumHeader--Open");
        };
    };

    // Collapse all filters
    $scope.collapseAll = function() {
        // get all filter divs
        var panel = document.getElementsByClassName("BR-MatSelApp__Filter__Accordion");
        // loop through and collapse them.
        for (var i = 0; i < panel.length; i++) {
            $scope.AllFilters[i].filteropen = false;
            if (panel[i].style.maxHeight) {
                panel[i].style.maxHeight = null;
                panel[i].style.opacity = null;
                panel[i].style.overflow = null;
            };
        };
    };

    // this needs refactoring
    $scope.reset = function() {
        $scope.collapseAll();
        $scope.init()
    }

    // Deep copy of complex objects. Needed to support several functions.
    $scope.deepcopy = function(o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? $scope.deepcopy(v) : v;
        }
        return output;
    };
    // Kick things off!
    $scope.init();

});