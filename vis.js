function arraySum(arr){
  return arr.reduce(function(a, x){
    return a + x;
  }, 0);
}

var defs = d3.select("svg").append("defs");

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

var rand_data = function(num, size) {
  var res = [];
  for(var i = 0; i < num; i++){
    res.push(Math.random());
  }
  var scale = size / res.reduce((a, x) => a + x, 0);
  return res.map((x) => {return {name: "", percent: scale * x}});
}

function scaleLine(x, y, length, side_height, top){
  side_height = side_height || 50;
  var res = {};
  res.d = "M " + x + " " + (y - side_height/2) + " L " + x + " " + (y + side_height/2)
   + " " + x + " " + y + " " + (x + length) + " " + y + " " + (x + length) + " " + 
   (y - side_height/2) + " " + (x + length) + " " + (y + side_height/2);
   if(top) res.d = "M " + x + " " + (y - side_height) + " L " + x + " " + y + " " +
           (x + length) + " " + y + " " + (x + length) + " " + (y - side_height);
   return res;
}

function randomizePath(path_d, texture, randomness){
  // if you input an svg d attribute, it will output it with random texture.
  var path = d3.select("svg").append("path").attr("d", path_d);
  var texture = texture || 100;
  var randomness = randomness || 1;
  var length = path.node().getTotalLength();
  var point = path.node().getPointAtLength(0);
  var points = [[point.x, point.y]];
  for(var i = length/texture; i < length; i += length/texture){
    point = path.node().getPointAtLength(i);
    points.push([point.x + Math.random()*randomness - randomness/2, point.y + Math.random()*randomness - randomness/2]);
  }
  point = path.node().getPointAtLength(length);
  points.push([point.x, point.y]);
  var d = path.data([points]).attr("d", d3.curveNatural).attr("d");
  path.remove();
  // console.log(d);
  return d;
}

function Chord(startx, starty, endx, endy, startWidth, endWidth, bend_len){
  // creates a vertical chord object from which you can pull different path strings
  // there is a vertical tangent at the endpoints so they flow together well
  this.startx = startx || 0;
  this.starty = starty;
  this.endx = endx;
  this.endy = endy;
  this.startWidth = startWidth || 0;
  this.endWidth = endWidth || startWidth;
  this.bend_len = bend_len || (endy - starty) / 2;
  this.path = function(){
    return "M" + this.startx + " " + this.starty + " C" + this.startx + " " 
              + (this.starty + this.bend_len) + " " + this.endx + " " 
              + (this.endy - this.bend_len) + " " + this.endx + " " 
              + this.endy + " L" + (this.endx + this.endWidth) + " " 
              + this.endy + " C" + (this.endx + this.endWidth) + " " 
              + (this.endy - this.bend_len) + " " + (this.startx + this.startWidth) 
              + " " + (this.starty + this.bend_len) + " " 
              + (this.startx + this.startWidth) + " " + this.starty + " L" 
              + this.startx + " " + this.starty + " Z";
  }
}

function mergeStream(width, splits, height, stream_margin, x_offset, y_offset){
  // splits should be {name: "...", val: ...} where the sum of all vals = width
  height = height || 1000;
  stream_margin = stream_margin || 10;
  x_offset = x_offset || 0;
  y_offset = y_offset || 0;
  var mid_width = splits.length * stream_margin + width;
  var xt = x_offset;
  var chords = [new Chord(xt, y_offset, xt, y_offset + height/16, width)];
  var xb = x_offset - (mid_width - width)/2 + stream_margin;
  var result = {path: "", text: []};
  for(var i = 0; i < splits.length; i++){
    var val = splits[i].percent*width;
    // - 100 + (xb + val/2)*0.4
    result.text.push({id: splits[i].id, name: splits[i].name, x: xb + val/2, y: y_offset + height/2, val: val});
    chords.push(new Chord(xt, y_offset + height/16, xb, y_offset + height/2, val));
    chords.push(new Chord(xb, y_offset + height/2, xt, y_offset + height * 15/16, val));
    xt += val;
    xb += val + stream_margin;
  }
  chords.push(new Chord(x_offset, y_offset + height * 15/16, x_offset, y_offset + height, width));
  result.path = chords.reduce((acc, x) => acc + " " + x.path(), "")
  return result;
}

function SplitStream(width, states, res_index, height, stream_margin, x_offset, y_offset){
  height = height || 1000;
  stream_margin = stream_margin || 10;
  x_offset = x_offset || 0;
  y_offset = y_offset || 0;

  var percent_scale = width / states.reduce((a, x) => x.percent + a, 0);
  states = states.map((x) => {return {name: x.name, 
    size: x.percent * percent_scale, id: x.id, val: x.val}});
  var result = {path_fade: "", path_out: "", text: []}

  var mid_width = states.length * stream_margin + width;
  var xt = x_offset;
  var chords = [];
  var out = "";
  var xb = x_offset - ((mid_width - width)/2 - stream_margin);
  for(var i = 0; i < states.length; i++){
    if(i == res_index){
      out = out + (new Chord(xt, y_offset, xb, y_offset + height/2, states[i].size )).path();
      out = out + " " + (new Chord(xb, y_offset + height/2, x_offset, y_offset + height * 3/4, states[i].size, width)).path();
      result.outval = states[i].val;
    } else {
      var y_squish_fac = Math.cos(( xb + states[i].size/2 - x_offset - width/2)/mid_width);
      var x_squish_fac = 1 - Math.cos(( xb + states[i].size/2 - x_offset - width/2)/mid_width);
      if(xb > x_offset + width/2) x_squish_fac *= -1;
      var text = {name: states[i].name, x: xb + states[i].size/2 + 60*x_squish_fac, y: y_offset + height/2 - (height/2 + 50) + (height/2) * y_squish_fac};
      if(states[i].id) text.id = states[i].id;
      result.text.push(text);
      chords.push(new Chord(xt, y_offset, xb, y_offset + height/2 , states[i].size));
    }
    xt += states[i].size;
    xb += states[i].size + stream_margin;
  }
  // out = out + " " + (new Chord(x_offset, y_offset + height, x_offset, y_offset + height, width)).path();
  result.path_fade = chords.reduce((acc, x) => acc + " " + x.path(), ""),
  result.path_out = out;
  return result;
}
