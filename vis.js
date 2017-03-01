function arraySum(arr){
  return arr.reduce(function(a, x){
    return a + x;
  }, 0);
}

function randomizePath(path_d, texture, randomness){
  // if you input an svg d attribute, it will output it with random texture.
  var path = svg.append("path").attr("d", path_d);
  var texture = texture || 100;
  var randomness = randomness || 1;
  var length = path.node().getTotalLength();
  var point = path.node().getPointAtLength(0);
  var points = [[point.x, point.y]];
  for(var i = length/texture; i < length; i += length/texture){
    point = path.node().getPointAtLength(i);
    points.push([point.x + Math.random()*randomness - randomness/2, point.y + Math.random()*randomness - randomness/2]);
    // svg.append("circle")
    // .attr("cx", point.x)
    // .attr("cy", point.y)
    // .attr("r", 2);
  }
  point = path.node().getPointAtLength(length);
  points.push([point.x, point.y]);
  var d = path.data([points]).attr("d", edge).attr("d");
  path.remove();
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

function MergeStream(width, splits, height, stream_margin, x_offset, y_offset){
  this.width = width > 0 ? width : arraySum(splits);
  this.splits = splits;
  this.height = height || 1000;
  this.stream_margin = stream_margin || 10;
  this.x_offset = x_offset || 0;
  this.y_offset = y_offset || 0;
  this.path = function(){
    var mid_width = this.splits.length * this.stream_margin + this.width;
    var xt = this.x_offset;
    var chords = [new Chord(xt, this.y_offset, xt, this.y_offset + this.height/16, this.width)];
    var xb = this.x_offset - (mid_width - this.width)/2 + this.stream_margin;
    for(var i = 0; i < splits.length; i++){
      chords.push(new Chord(xt, this.y_offset + this.height/16, xb, this.y_offset + this.height/2, splits[i]));
      chords.push(new Chord(xb, this.y_offset + this.height/2, xt, this.y_offset + this.height * 15/16, splits[i]));
      xt += splits[i];
      xb += splits[i] + this.stream_margin;
    }
    // xt = (mid_width - this.width)/2 + this.x_offset - this.stream_margin;
     chords.push(new Chord(this.x_offset, this.y_offset + this.height * 15/16, this.x_offset, this.y_offset + this.height, this.width));
    return chords.reduce((acc, x) => acc + " " + x.path(), "");
  }
}


function StateStream(width, splits, res_index, height, stream_margin, x_offset, y_offset){
  this.width = width > 0 ? width : arraySum(splits);
  this.splits = splits;
  this.height = height || 1000;
  this.stream_margin = stream_margin || 10;
  this.x_offset = x_offset || 0;
  this.y_offset = y_offset || 0;
  this.compute = function(){
    var mid_width = this.splits.length * this.stream_margin + this.width;
    var xt = this.x_offset ;
    var chords = [new Chord(xt, this.y_offset, xt, this.y_offset + this.height/16, this.width)];
    var out = "";
    var xb = this.x_offset - ((mid_width - this.width)/2 - this.stream_margin);
    for(var i = 0; i < splits.length; i++){
      if(i == res_index){
        out = out + (new Chord(xt, this.y_offset - 5 + this.height/16, xb, this.y_offset + this.height/2, splits[i])).path();
        out = out + " " + (new Chord(xb, this.y_offset + this.height/2, this.x_offset, this.y_offset + this.height * 15/16, splits[i], this.width)).path();
      } else {
        chords.push(new Chord(xt, this.y_offset + this.height/16, xb, this.y_offset + this.height/2, splits[i]));
      }
      xt += splits[i];
      xb += splits[i] + this.stream_margin;
    }
     out = out + " " + (new Chord(this.x_offset, this.y_offset + this.height * 15/16, this.x_offset, this.y_offset + this.height, this.width)).path();
    return [chords.reduce((acc, x) => acc + " " + x.path(), ""), out];
  }
  var comp = this.compute();
  this.path = comp[0];
  this.res = comp[1];
}
