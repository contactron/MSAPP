
// Model Section
var Bnums = [
  {
    "num": "B­-402",
    "description": "THERMAL TRANSFER PRINTABLE WHITE PAPER LABEL STOCK",
    "type": "SleeveRoll",
    "material": "Polyester",
    "finish": "Matte",
    "adhesive": "Acrylic",
    "thickness": ".0001 in",
    "longdescription": "B-402 is a thermal transfer printable metallized polyester label stock designed for applications, like rating and serial plates, that utilize barcodes, alphanumerics, graphic symbols and logos and require nameplate-like quality.",
    "specialproperties": ["Cold Resistant", "Heat Resistant", "Flame Retardent", "Removable"],
    "compliance": ["UL"],
    "applications": ["Electrical", "Lean", "Datacomm"],
    "color": ["white"],
    "tapecolorable": "yes",
    "chemresistance": [
      {
        "category": "Fuels",
        "rating": "Good"
      },
      {
        "category": "Oils",
        "rating": "Poor"
      },
      {
        "category": "Solvents",
        "rating": "Good"
      },
      {
        "category": "Cleaners",
        "rating": "Bad"
      }
    ],
    "adhesion": [
      {
        "category": "Steel",
        "rating": "Good"
      },
      {
        "category": "Powder Coated Metal",
        "rating": "Poor"
      },
      {
        "category": "Polypropylene",
        "rating": "Good"
      },      {
        "category": "Textured ABS",
        "rating": "Bad"
      }
    ]
  },
  {
    "num": "B­-459",
    "description": "THERMAL TRANSFER PRINTABLE MATTE WHITE POLYESTER LABEL STOCK",
    "type": "LabelRoll",    
    "material": "Vinyl",
    "finish": "Gloss",
    "adhesive": "Acrylic",
    "thickness": ".0006 in",
    "longdescription": "B-459 is another very great material from Brady Corporation. It has a number of unique properties, blah, blah, blah.",
    "specialproperties": ["Flame Retardent", "Heat Resistant", "Removable", "Cold Resistant"],
    "compliance": ["UL", "ROHS"],
    "applications": ["Electrical", "Lab", "Safety"],
    "color": ["green", "red", "brown"],
    "tapecolorable": "yes",
    "chemresistance": [
      {
        "category": "Fuels",
        "rating": "Good"
      },
      {
        "category": "Oils",
        "rating": "Poor"
      },
      {
        "category": "Solvents",
        "rating": "Good"
      },
      {
        "category": "Cleaners",
        "rating": "Bad"
      }
    ],
    "adhesion": [
      {
        "category": "Steel",
        "rating": "Good"
      },
      {
        "category": "Powder Coated Metal",
        "rating": "Poor"
      },
      {
        "category": "Polypropylene",
        "rating": "Good"
      },      {
        "category": "Textured ABS",
        "rating": "Bad"
      }
    ]
  },
  {
    "num": "B­-595",
    "description": "Another description for B-202",
    "type": "SleeveRoll",
    "material": "Polyester",
    "finish": "Gloss",
    "adhesive": "Acrylic",
    "thickness": ".0025 in",
    "longdescription": "B-202. Wow, this ia great material. I really can't express adequately how great this material is, blah, blah, blah.",
    "specialproperties": ["Cold Resistant", "Removable", "Flame Retardent"],
    "compliance": ["UL", "CSA", "ROHS"],
    "applications": ["Wire & Cable", "Lab", "Hazardous Materials"],
    "color": ["blue", "yellow", "brown", "white"],
    "tapecolorable": "yes",
    "chemresistance": [
      {
        "category": "Fuels",
        "rating": "Good"
      },
      {
        "category": "Oils",
        "rating": "Poor"
      },
      {
        "category": "Solvents",
        "rating": "Good"
      },      {
        "category": "Cleaners",
        "rating": "Bad"
      }
    ],
    "adhesion": [
      {
        "category": "Steel",
        "rating": "Good"
      },
      {
        "category": "Powder Coated Metal",
        "rating": "Poor"
      },
      {
        "category": "Polypropylene",
        "rating": "Good"
      },      {
        "category": "Textured ABS",
        "rating": "Bad"
      }
    ]
  },

  {
    "num": "B­-259",
    "description": "Another description for B-259",
    "type": "LabelRoll",
    "material": "Paper",
    "finish": "Gloss",
    "adhesive": "Glue",
    "thickness": ".0034 in",
    "longdescription": "B-259. Ok, tbh, this is not our best material. In fact, it pains me slightly to even mentioned it. Let's maybe move on to the next material.",
    "specialproperties": ["Flame Retardent", "Removable"],
    "compliance": ["UL", "CSA", "ROHS"],
    "applications": ["Wire & Cable", "Lean", "Safety", "LOTO"],
    "color": ["blue", "yellow", "orange", "white", "clear", "green", "purple"],
    "tapecolorable": "no",
    "chemresistance": [
      {
        "category": "Fuels",
        "rating": "Good"
      },
      {
        "category": "Oils",
        "rating": "Poor"
      },
      {
        "category": "Solvents",
        "rating": "Good"
      },      {
        "category": "Cleaners",
        "rating": "Bad"
      }
    ],
    "adhesion": [
      {
        "category": "Steel",
        "rating": "Good"
      },
      {
        "category": "Powder Coated Metal",
        "rating": "Poor"
      },
      {
        "category": "Polypropylene",
        "rating": "Good"
      },      {
        "category": "Textured ABS",
        "rating": "Bad"
      }
    ]
  }
];

