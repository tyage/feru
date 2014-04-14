var convert = function() {
  Smoothing.prototype.myFiltering = function(max) {
    var result = this.src;
    colors = [];

    for (var y = 0; y < this.src.height; y++) {
      for (var x = 0; x < this.src.width; x++) {
        var pixel = this.src.getPixel(x, y);
        var R = pixel.R;
        var G = pixel.G;
        var B = pixel.B;
        var newColor = true;
        var currentMax = max;
        var k;
        for (var i=0,l=colors.length;i<l;++i) {
          var c = colors[i];
          var distance = Math.pow(c.R-R,2)+Math.pow(c.G-G,2)+Math.pow(c.B-B,2);
          if (distance < currentMax) {
            newColor = false;
            R = c.R;
            G = c.G;
            B = c.B;
            currentMax = distance;
            k = i;
          }
        }
        if (newColor) {
          colors.push({
            R: R,
            G: G,
            B: B,
            i: 0
          });
        } else {
          colors[k].i++;
          colors[k].R = (colors[k].R+R)/2;
          colors[k].G = (colors[k].G+G)/2;
          colors[k].B = (colors[k].B+B)/2;
        }

        result.setPixel(x, y, R, G, B);
      }
    }
    return result;
  };

  var loader = new ImageLoader("myCanvas", "image");
  var img = loader.loadImage(3);

  var smooth = new Smoothing(img);
  var result = smooth.myFiltering(5000);

  loader.saveImage(result);
  $("#image").attr("src", $('#myCanvas').get(0).toDataURL());

  setTimeout(function() {
    convert2();
  }, 500);
};

var convert2 = function() {
  goMedian();
  $("#image").attr("src", $('#myCanvas').get(0).toDataURL());
  setTimeout(function() {
    convert3()
  }, 500)
};

var convert3 = function() {
  Smoothing.prototype.getEdges = function() {
    var result = this.src;
    var edgeGroups = [];
    var isEdge = [];
    var src = this.src;
    var checkEdge = function(x, y) {
      var pixel = src.getPixel(x, y);
      if (!pixel) {
        return false;
      }
      var R = pixel.R;
      var G = pixel.G;
      var B = pixel.B;
      var otherPixels = [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]];
      for (var i=0,l=otherPixels.length;i<l;++i) {
        var p = src.getPixel(x+otherPixels[i][0],y+otherPixels[i][1]);
        if (p && (R != p.R || G != p.G || B != p.B)) {
          return true;
        }
      }
      return false;
    };
    var checkEdges = function(x, y, group, pixel) {
      var p = src.getPixel(x, y);
      if (!p || isEdge[y][x] !== undefined || pixel.R != p.R || pixel.G != p.G || pixel.B != 
p.B) {
        return;
      }
    
      if (isEdge[y][x] = checkEdge(x, y)) {
        group.push([x, y]);
        setTimeout(function() {
          x > 0 &&checkEdges(x-1, y, group, pixel);
          checkEdges(x+1, y, group, pixel);
          y > 0 && checkEdges(x, y-1, group, pixel); 
          checkEdges(x, y+1, group, pixel);
        },10);
      }
    }

    for (var y = 0; y < this.src.height+3; y++) {
      isEdge[y] = [];
      for (var x = 0; x < this.src.width+3; x++) {
        isEdge[y][x] = undefined;
      }
    }

    for (var y = 0; y < this.src.height; y++) {
      for (var x = 0; x < this.src.width; x++) {
        if (isEdge[y][x]) {
          continue;
        }

        if (isEdge[y][x] = checkEdge(x, y)) {
          var pixel = this.src.getPixel(x, y);
          var group = [[x, y]];
          edgeGroups.push(group);
        
          checkEdges(x+1, y, group, pixel);
          checkEdges(x, y+1, group, pixel);
        }
      }
    }
    return edgeGroups;
  };

  var loader = new ImageLoader("myCanvas", "image");
  var img = loader.loadImage(3);

  var smooth = new Smoothing(img);
  var result = smooth.getEdges();
  for (var i=0,l=result.length;i<l;i++) {
    var r=result[i];
    for (var j=0,m=r.length;j<m;j++) {
      var p = r[j];
      smooth.src.setPixel(p[0], p[1],0,0,0);
    }
  }
  loader.saveImage(smooth.src);

  $("<img>").attr("src", $("#myCanvas").get(0).toDataURL()).appendTo("#images");
};
