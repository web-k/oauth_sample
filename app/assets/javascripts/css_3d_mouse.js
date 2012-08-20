$(function(){
  $("#rotation").attr('checked',false);
  init();
});

function init()
{
  build_texture();

  $controller = $("#controller");
  $controller.mousewheel(moveWheel);
  $controller.mousedown(startDrag);
  $controller.mousemove(moveDrag);
  $controller.mouseup(endDrag);
  $controller.mouseout(endDrag);

  if(checksupport()) {
    $("#loading").remove();
    doRotate(0, 0, 0, 0, 0);
  } else {
    $("#loading").text("CSS/3D is not supported.");
  }
}