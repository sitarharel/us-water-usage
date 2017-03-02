var svg = d3.select("svg");
var rand_data = function(num, size) {
  var res = [];
  for(var i = 0; i < num; i++){
    res.push(Math.random());
  }
  var scale = size / res.reduce((a, x) => a + x, 0);
  return res.map((x) => scale * x);
}

var stream = new MergeStream(550, rand_data(10, 550), 3000, 50, 200, 1500);
var statesplit = new StateStream(550, rand_data(50, 550), 25, 2000, 10, 200, 4500);
var streamb = new Stream(550, [100, 75, 50, 75, 50, 100, 100], 3000, 200, 6497);
var topstream = new Chord(420, 500, 200, 1500, 120, 550);





svg.append("path")
.attr("d", topstream.path())
.attr("class", "chord")
.attr("fill", "url(#grad)");

svg.append("path")
.attr("d", stream.path())
.attr("class", "chord")
.attr("fill", "url(#backgrad)");

svg.append("path")
.attr("d", statesplit.path)
.attr("class", "chord")
.attr("fill", "url(#circfadeout)");

svg.append("path")
.attr("d", statesplit.res)
.attr("class", "chord")
.attr("fill", "url(#grad)");

svg.append("path")
.attr("d", streamb.path())
.attr("class", "chord")
.attr("fill", "url(#backgrad)");

svg.append("image")
.attr("href", "tap.svg")
.attr("x", "350")
.attr("y", "0")
.attr("height", "800px")
.attr("width", "800px")

// // curveNatural
// var edge = d3.line().curve(d3.curveNatural)

// // console.log(path.attr('d'));
// svg.append("path")
//     .attr("d", 
//       randomizePath(new Chord(10, 10, 300, 1000, 100).right(), 10, 10))
//     .attr("class", "test");

// svg.append("path")
//     .attr("d", 
//       randomizePath(new Chord(10, 10, 300, 1000, 100).left(), 10, 10))
//     .attr("class", "test");

