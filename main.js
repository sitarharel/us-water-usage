var topOfIntro = 60;
var topOfSpout = topOfIntro+50;
var topOfWaterUsage = topOfSpout + 580;

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
  
  //creating title text 
  var titleWords = ["USA", "Daily Water", "Consumption"]
  for (i=0; i<3; i++) {
	  svg.append("text")
	  .text(titleWords[i])
	  .attr("x", 50)
	  .attr("y", topOfIntro + 50 + 90*i)
	  .style("font-size", "80px")
	  .style("fill", "#2f2e33");
  }
  //end
  
  //title image
  svg.append("image")
  .attr("href", "manDrinking.svg")
  .attr("x", 70)
  .attr("y", topOfIntro+280)
  .attr("height", 310)
  .attr("width", 310);
  //
  

  //average drinking per day image text creation
  for (i=0; i<3; i++) {
	  svg.append("image")
	  .attr("href", "water.svg")
	  .attr("x", 100 + 50*i)
	  .attr("y", topOfWaterUsage+190)
	  .attr("width", 100)
	  .attr("height", 100);
  }

  svg.append("text")
  .text("water the average college student drinks per day")
  .attr("x", 230)
  .attr("y", topOfWaterUsage+170)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .attr();

  svg.append("rect")
  .attr("x", 244)
  .attr("y", topOfWaterUsage+190)
  .attr("width", 24)
  .attr("height", 100)
  .attr("fill", "white");
  //end

  //creating an array of water bottles
  for (i=0; i<30; i++){
	  for(j=0; j<17; j++) {
		  svg.append("image")
		  .attr("href", "water.svg")
		  .attr("x", 750 + i*13)
		  .attr("y", topOfWaterUsage + j*25 -30)
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
	  .attr("x", 950)
	  .attr("y", topOfWaterUsage+170+30*i)
	  .attr("text-anchor", "middle")
	  .style("font-size", "30px")
	  .style("font-weight", "bold");
  }
  //end
  
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
  .attr("y", (t) => t.y);


  svg.append("path")
  .attr("d", nysplit.path_out)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-ny", ["hsl(230, 90%, 61%)", "hsl(240, 100%, 44%)"]));

  svg.append("path")
  .attr("d", nysplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#nyfadeout)");

  svg.selectAll("g.ny-industries")
  .data(nysplit.text)
  .enter()
  .append("image")
  .attr("href", (d) => "img/" + d.id + ".svg")
  .attr("height", "60px")
  .attr("width", "60px")
  .attr("x", (t) => t.x - 30)
  .attr("y", (t) => t.y - 30);

  var niagraFalls = new Chord(402, topOfWaterUsage+760, 300, 1800, 98, 20);
  
    // svg.append("path")
  //   .attr("d", "M220 1400 L400 1450")
  //   .attr("fill", "black")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 3);
  
  svg.append("path")
  .attr("d", niagraFalls.path())
  .attr("class", "chord")
  .attr("fill", "black");

  addTap(svg);
}

function addTap(svg){
  svg.append("image")
  .attr("href", "tap.svg")
  .attr("x", "430")
  .attr("y", topOfSpout)
  .attr("height", "800px")
  .attr("width", "800px");
  
  //niagra falls factoid
  svg.append("image")
  .attr("href", "waterfall.svg")
  .attr("x", 50)
  .attr("y", topOfWaterUsage+600)
  .attr("height", 220)
  .attr("widht", 220);
  
  svg.append("text")
  .text("Niagra Falls")
  .attr("x", 88)
  .attr("y", topOfWaterUsage+590)
  .style("font-size", "30px");
  
  svg.append("circle")
  .attr("cx", 220)
  .attr("cy", 710 + topOfWaterUsage)
  .attr("r", 7)
  .attr("fill", "none")
  .attr("stroke", "hsl(235, 90%, 61%)")
  .attr("stroke-width", "2");


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