var Filters = [
  {
    "id": "material",
    "displayname": "Material",
    "presentation": "Dropdown",
    "values": [] // This is a bit of a hack to get the default value in
  },
  {
    "id": "finish",
    "displayname": "Finish",
    "presentation": "Dropdown",
    "values": [] // This is a bit of a hack to get the default value in
  },
  {
    "id": "colors",
    "displayname": "Colors",
    "presentation": "Swatch",
    "values": [] // This is a bit of a hack to get the default value in
  }
];


// Controller
var app = angular.module('MaterialApp', []);

app.controller('MaterialCtrl', function($scope, $filter) {
  $scope.AllBnums = Bnums;
  $scope.Bnum = Bnums;
  $scope.Filters = Filters;
  $scope.selectedMaterial;
  // define an array to hold the list applied filters
  $scope.setFilters = [];

// This function loops through all the Bnums looking for each filter. 
// It then collects the possible values for each filter and adds them to the Filters array. 
// This is used to populate the dropdowns with the possible values from the data
  $scope.init = function () {
      //loop across the Filters array
      for(var i=0; i < Filters.length; i++){
        // take the id from each Filter to find the values in the Bnum data
        var currentfilter = Filters[i].id;
        // loop across Bnums looking for at the current filter and adding the value from the B# into the Filters.values array
        for(var j=0; j < Bnums.length; j++) {
          //check to see if the value is already in the values array. 
          if (Filters[i].values.indexOf(Bnums[j][currentfilter]) == -1) { 
            // not already there so add it        
            Filters[i].values.push(Bnums[j][currentfilter]);
          };
        };;
        // now sort the values so they will be presented in alphabetical order
        Filters[i].values.sort();
      };
    };


  $scope.updateTable = function() {
    // create a temporary B# list of all B#sa to filter down
    var TempBnums = $scope.AllBnums;
    // console.log(TempBnums);
    // call the function to filter the temp full B# list by the setFilters list
    for(var i=0; i < $scope.setFilters.length; i++) {
      // loop through the list of attribute/value pairs filter TempBnums repeatedly for each pair
        var temp1 = $scope.setFilters[i].FilterId;
        var temp2 = $scope.setFilters[i].FilterValue;
        // console.log(temp1 + " " + temp2);
        // console.log("TempBnums prior to filtering = " + TempBnums);
        var TempBnums = $filter('filter')(TempBnums, { [temp1]: temp2 });
    };
    // reset the Bnum list to the new filtered list of Bnums
    // console.log("TempBnums after filtering = " + TempBnums);
    $scope.Bnum = TempBnums;
    // reassess possible filter values and gray them out in the input controls
  };

  $scope.addFilter = function(filterId, filterValue) {
    // take the inputs to create a attribute/value pair identifying the attribute and its set value
    attrvaluepair = {
      "FilterId": filterId,
      "FilterValue": filterValue
    };
    // Add the attribute/value pair to the array of set filters 
    $scope.setFilters.push(attrvaluepair);
    $scope.updateTable();
  };


  $scope.removeFilter = function(filter) {
    for( var i = 0; i < $scope.setFilters.length; i++){ 
       if ( $scope.setFilters[i] == filter) {
         $scope.setFilters.splice(i, 1); 
       };
    };
    $scope.updateTable();
  };

  $scope.init();

});








// QUESTIONS FOR JASON
//======================
// 1.












