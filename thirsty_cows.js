//http://waterfootprint.org/en/water-footprint/product-water-footprint/water-footprint-crop-and-animal-products/

var graphSize = 330;
var graphY = topOfSpout + 4200;
var graphX = 840;
var barWidth = 45;

var waterKG = [{"name": "Vegetables", "value": 85}, {"name": "Fruits", "value": 254},
			   {"name": "Chicken", "value": 1142}, {"name": "Nuts", "value": 2394},  
			   {"name": "Beef", "value": 4072}];

var waterScale = d3.scaleLinear().domain([0, 4500]).range([graphY, graphY + 450]);
var produceScale = d3.scaleLinear().domain([0, waterKG.length]).range([graphX + graphSize, graphX]);
var colorScale = d3.scaleLinear().domain([0,4200]).range(["#b3f4ef", "#1d20e2"]);
var colorScale2 = d3.scaleLinear().domain([0,4200]).range(["#5084c1", "#180d9d"]);

top = d3.axisTop(produceScale).tickFormat("");
right = d3.axisRight(waterScale).ticks(5, "s");

svg.append("g")
.attr("class", "grid")
.call(d3.axisRight(waterScale).tickFormat("").tickSize(-graphSize))
.attr("transform", "translate("+ produceScale.range()[0] + ", 0)");

svg.append("g")
.call(right)
.attr("transform", "translate(" + produceScale.range()[0]  + ", 0)");

waterKG.forEach(function (d, i) {

	svg.append("rect")
	.attr("x", produceScale(i+1)) 
	.attr("y", waterScale(0)) 
	.attr("height", waterScale(d.value) - waterScale(0))
	.style("fill", vertGrad("grad-cows"+i, [colorScale2(d.value), colorScale(d.value), "#ffffff"]))
	.style("width", barWidth);

	svg.append("image")
  	.attr("href", "img/" + d.name + ".svg")
  	.attr("height", barWidth + 5)
  	.attr("width", barWidth + 5)
  	.attr("x", produceScale(i+1))
  	.attr("y", graphY - barWidth * 1.5);

});

svg.append("text")
.attr("class","centered-text")
.text("Gallons to produce 1 KG")
.attr("x", graphX + graphSize/2)
.attr("y", graphY + 500)
.attr("font-size", "18px");

