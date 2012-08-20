$(function(){
  $("#rotation").attr('checked',false);
  init();
});

function init()
{
  build_texture();

  $controller = $("#controller");
  $controller.on("mousewheel", moveWheel);
  $controller.on("vmousedown", startDrag);
  $controller.on("vmousemove", moveDrag);
  $controller.on("vmouseup", endDrag);
  $controller.on("vmouseout", endDrag);

  var $document = $(document);
  $document.on("mousewheel", moveWheel);
  $document.on("vmousedown", startDrag);
  $document.on("vmousemove", moveDrag);
  $document.on("vmouseup", endDrag);
  $document.on("vmouseout", endDrag);
  
  if(checksupport()) {
    $("#loading").remove();
    doRotate(0, 0, 0, 0, 0);
  } else {
    $("#loading").text("CSS/3D is not supported.");
  }
}
