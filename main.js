var topOfIntro = 60;
var topOfSpout = topOfIntro+50;
var topOfWaterUsage = topOfSpout + 580;
var svg = d3.select("svg");

function visualize(usData, nyData, statePercents, counties){
  var sectorstream = mergeStream(500, usData, 3000, 30, 300, topOfSpout+1500);
  var statesplit = new StateStream(500, statePercents, 9, 3001, 11, 300, topOfSpout+4499);
  var topstream = new Chord(500, topOfSpout+500, 300, topOfSpout+1502, 120, 500);

  var cornell = new Chord(500, topOfSpout + 8249, 300, topOfSpout + 10000, 0.885, 500); 
  
  //creating title text 
  var titleWords = ["United States", "Daily Water", "Consumption"]
  for (i=0; i<3; i++) {
	  svg.append("text")
	  .text(titleWords[i])
	  .attr("x", 50)
	  .attr("y", topOfIntro + 50 + 90*i)
	  .style("font-size", "80px")
	  .style("fill", "#2f2e33");
  }
  
  //title image
  svg.append("image")
  .attr("href", "manDrinking.svg")
  .attr("x", 70)
  .attr("y", topOfIntro+280)
  .attr("height", 310)
  .attr("width", 310);
  //
 

  //Niagara falls factoid

  var niagaraFalls = new Chord(120, topOfWaterUsage+735-100, 200, topOfSpout + 1500, 20, 57.75);

  svg.append("image")
  .attr("href", "waterfall.svg")
  .attr("x", 40)
  .attr("y", topOfWaterUsage+600-100)
  .attr("height", 220)
  .attr("widht", 220);
  
  svg.append("path")
  .attr("d", niagaraFalls.path())
  .attr("class", "chord")
  .attr("fill", "#b3f4ef");

  svg.append("path")  
  .attr("d", (new Chord(200, topOfSpout + 1500, 200, topOfSpout + 1600, 57.75)).path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-niagra", ["#b3f4ef", "#ffffff"]));
// 
  svg.append("path")
  .attr("d", scaleLine(200, topOfSpout + 1500, 57.75, 30).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "3");
  
  svg.append("text")
  .text("41 Billion gpd")
  .attr("x", 215)
  .attr("text-anchor", "middle")
  .attr("y", topOfSpout + 1465)
  .style("font-size", "24px");
  
  svg.append("text")
  .text("Niagara Falls")
  .attr("x", 78)
  .attr("y", topOfWaterUsage+590-100)
  .style("fill", "#2f2e33")
  .style("font-size", "30px");
  
  // Stream out of the faucet
  svg.append("path")
  .attr("d", topstream.path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-top", ["hsl(225, 90%, 61%)", "hsl(235, 90%, 61%)"]));

  // US sectors merge stream 
  svg.append("path")
  .attr("d", sectorstream.path)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-sector", ["hsl(235, 90%, 61%)", "hsl(240, 100%, 44%)"]));

  // Annotation for total US width
  svg.append("path")
  .attr("d", scaleLine(300, (topOfSpout + 1650), 500).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "4");

  svg.append("text")
  .text("Total US Water Usage")
  .attr("text-anchor", "middle")
  .attr("font-size", "40")
  .style("fill", "#2f2e33")
  .attr("x", 550)
  .attr("y", topOfSpout + 1575);

  svg.append("text")
  .text("355 Billion gpd")
  .attr("text-anchor", "middle")
  .attr("font-size", "50")
  .style("fill", "black")
  .attr("x", 550)
  .attr("y", topOfSpout + 1630);

  // US sector merge stream
  var sectors = svg.selectAll("g.us_sector")
  .data(sectorstream.text)
  .enter();

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
  .attr("x", (t) => 970)
  .attr("y", (t, i) => t.y - 4 * 80 + 80 * i);

  sectors.append("text")
  .text((d) => d.name)
  .attr("dominant-baseline", "middle")
  .attr("font-size", "25")
  .attr("x", (t) => 1040)
  .attr("y", (t, i) => t.y - 4 * 80 + 80 * i + 30);

  // State Splits
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
  .attr("font-size", "14")
  .attr("dominant-baseline", "middle")
  .attr("transform", (t) => "rotate(80, " + t.x + ", " + t.y + ")")
  .attr("x", (t) => t.x)
  .attr("y", (t) => t.y);

  // NY state sectors split 
  var nysplit = new StateStream(500, nyData, 2, 2000, 55, 300, topOfSpout+6749);

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

  //new york state label
  svg.append("image")
  .attr("href", "NY.svg")
  .attr("x", 360)
  .attr("y", 6520)
  .attr("height", 220);
  
  // Annotation for total NY width
  svg.append("path")
  .attr("d", scaleLine(300, topOfSpout+6730, 500).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "4");

  svg.append("text")
  .text("10.9 Billion gpd")
  .attr("text-anchor", "middle")
  .attr("font-size", "40")
  .style("fill", "black")
  .attr("x", 550)
  .attr("y", topOfSpout + 6710);

  // Public supply NY state region splits
  var topofregion = topOfSpout + 8249;
  var regionsplit = StateStream(500, counties, 7, 1500, 30, 300, topofregion, true);

  svg.append("path")
  .attr("d", regionsplit.path_out)
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-nytop", ["hsl(240, 100%, 44%)", "hsl(230, 90%, 61%)"]));

  svg.append("path")
  .attr("d", regionsplit.path_fade)
  .attr("class", "chord")
  .attr("fill", "url(#statesfadeout)");

  svg.selectAll("g.states")
  .data(regionsplit.text)
  .enter()
  .append("text")
  .text((d) => d.name)
  .attr("text-anchor", "beginning")
  .attr("font-size", "14")
  .attr("dominant-baseline", "middle")
  .attr("transform", (t) => "rotate(70, " + t.x + ", " + t.y + ")")
  .attr("x", (t) => t.x)
  .attr("y", (t) => t.y);

  // Annotation for total NY Public Supply width
  svg.append("image")
  .attr("href", "NY.svg")
  .attr("x", 470)
  .attr("y", topofregion - 300)
  .attr("height", 220);

  svg.append("image")
  .attr("href", "img/ps.svg")
  .attr("x", 580)
  .attr("y", topofregion - 220)
  .attr("height", 80);

  svg.append("path")
  .attr("d", scaleLine(300, topofregion - 15, 500).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "4");

  svg.append("text")
  .text("960 Million gpd")
  .attr("text-anchor", "middle")
  .attr("font-size", "30")
  .style("fill", "black")
  .attr("x", 550)
  .attr("y", topofregion - 35);

  // NYC public supply annotation 
  svg.append("text")
  .text("100% of New York City's public supply is")
  .attr("font-size", "20")
  .style("fill", "black")
  .attr("x", 200)
  .attr("y", topofregion + 850);

  svg.append("text")
  .text("drawn from counties in the Hudson Valley! ")
  .attr("font-size", "20")
  .style("fill", "black")
  .attr("x", 200)
  .attr("y", topofregion + 880);

  // Cornell bit from Southern Tier public supply
  var topofcornell = topofregion + 1200;
  var cornelltwidth = 19.56;
  var cornellbwidth = 100;
  var cornell = new Chord(300, topofcornell, 550 - cornellbwidth/2, topofcornell + 700, cornelltwidth, cornellbwidth); 
  var notcornell = new Chord(300 + cornelltwidth, topofcornell, cornelltwidth + 450, topofcornell + 500, 500 - cornelltwidth, 350 - cornelltwidth)

  svg.append("path")
  .attr("d", (new Chord(300, topofregion + 1125, 300, topofcornell, 500)).path())
  .attr("class", "chord")
  .attr("fill", "hsl(230, 90%, 61%)");

  svg.append("path")
  .attr("d", notcornell.path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-notcornell", ["hsl(230, 90%, 61%)", "#ffffff", "#ffffff"]));

  svg.append("path")
  .attr("d", cornell.path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-cornell", ["hsl(230, 90%, 61%)", "red"]));
 
   svg.append("path")
  .attr("d", (new Chord(550 - cornellbwidth/2, topofcornell + 700, 550 - cornellbwidth/2, topofcornell + 800, cornellbwidth)).path())
  .attr("class", "chord")
  .attr("fill", vertGrad("grad-cornell-fade", ["red", "white"]));

  // Annotation for total Southern Tier width
  svg.append("path")
  .attr("d", scaleLine(300, topofcornell - 50, 500).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "4");

  svg.append("text")
  .text("Southern Tier Public Supply")
  .attr("text-anchor", "middle")
  .attr("font-size", "30")
  .style("fill", "black")
  .attr("x", 550)
  .attr("y", topofcornell - 100);

  svg.append("text")
  .text("44 Million gpd")
  .attr("text-anchor", "middle")
  .attr("font-size", "30")
  .style("fill", "black")
  .attr("x", 550)
  .attr("y", topofcornell - 65);

  // Annotation for total Cornell width
  svg.append("path")
  .attr("d", scaleLine(550 - cornellbwidth/2, topofcornell + 700, cornellbwidth, 40).d)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", "3");

  svg.append("text")
  .text("Cornell Daily Usage")
  .attr("text-anchor", "end")
  .attr("font-size", "30")
  .style("fill", "black")
  .attr("x", 480)
  .attr("y", topofcornell + 680);

  svg.append("text")
  .text("1.7 Million gpd")
  .attr("text-anchor", "end")
  .attr("font-size", "30")
  .style("fill", "black")
  .attr("x", 480)
  .attr("y", topofcornell + 720)

  // This selects whichever region contains Tompkins county and displays them in a diagonal
  Object.keys(ny_countytoregion).reduce(function(a, x){
    if(ny_countytoregion[x] == ny_countytoregion["Tompkins"]) a.push(x);
    return a;
  }, []).sort(function(a, b){
    if(a == "Tompkins") return false;
    if(b == "Tompkins") return true;
    return a.length < b.length; 
  }).forEach(function(name, i){
    svg.append("text")
    .text(name)
    .attr("font-size", "20")
    .style("fill", "black")
    .attr("x", 310 + 70 * i)
    .attr("y", topofcornell - 10 + 30 * i);
  });

  //average drinking per day image text creation
  for (i=0; i<3; i++) {
    svg.append("image")
    .attr("href", "water.svg")
    .attr("x", 850 + 50*i)
    .attr("y", topofcornell + 390)
    .attr("width", 100)
    .attr("height", 100);
  }

  svg.append("text")
  .text("water the average college student drinks per day")
  .attr("x", 950)
  .attr("y", topofcornell + 360)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .attr();

  svg.append("rect")
  .attr("x", 994)
  .attr("y", topofcornell + 390)
  .attr("width", 24)
  .attr("height", 100)
  .attr("fill", "white");

  //creating an array of water bottles
  for (i=0; i<30; i++){
    for(j=0; j<17; j++) {
      svg.append("image")
      .attr("href", "water.svg")
      .attr("x", 750 + i*13)
      .attr("y",  j*25 -30 + topofcornell + 600)
      .attr("width", 18)
      .attr("height", 50);
    }
  }

  svg.append("text")
  .text("water the average college student uses per day")
  .attr("x", 950)
  .attr("y", topofcornell + 560)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .attr();

  //creating label for array of water bottles
  // var avgWaterUseWords = ["water the average", "college student", "uses per day"]

  // for (i=0; i<3; i++) {
  //   svg.append("text")
  //   .text(avgWaterUseWords[i])
  //   .attr("x", 950)
  //   .attr("y", 30*i + topofcornell + 790)
  //   .attr("text-anchor", "middle")
  //   .style("font-size", "30px")
  //   .style("font-weight", "bold");
  // }
  
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
