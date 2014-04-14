Smoothing.prototype.myFiltering = function(max) {
  var result = this.src,
    groupColors = [],
    pixels = [];

  for (var y = 0; y < this.src.height; y++) {
    pixels[y] = [];
    for (var x = 0; x < this.src.width; x++) {
      var pixel = this.src.getPixel(x, y);
      var R = pixel.R;
      var G = pixel.G;
      var B = pixel.B;
      var newColor = true;
      var currentMax = max;
      var group;
      var parents = [];
      x > 0 && parents.push(pixels[y][x-1]);
      y > 0 && parents.push(pixels[y-1][x]);
      x > 0 && y > 0 && parents.push(pixels[y-1][x-1]);
      for (var i=0,l=parents.length;i<l;++i) {
        var p = parents[i];
        var distance = Math.pow(p.R-R,2)+Math.pow(p.G-G,2)+Math.pow(p.B-B,2);
        if (distance < currentMax) {
          newColor = false;
          currentMax = distance;
          group = p.group;
        }
      }
      if (newColor) {
        group = groupColors.length;
        groupColors.push([]);
      }
      
      groupColors[group].push({
        R: R,
        G: G,
        B: B,
      });
      pixels[y][x] = {
        R: R,
        G: G,
        B: B,
        group: group
      };      
    }
  }
  
  for (var i=0,l=groupColors.length;i<l;++i) {
    var g = groupColors[i];
    var R = G = B = 0;
    for (var j=0,m=g.length;j<m;++j) {
      R += g[j].R/m;
      G += g[j].G/m;
      B += g[j].B/m;
    }
    groupColors[i] = {
      R: R,
      G: G,
      B: B
    };
  }
  
  for (var y = 0; y < this.src.height; y++) {
    for (var x = 0; x < this.src.width; x++) {
      var g = groupColors[pixels[y][x].group];
      result.setPixel(x, y, g.R, g.G, g.B);
    }
  }
  
  return result;
}

var loader = new ImageLoader("myCanvas", "image");
var img = loader.loadImage(3);

var smooth = new Smoothing(img);
var result = smooth.myFiltering(500);

// set
loader.saveImage(result);
document.getElementById('image').src=document.getElementById('myCanvas').toDataURL();
goMedian();
document.getElementById('image').src=document.getElementById('myCanvas').toDataURL();

// getEdge
Smoothing.prototype.getEdges = function() {
  var result = this.src;
  var edgeGroups = [];

  for (var y = 0; y < this.src.height; y++) {
    for (var x = 0; x < this.src.width; x++) {
      var pixel = this.src.getPixel(x, y);
      var R = pixel.R;
      var G = pixel.G;
      var B = pixel.B;
      var isEdge = false;
      var otherPixels = [[1,0],[-1,0],[0,1],[0,-1]];
      for (var i=0;i<4;++i) {
        var p = this.src.getPixel(x+otherPixels[i][0],y+otherPixels[i][1]);
        if (R != p.R || G != p.G || B != p.B) {
          isEdge = true;
          break;
        }
      }
      if (isEdge) {
        var pixel = {next:null,R:R,G:G,B:B};
        var parents = [];
        x > 0 && parents.push(edgeGroups[y][x-1]);
        y > 0 && parents.push(edgeGroups[y-1][x]);
        x > 0 && y > 0 && parents.push(edgeGroups[y-1][x-1]);
        for (var i=0,l=parents.length;i<l;++i) {
          var p = parents[i];
          if (p && p.R === R && p.G === G && p.B === B) {
            p.next = pixel;
          }
        }
        edgeGroups[y][x] = pixel;
      }
    }
  }
  return edgeGroups;
}
