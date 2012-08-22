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

  set_layout();
  $(window).bind("resize", set_layout);
}

function set_layout()
{
  var menu_space;
  var image_height;
  var image_width;

  var $html = $('html');
  var $auto_rotate_button = $('.css3_3d_transform.touch .menu');
  var $social_button = $('.menu.css_touch');

  if($html.innerHeight() < $html.innerWidth()){
    $html.addClass('landscape');
    menu_space = $auto_rotate_button.outerWidth(true);
    image_height = $html.innerHeight();
    image_width = $html.innerWidth() - menu_space;
  }else{
    $html.removeClass('landscape');
    menu_space = $auto_rotate_button.outerHeight(true) + $social_button.outerHeight(true);
    image_height = $html.innerHeight() - menu_space;
    image_width = $html.innerWidth();
  }
  var image_properties = {'height': image_height+'px', 'width': image_width+'px'};
  $(".body, #container, #cube, #controller").css(image_properties);

  setTimeout(scrollTo, 100, 0, 1); //hide url bar
  build_texture();
}
