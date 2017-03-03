function visualize(usData, stateData, statePercents){
  var svg = d3.select("svg");
 
  var tempStates = Object.keys(statePercents).map((x) => {return {name: x, percent: statePercents[x]}});
  tempStates.sort((a, b) => b.percent - a.percent);

  var sectorstream = mergeStream(500, usData, 3000, 30, 300, 1500);
  var statesplit = StateStream(500, statePercents, 9, 3000, 10, 300, 4500);
  // var nysplit = new StateStream(500, rand_data(10, 500), 5, 3000, 30, 300, 7500);
  var topstream = new Chord(500, 500, 300, 1500, 120, 500);
  // console.log(statesplit);

  var defs = svg.append("defs");

  var vertGrad = function(id, offsets){
    var grad = defs.append("linearGradient")
    .attr("id", id || "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
    for(var i = 0; i < offsets.length; i++){
      grad.append("stop")
      .attr("offset", i * 100/(offsets.length - 1) + "%")
      .attr("stop-color", offsets[i]);
    }
    return "url(#" + grad.attr("id") + ")";
  }

  svg.append("path")
  .attr("d", topstream.path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-top", ["hsl(225, 90%, 61%)", "hsl(235, 90%, 61%)"]));

  svg.append("path")
  .attr("d", sectorstream.path)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-sector", ["hsl(235, 90%, 61%)", "hsl(240, 100%, 44%)"]));

  var sectors = svg.selectAll("g.us_sector")
  .data(sectorstream.text)
  .enter();
  // sectors.append("text")
  // .text((d) => d.name)
  // .attr("text-anchor", "middle")
  // .attr("x", (t) => t.x)
  // .attr("y", (t) => t.y);

  sectors.append("image")
  .attr("href", (d) => "img/" + d.name + ".svg")
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => t.x - 30)
  .attr("y", (t, i) => t.y - 100 + 130 * (i % 2));

  // svg.append("path")
  // .attr("d", nysplit.path_fade)
  // .attr("class", "chord")
  // .attr("fill", "url(#circfadeout)");

  // svg.append("path")
  // .attr("d", nysplit.path_out)
  // .attr("class", "chord")
  // .attr("fill", vertGrad("grad-nytop", ["hsl(240, 100%, 44%)", "hsl(240, 100%, 44%)", "hsl(235, 90%, 61%)"]));

  svg.append("path")
  .attr("d", statesplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#circfadeout)");

  svg.append("path")
  .attr("d", statesplit.path_out)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-nytop", ["hsl(240, 100%, 44%)", "hsl(230, 90%, 61%)"]));

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
