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

function Chord(startx, starty, endx, endy, startWidth, endWidth, bend_len){
  // creates a vertical chord object from which you can pull different path strings
  // there is a vertical tangent at the endpoints so they flow together well
  startx = startx || 0;
  starty = starty;
  endx = endx;
  endy = endy;
  startWidth = startWidth || 0;
  endWidth = endWidth || startWidth;
  bend_len = bend_len || (endy - starty) / 2;
  return "M" + startx + " " + starty + " C" + startx + " " + (starty + bend_len) 
    + " " + endx + " " + (endy - bend_len) + " " + endx + " " + endy + " L" 
    + (endx + endWidth) + " " + endy + " C" + (endx + endWidth) + " " 
    + (endy - bend_len) + " " + (startx + startWidth) + " " + (starty + bend_len) 
    + " " + (startx + startWidth) + " " + starty + " L" + startx + " " + starty + " Z";
}

function mergeStream(width, splits, height, stream_margin, x_offset, y_offset){
  // splits should be {name: "...", val: ...} where the sum of all vals = width
  height = height || 1000;
  stream_margin = stream_margin || 10;
  x_offset = x_offset || 0;
  y_offset = y_offset || 0;
  var mid_width = splits.length * stream_margin + width;
  var xt = x_offset;
  var chords = [Chord(xt, y_offset, xt, y_offset + height/16, width)];
  var xb = x_offset - (mid_width - width)/2 + stream_margin;
  var result = {path: "", text: []};
  for(var i = 0; i < splits.length; i++){
    var val = splits[i].percent*width;
    result.text.push({id: splits[i].id, name: splits[i].name, x: xb + val/2, y: y_offset + height/2, val: val});
    chords.push(Chord(xt, y_offset + height/16, xb, y_offset + height/2, val));
    chords.push(Chord(xb, y_offset + height/2, xt, y_offset + height * 15/16, val));
    xt += val;
    xb += val + stream_margin;
  }
  chords.push(Chord(x_offset, y_offset + height * 15/16, x_offset, y_offset + height, width));
  result.path = chords.reduce((acc, x) => acc + " " + x, "")
  return result;
}

function SplitStream(width, splits, res_index, height, stream_margin, x_offset, y_offset){
  // splits should be {name: "...", val: ..., percent: ..., id: ...} 
  height = height || 1000;
  stream_margin = stream_margin || 10;
  x_offset = x_offset || 0;
  y_offset = y_offset || 0;

  var percent_scale = width / splits.reduce((a, x) => x.percent + a, 0);
  splits = splits.map((x) => {return {name: x.name, 
    size: x.percent * percent_scale, id: x.id, val: x.val}});
  var result = {path_fade: "", path_out: "", text: []}

  var mid_width = splits.length * stream_margin + width;
  var xt = x_offset;
  var chords = [];
  var out = "";
  var xb = x_offset - ((mid_width - width)/2 - stream_margin);
  for(var i = 0; i < splits.length; i++){
    if(i == res_index){
      out = out + Chord(xt, y_offset, xb, y_offset + height/2, splits[i].size);
      out = out + " " + Chord(xb, y_offset + height/2, x_offset, y_offset + height * 3/4, splits[i].size, width);
      result.outval = splits[i].val;
    } else {
      // We are using a radial fade so we need to place the text in a radial way
      // solution: use squish factors that are determined by inuts
      var y_squish_fac = Math.cos((xb + splits[i].size/2 - x_offset - width/2)/mid_width);
      var x_squish_fac = 1 - Math.cos((xb + splits[i].size/2 - x_offset - width/2)/mid_width);
      if(xb > x_offset + width/2) x_squish_fac *= -1;
      var text = {name: splits[i].name, x: xb + splits[i].size/2 + 60*x_squish_fac, 
        y: y_offset + height/2 - (height/2 + 50) + (height/2) * y_squish_fac};
      if(splits[i].id) text.id = splits[i].id;
      result.text.push(text);
      chords.push(Chord(xt, y_offset, xb, y_offset + height/2 , splits[i].size));
    }
    xt += splits[i].size;
    xb += splits[i].size + stream_margin;
  }
  // out = out + " " + (Chord(x_offset, y_offset + height, x_offset, y_offset + height, width));
  result.path_fade = chords.reduce((acc, x) => acc + " " + x, ""),
  result.path_out = out;
  return result;
}
