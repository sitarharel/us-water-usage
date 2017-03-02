function visualize(usData, stateData, statePercents){
  var svg = d3.select("svg");

  // these temp things definitely should not be kept in, instead fix in parseData.js
  var tempSectors = Object.keys(usData).reduce((a, x)=>{if(x.slice(-7) == "percent" && a.length < 12){a.push({name: x.slice(0, 2), val: usData[x]});} return a}, []);
  var scale = 500 / tempSectors.reduce((a, x) => a + x.val, 0);
  tempSectors = tempSectors.map((x) => {return {name: x.name, val: x.val * scale}});

  var tempStates = Object.keys(statePercents).map((x) => {return {name: x, percent: statePercents[x]}});

  var sectorstream = mergeStream(500, tempSectors, 3000, 30, 300, 1500);
  var statesplit = new StateStream(500, tempStates, 32, 3000, 11, 300, 4500);
  var topstream = new Chord(500, 500, 300, 1500, 120, 500);


  svg.append("path")
  .attr("d", topstream.path())
  .attr("class", "chord")
  .attr("fill", "url(#grad)");

  svg.append("path")
  .attr("d", sectorstream.path)
  .attr("class", "chord")
  .attr("fill", "url(#backgrad)");

  svg.selectAll("g.us_sector")
  .data(sectorstream.text)
  .enter()
  .append("text")
  .text((d) => d.name)
  .attr("text-anchor", "middle")
  .attr("x", (t) => t.x)
  .attr("y", (t) => t.y)


  svg.append("path")
  .attr("d", statesplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#circfadeout)");

  svg.append("path")
  .attr("d", statesplit.path_out)
  .attr("class", "chord")
  .attr("fill", "url(#grad)");


  svg.selectAll("g.states")
  .data(statesplit.text)
  .enter()
  .append("text")
  .text((d) => d.name)
  .attr("text-anchor", "middle")
  .attr("x", (t) => t.x)
  .attr("y", (t) => t.y)

  svg.append("image")
  .attr("href", "tap.svg")
  .attr("x", "430")
  .attr("y", "0")
  .attr("height", "800px")
  .attr("width", "800px")
}
