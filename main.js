var topOfIntro = 50;
var topOfSpout = topOfIntro+600;

function visualize(usData, nyData, statePercents){
  var svg = d3.select("svg");

  var sectorstream = mergeStream(500, usData, 3000, 30, 300, topOfSpout+1500);
  var statesplit = new StateStream(500, statePercents, 9, 3001, 11, 300, topOfSpout+4499);
  nyData = nyData.sort((a, b) => b.percent > a.percent);
  var nysplit = new StateStream(500, nyData, 2, 2000, 50, 300, topOfSpout+6749);
  var topstream = new Chord(500, topOfSpout+500, 300, topOfSpout+1500, 120, 500);

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

  //average drinking per day image text creation
  for (i=0; i<3; i++) {
	  svg.append("image")
	  .attr("href", "water.svg")
	  .attr("x", 150 + 50*i)
	  .attr("y", topOfIntro)
	  .attr("width", 100)
	  .attr("height", 100);
  }
  
  svg.append("text")
  .text("water the average college student drinks per day")
  .attr("x", 250)
  .attr("y", topOfIntro+130)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .attr();
  
  svg.append("rect")
  .attr("x", 294)
  .attr("y", topOfIntro)
  .attr("width", 24)
  .attr("height", 100)
  .attr("fill", "white");
  //end
  
  //creating an array of water bottles
  for (i=0; i<30; i++){
	  for(j=0; j<22; j++) {
		  svg.append("image")
		  .attr("href", "water.svg")
		  .attr("x", 570 + i*18)
		  .attr("y", topOfIntro + j*25 - 20)
		  .attr("width", 18)
		  .attr("height", 50);
	  }
  }
  //end
  
  //creating label for array of water bottles
  var avgWaterUseWords = ["water the average", "college student", "uses per day"]
  
  for (i=0; i<3; i++) {
	  svg.append("text")
	  .text(avgWaterUseWords[i])
	  .attr("x", 840)
	  .attr("y", topOfIntro+220+30*i)
	  .attr("text-anchor", "middle")
	  .style("font-size", "30px")
	  .style("font-weight", "bold");
  }
  //
  
  svg.append("path")
  .attr("d", topstream.path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-top", ["hsl(225, 90%, 61%)", "hsl(235, 90%, 61%)"]));


  svg.append("path")
  .attr("d", sectorstream.path)
  .attr("class", "chord")
  // .attr("stroke", "black")
  .attr("fill", vertGrad("grad-sector", ["hsl(235, 90%, 61%)", "hsl(240, 100%, 44%)"]));

  // svg.append("path")
  // .attr("d", sectorstream.path)
  // .attr("class", "chord")
  // .attr("fill", "url(#water-pattern)");

  // svg.append("path")
  // .attr("d", topstream.path())
  // .attr("class", "chord")
  // .attr("fill", "url(#water-pattern)");

  var sectors = svg.selectAll("g.us_sector")
  .data(sectorstream.text)
  .enter();
  // sectors.append("text")
  // .text((d) => d.name)
  // .attr("text-anchor", "middle")
  // .attr("x", (t) => t.x)
  // .attr("y", (t) => t.y);

  sectors.append("image")
  .attr("href", (d) => "img/" + d.id + ".svg")
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => t.x - 30)
  .attr("y", (t, i) => t.y + 45 - 90 * (i % 2));

  sectors.append("image")
  .attr("href", (d) => "img/" + d.id + ".svg")
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => 930)
  .attr("y", (t, i) => t.y - 4 * 80 + 80 * i);

  sectors.append("text")
  .text((d) => d.name)
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => 1000)
  .attr("y", (t, i) => t.y - 4 * 80 + 80 * i + 30);

  // svg.append("path")
  // .attr("d", nysplit.path_fade)
  // .attr("class", "chord")
  // .attr("fill", "url(#circfadeout)");

  // svg.append("path")
  // .attr("d", nysplit.path_out)
  // .attr("class", "chord")
  // .attr("fill", vertGrad("grad-nytop", ["hsl(240, 100%, 44%)", "hsl(240, 100%, 44%)", "hsl(235, 90%, 61%)"]));

  svg.append("path")
  .attr("d", statesplit.path_out)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-nytop", ["hsl(240, 100%, 44%)", "hsl(230, 90%, 61%)"]));

  svg.append("path")
  .attr("d", statesplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#statesfadeout)");

  svg.selectAll("g.states")
  .data(statesplit.text)
  .enter()
  .append("text")
  .text((d) => d.name)
  .attr("text-anchor", "beginning")
  .attr("dominant-baseline", "middle")
  .attr("transform", (t) => "rotate(70, " + t.x + ", " + t.y + ")")
  .attr("x", (t) => t.x)
  .attr("y", (t) => t.y)


  svg.append("path")
  .attr("d", nysplit.path_out)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-ny", ["hsl(230, 90%, 61%)", "hsl(240, 100%, 44%)"]));

  svg.append("path")
  .attr("d", nysplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#nyfadeout)");



  sectors

  svg.selectAll("g.ny-industries")
  .data(nysplit.text)
  .enter()
  .append("image")
  .attr("href", (d) => "img/" + d.id + ".svg")
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => t.x - 30)
  .attr("y", (t) => t.y - 30);

  addTap(svg);
}

function addTap(svg){
  svg.append("image")
  .attr("href", "tap.svg")
  .attr("x", "430")
  .attr("y", topOfSpout)
  .attr("height", "800px")
  .attr("width", "800px");

  svg.append("clipPath")
  .attr("id", "leftclip")
  .append("rect")
  .attr("x", 740)
  .attr("y",  topOfSpout + 230)
  .attr("height", "300px")
  .attr("width", "148px");

  svg.append("image")
  .attr("href", "img/us-map-dark.svg")
  .attr("x", 740)
  .attr("y", topOfSpout + 230)
  .attr("height", "300px")
  .attr("width", "300px");

  svg.append("image")
  .attr("href", "img/us-map-bright.svg")
  .attr("x", 740)
  .attr("y", topOfSpout + 230)
  .attr("clip-path", "url(#leftclip)")
  .attr("height", "300px")
  .attr("width", "300px");
}