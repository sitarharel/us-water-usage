var svg = d3.select("svg");

var stream = new MergeStream(550, [100, 200, 100, 150], 3000, 50, 200);
var statesplit = new StateStream(550, [70, 80, 50, 80, 20, 30, 50, 50, 40, 60, 20], 2, 2000, 30, 200, 3000);
var streamb = new Stream(550, [100, 75, 50, 75, 50, 100, 100], 3000, 200, 4997);


svg.append("path")
.attr("d", stream.path())
.attr("class", "chord")
.attr("fill", "url(#backgrad)");

svg.append("path")
.attr("d", statesplit.path)
.attr("class", "chord")
.attr("fill", "url(#fadeout)");

svg.append("path")
.attr("d", statesplit.res)
.attr("class", "chord")
.attr("fill", "url(#grad)");

svg.append("path")
.attr("d", streamb.path())
.attr("class", "chord")
.attr("fill", "url(#backgrad)");
