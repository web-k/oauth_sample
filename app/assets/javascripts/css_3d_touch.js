$(function(){
  resize_css_3d();
});
$(window).load(function(){
  $("#rotation").attr('checked',false);
  init();
});

function init()
{
  if(checksupport()) {
    $("#loading").remove();
    doRotate(0, 0, 0, 0, 0);
  } else {
    $("#loading").text("CSS/3D is not supported.");
  }

  build_texture();
  controll_on();

  $(window).bind("resize", set_layout);
  setTimeout(scrollTo, 100, 0, 1); //hide url bar
}

function controll_on() {
  $controller = $("#controller");
  $controller.on("mousewheel", moveWheel);
  $controller.on("vmousedown", startDrag);
  $controller.on("vmousemove", moveDrag);
  $controller.on("vmouseup", endDrag);
  $controller.on("vmouseout", endDrag);
  $controller.on("tap", tap);

  var $document = $(document);
  $document.on("mousewheel", moveWheel);
  $document.on("vmousedown", startDrag);
  $document.on("vmousemove", moveDrag);
  $document.on("vmouseup", endDrag);
  $document.on("vmouseout", endDrag);
  $document.on("tap", tap);
}

function resize_css_3d() {
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
  $(".body, #container, #cube, #controller, #loading").css(image_properties);
  var $loading_text = $("#loading p");
  $loading_text.css('margin-top', ((image_height-$loading_text.height())/2)+'px');
}

function set_layout()
{
  resize_css_3d();
  build_texture();
}
