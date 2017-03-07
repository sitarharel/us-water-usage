var graphSize = 275;
var graphY = topOfSpout + 3750;
var graphX = 900;

var waterKG = [{"name": "Vegetables", "value": 85}, {"name": "Fruits", "value": 254},
			   {"name": "Chicken", "value": 1142}, {"name": "Nuts", "value": 2394},  
			   {"name": "Beef", "value": 4072}];

var svg = d3.select("svg");

var padding = 30; 
var strokeWidth = 30;

var waterScale = d3.scaleLinear().domain([0, 4500]).range([graphY, graphY + graphSize]);
var produceScale = d3.scaleLinear().domain([0, waterKG.length+1]).range([graphX + graphSize, graphX]);
var colorScale = d3.scaleLinear().domain([0,4200]).range(["#b3f4ef", "#1d20e2"]);

top = d3.axisTop(produceScale).tickFormat("");

right = d3.axisRight(waterScale).ticks(5);

// svg.append("g")
// .attr("class", "grid")
// .call(d3.axisBottom(produceScale).tickFormat("").tickSize(-graphSize))
// .attr("transform", "translate(0, " + (graphY + graphSize) + ")");

svg.append("g")
.attr("class", "grid")
.call(d3.axisRight(waterScale).tickFormat("").tickSize(-graphSize))
.attr("transform", "translate("+ produceScale.range()[0] + ", 0)");

svg.append("g")
.call(right)
.attr("transform", "translate(" + produceScale.range()[0]  + ", 0)");

waterKG.forEach(function (d, i) {

	svg.append("line")
	.attr("x1", produceScale(i+1)) 
	.attr("y1", waterScale(0)) 
	.attr("x2", produceScale(i+1)) 
	.attr("y2", waterScale(d.value))
	.style("stroke", vertGrad("grad-cows", ["#b3f4ef", "#ffffff"]))
	.style("stroke-width", strokeWidth);

	svg.append("image")
  	.attr("href", "img/" + d.name + ".svg")
  	.attr("height", "30px")
  	.attr("width", "30px")
  	.attr("x", produceScale(i+1)-strokeWidth/2)
  	.attr("y", graphY - strokeWidth * 1.5);

});

svg.append("g").call(top)
.attr("transform", "translate(0, "+ graphY +")");

svg.append("text")
.attr("class","centered-text")
.text("Gallons to produce 1 KG")
.attr("x", graphX + graphSize/2)
.attr("y", graphY + graphSize + 50)
.attr("font-size", "18px");


