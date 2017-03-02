
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

  Object.keys(obj).forEach( function (key) {  
    if (key != "state") {
      obj[key + "percent"] = parseFloat(obj[key])/total;
    }
  });
}

// { "key": acronym, "values": { "sector": x mgal/day, "percent": percent of STATE total by sector }} 
// for all states and sectors
var stateData; 
// { "sector": x mgal/day, "percent": percent of USA total by sector }
// not divided by state
var usData;
// { "(state_acronym)": total water used by state as percentage of USA total }
// not divided by sector
var statePercents;

d3.tsv("usco2010.tsv", parseLine, function (error, data) {

  // Get total percentage by state
  stateData = d3.nest()
  .key(function (d) { return d.state; })
  .entries(data);

  usData = { "state": "US"};
  statePercents = {};

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

  stateData.forEach( function (d) {
    statePercents[d.values["state"]] = parseFloat(d.values["to-wtotl"])/parseFloat(usData["to-wtotl"]);
    calcPercent(d.values);
  })
  calcPercent(usData);
  visualize(usData, stateData, statePercents);

});