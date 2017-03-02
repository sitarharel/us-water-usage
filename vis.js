function arraySum(arr){
  return arr.reduce(function(a, x){
    return a + x;
  }, 0);
}

  var rand_data = function(num, size) {
    var res = [];
    for(var i = 0; i < num; i++){
      res.push(Math.random());
    }
    var scale = size / res.reduce((a, x) => a + x, 0);
    return res.map((x) => scale * x);
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
  this.startx = startx || 0;
  this.starty = starty;
  this.endx = endx;
  this.endy = endy;
  this.startWidth = startWidth || 0;
  this.endWidth = endWidth || startWidth;
  this.bend_len = bend_len || (endy - starty) / 2;
  this.left = function(){
    return "M" + this.startx + " " + this.starty + " C" + this.startx + " " 
              + (this.starty + this.bend_len) + " " + this.endx + " " 
              + (this.endy - this.bend_len) + " " + this.endx + " " 
              + this.endy;
  }
  this.right = function(){
    return "M" + (this.endx + this.endWidth) + " " 
              + this.endy + " C" + (this.endx + this.endWidth) + " " 
              + (this.endy - this.bend_len) + " " + (this.startx + this.startWidth) 
              + " " + (this.starty + this.bend_len) + " " 
              + (this.startx + this.startWidth) + " " + this.starty;
  }
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

function Stream(startsize, splits, height, x_offset, y_offset) {
  this.size = startsize;
  this.splits = splits;
  this.height = height || 1000;
  this.x_offset = x_offset || 100;
  this.y_offset = y_offset || 0;
  this.path = function(svg){
    var split_l = this.height / (this.splits.length + 1);
    var main_width = this.size;
    var wiggle = 30;
    var chords = [new Chord(this.x_offset, this.y_offset, this.x_offset + wiggle, this.y_offset + split_l, main_width)];
    var px = this.x_offset + wiggle;
    var py = split_l;
    for(var i = 0; i < this.splits.length; i++){
      main_width -= splits[i];
      if(wiggle < 0){
      chords.push(new Chord(px, this.y_offset + py, px + wiggle, this.y_offset + py + split_l, main_width));
      chords.push(new Chord(px + main_width, this.y_offset + py, px + main_width - wiggle, this.y_offset + py + split_l * 1.2, splits[i]));

      }else{
      chords.push(new Chord(splits[i] + px, this.y_offset + py, splits[i] + px + wiggle, this.y_offset + py + split_l, main_width));
      chords.push(new Chord(px, this.y_offset + py, px - wiggle, this.y_offset + py + split_l * 1.2, splits[i]));
      px += splits[i];
      }
      px += wiggle;
      py += split_l;
      wiggle *= -1;
    }
    return chords.reduce((acc, x) => acc + " " + x.path(), "");
  }
}

function mergeStream(width, splits, height, stream_margin, x_offset, y_offset){
  width = width > 0 ? width : arraySum(splits);
  splits = splits;
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
    result.text.push({name: splits[i].name, x: xb + splits[i].val/2, y: y_offset + height/2, val: splits[i].val});
    chords.push(new Chord(xt, y_offset + height/16, xb, y_offset + height/2, splits[i].val));
    chords.push(new Chord(xb, y_offset + height/2, xt, y_offset + height * 15/16, splits[i].val));
    xt += splits[i].val;
    xb += splits[i].val + stream_margin;
  }
  // xt = (mid_width - width)/2 + x_offset - stream_margin;
   chords.push(new Chord(x_offset, y_offset + height * 15/16, x_offset, y_offset + height, width));
  result.path = chords.reduce((acc, x) => acc + " " + x.path(), "")
  return result;
}

function StateStream(width, states, res_index, height, stream_margin, x_offset, y_offset){
  height = height || 1000;
  stream_margin = stream_margin || 10;
  x_offset = x_offset || 0;
  y_offset = y_offset || 0;
  var percent_scale = width / states.reduce((a, x) => x.percent + a, 0);
  states = states.map((x) => {return {name: x.name, percent: x.percent * percent_scale}});
  var result = {path_fade: "", path_out: "", text: []}

  var mid_width = states.length * stream_margin + width;
  var xt = x_offset;
  var chords = [new Chord(xt, y_offset - 5, xt, y_offset + height/16, width)];
  var out = "";
  var xb = x_offset - ((mid_width - width)/2 - stream_margin);
  for(var i = 0; i < states.length; i++){
    if(i == res_index){
      out = out + (new Chord(xt, y_offset - 5 + height/16, xb, y_offset + height/2, states[i].percent)).path();
      out = out + " " + (new Chord(xb, y_offset + height/2, x_offset, y_offset + height * 15/16, states[i].percent, width)).path();
    } else {
      var y_squish_fac = Math.cos(( xb + states[i].percent/2 - x_offset - width/2)/mid_width);
      var x_squish_fac = 1 - Math.cos(( xb + states[i].percent/2 - x_offset - width/2)/mid_width);
      if(xb > x_offset + width/2) x_squish_fac *= -1;
      result.text.push({name: states[i].name, x: xb + states[i].percent/2 + 90*x_squish_fac, y: y_offset + height/2 - (height/2 + 50) + (height/2) * y_squish_fac});
      chords.push(new Chord(xt, y_offset + height/16, xb, y_offset + height/2 , states[i].percent));
    }
    xt += states[i].percent;
    xb += states[i].percent + stream_margin;
  }
  out = out + " " + (new Chord(x_offset, y_offset + height * 15/16, x_offset, y_offset + height, width)).path();
  result.path_fade = chords.reduce((acc, x) => acc + " " + x.path(), ""),
  result.path_out = out;
  return result;
}