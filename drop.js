$(function(){
  var image_origin = $("#image_origin");
  image_origin.bind("load", function(){
    var width = image_origin.width(),
      height = image_origin.height();
    $("#myCanvas").remove();
    $("<canvas id='myCanvas'>").attr("width", width).attr("height", 
height).appendTo("#converting");
    convert();
  });

  $("#drop").bind("dragover", function(e){e.preventDefault();});
  $("#drop").bind("dragenter", function(e){e.preventDefault();});
  $("#drop").bind("drop", function(e) {
    e.preventDefault();
    var f = e.originalEvent.dataTransfer.files[0];
    var fr = new FileReader();
    fr.onload = function() {
      var $canvas = $("#myCanvas");
      $("#image").attr("src", fr.result);
      image_origin.attr("src", fr.result);
    };
    fr.readAsDataURL(f);
    return false;
  });
});
