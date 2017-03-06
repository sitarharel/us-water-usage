
// [ { "name" : sector_name, "percent": sector percent of US total }, ...]
var usData = {};

// [ { "name": state_name, "percent": state percent of US total }, ...]
var statePercents = [];

// [ { "name" : sector_name, "percent": sector percent of NY total }, ...]
var nyData;

// Total US water usage in millions of gallons per day
var usTotal; 

var sectorDict = { "ps": "Public Supply", "do": "Domestic", "in": "Industrial",
                   "ir": "Irrigation", "li": "Livestock", "aq": "Aquaculture",
                   "mi": "Mining", "pt": "Thermoelectric", "to": "Total" };

function parseLine (line) {
  var total = /w([A-z]*)totl$/i;
  var result = { "state": line["STATE"]};
  Object.keys(line).forEach( (key) => {
    if (total.test(key)) {
      result[key.toLowerCase()] = line[key];
    }
  });
  return result;
}

function calcPercent (obj) {
  var total = parseFloat(obj["to-wtotl"]);

  var value = [];
  Object.keys(obj).forEach( function (key) {  
    var sector = {};
    if (key != "state" && key != "to-wtotl") {
      sector["id"] = key.slice(0, 2);
      sector["name"] = sectorDict[key.slice(0, 2)];
      sector["percent"] = parseFloat(obj[key])/total;
      sector["val"] = parseFloat(obj[key]);
      value.push(sector);
    }
  });
  return value;
}

d3.tsv("usco2010.tsv", parseLine, function (error, data) {

  var stateData = d3.nest()
  .key(function (d) { return d.state; })
  .entries(data);

  stateData = stateData.filter( (d) => { 
    return ((d["key"] != "PR") && (d["key"] != "VI") && (d["key"] !="DC")); } );

  stateData.forEach( function (d) {
    // Collapses county data into state and US totals
    d.values = d.values.reduce( function (acc, curr) {
      Object.keys(curr).forEach( function (key) {  
        if (!(key in usData)) {
          usData[key] = 0;
        }
        if (key != "state") {
          var currVal = parseFloat(curr[key]);
          currVal = (isNaN(currVal) ? 0 : currVal);
          acc[key] = parseFloat(acc[key]) + currVal;
          usData[key] = parseFloat(usData[key]) + currVal;
        }
      })
      return acc;
    });
  });

  usTotal = parseFloat(usData["to-wtotl"]);
  nyData = calcPercent(stateData[32].values).sort((a, b) => b.percent > a.percent);
  usData = calcPercent(usData);

  d3.json("states_hash.json", function(stateDict) {
    stateData.forEach( function (d) {
      statePercents.push({ "id": d["key"].toUpperCase(),
                           "name": stateDict[d["key"]], 
                           "percent": parseFloat(d.values["to-wtotl"])/usTotal });
    })
    statePercents.sort( (a, b)  => { return (b["percent"] - a["percent"]); });
    visualize(usData, nyData, statePercents);
  });

});
