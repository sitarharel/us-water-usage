// Extract only state acronym, county name (if state is NY), and major sector usage
function parseLine (line) {
  var total = /w([A-z]*)totl$/i;
  var result = { "state": line["STATE"]};
  if (line["STATE"]=="NY") {
    result["county"] = line["COUNTY"];
  }
  Object.keys(line).forEach( (key) => {
    if (total.test(key)) {
      result[key.toLowerCase()] = line[key];
    }
  });
  return result;
}

// Given an object with a sector in mgd and total in mgd, convert percent of total
function calcPercent (obj) {
  var total = parseFloat(obj["to-wtotl"]);

  var value = [];
  Object.keys(obj).forEach( function (key) {  
    var sector = {};
    if (key != "state" && key != "to-wtotl" && key != "county") {
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

  // [ { "id": sector_acronym, "name" : sector_name, 
  //     "val": Mgal/day, "percent": sector percent of US total }, ...]
  var usData = {};

  // [ { "id": state_acronym, name": state_name, "percent": state percent of US total }, ...]
  var statePercents = [];

  // [ { "id": sector_acronym, "name" : sector_name, 
  //      "val": Mgal/day, "percent": sector percent of NY total }, ...]
  var nyData;

  // Total US water usage in millions of gallons per day
  var usTotal; 
 
  // [ { "name" : region_name, "val": Mgal/day, "percent": sector percent of NY PS total }, ...]
  var regionPSData = [];

  var stateData = d3.nest()
  .key(function (d) { return d.state; })
  .entries(data);

  stateData = stateData.filter( (d) => { 
    return ((d["key"] != "PR") && (d["key"] != "VI") && (d["key"] !="DC")); } );

  var countyData = d3.nest()
    .key(function (d) { return d.state; })
    .entries(data);

  countyData = countyData.filter( (d) => { 
    return (d["key"] == "NY");
  });

  // NY county to region aggregate
  countyData = countyData[0]["values"].reduce( function (acc, curr) {
    var county = curr["county"].substring(0, curr["county"].length-7);
    var region = ny_countytoregion[county];
    if (!region) {
      console.log(county);
    }
    if (!(region in acc)) {
          acc[region] = 0;
    }
    acc[region] = parseFloat(acc[region]) + parseFloat(curr["ps-wtotl"]);
    return acc;
  }, {});

  Object.keys(countyData).forEach( function (key) { 
    regionPSData.push( {"name": key, "val":  parseFloat(countyData[key]), "percent": parseFloat(countyData[key]) / 2263.04});
  });
  regionPSData.sort( (a, b)  => { return (b["percent"] - a["percent"]); });


  // County to state and US total aggregate
  stateData.forEach( function (d) {
    d.values = d.values.reduce( function (acc, curr) {
      Object.keys(curr).forEach( function (key) {  
        if (!(key in usData)) {
          usData[key] = 0;
        }
        if (key != "state" && key != "county") {
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

  // Map state acronyms to full names
  d3.json("states_hash.json", function(stateDict) {
    stateData.forEach( function (d) {
      statePercents.push({ "id": d["key"].toUpperCase(),
                           "name": stateDict[d["key"]], 
                           "percent": parseFloat(d.values["to-wtotl"])/usTotal });
    })
    statePercents.sort( (a, b)  => { return (b["percent"] - a["percent"]); });
    visualize(usData, nyData, statePercents, regionPSData);
  });

});
