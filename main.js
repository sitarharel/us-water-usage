var topOfIntro = 50;
var topOfSpout = topOfIntro+600;

function visualize(usData, stateData, statePercents){
  var svg = d3.select("svg");

  // these temp things definitely should not be kept in, instead fix in parseData.js
  var tempSectors = Object.keys(usData).reduce((a, x)=>{if(x.slice(-7) == "percent" && a.length < 12){a.push({name: x.slice(0, 2), val: usData[x]});} return a}, []);
  var scale = 500 / tempSectors.reduce((a, x) => a + x.val, 0);
  tempSectors = tempSectors.map((x) => {return {name: x.name, val: x.val * scale}});

  var tempStates = Object.keys(statePercents).map((x) => {return {name: x, percent: statePercents[x]}});

  var sectorstream = mergeStream(500, tempSectors, 3000, 30, 300, topOfSpout+1500);
  var statesplit = new StateStream(500, tempStates, 32, 3000, 11, 300, topOfSpout+4500);
  var topstream = new Chord(500, topOfSpout+500, 320, topOfSpout+1500, 120, 500);

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
  .attr("y", topOfSpout)
  .attr("height", "800px")
  .attr("width", "800px")
}
