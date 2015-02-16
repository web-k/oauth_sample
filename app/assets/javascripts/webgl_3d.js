'use strict';

var rotY = 0;
var rotX = 0;
var camZ = 0;

var active = 0;
var lastX;
var lastY;
var lastZ;

var container;
var camera, scene, renderer;
var mesh;
var textureSource = null;
var textureSample = null, textureSampleCtx = null;
var tex;

var camZ_max = 1000;
var camZ_min = 100;
var camZ_max_webGL = 100;
var camZ_min_webGL = 0;

$(init);

function init()
{
  textureSource = $("#texture");
  var t = textureSource[0];
  if(t.tagName.toLowerCase()=="video") {
    // video
    if(t.readyState!=t.HAVE_ENOUGH_DATA) {
      setTimeout(init, 100);
      return;
    }
    var v = $("#controller").append('<canvas style="display:none" width="'
                                     + textureSource.width() + 'px" height="'
                                     + textureSource.height() + 'px"></canvas>');
    textureSample = $(v[0].getElementsByTagName("canvas"));
    textureSampleCtx = textureSample[0].getContext('2d');
  } else {
    // image
  } 

  var l = $("#loading");
  //init_panorama();

  $controller = $("#controller");
  $controller.on("mousewheel", moveWheel);
  $controller.on("vmousedown", startDrag);
  $controller.on("vmousemove", moveDrag);
  $controller.on("vmouseup", endDrag);
  $controller.on("vmouseout", endDrag);

  //var $document = $(document);
  //$document.on("mousewheel", moveWheel);
  //$document.on("vmousedown", startDrag);
  //$document.on("vmousemove", moveDrag);
  //$document.on("vmouseup", endDrag);
  //$document.on("vmouseout", endDrag);

  l.remove();

  set_layout();
  doRotate(0, 0, 0, 0, 0);
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
  $(".body, #container, #controller").css(image_properties);

  setTimeout(scrollTo, 100, 0, 1); //hide url bar
  init_panorama();
}

var segmentNumber = 80;
function init_panorama()
{
  container = $("#container");
  var width = container.width();
  var height = container.height();

  scene = new THREE.Scene();

  if (textureSampleCtx) {
    tex = new THREE.Texture(textureSample[0]);
  } else {
    tex = new THREE.ImageUtils.loadTexture($("#texture").attr("src"));
  }
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  var sphereGeometry = new THREE.SphereGeometry( 100, segmentNumber, segmentNumber);
  var matrix = new THREE.Matrix4().makeScale(1, 1, -1);
  sphereGeometry.applyMatrix(matrix);
  sphereGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(90 * Math.PI/180.0));

  mesh = new THREE.Mesh(sphereGeometry , new THREE.MeshBasicMaterial( { map: tex, overdraw: true } ) );
  scene.add( mesh );

  var container_max = width > height ? width : height;
  camZ = Math.floor(container_max*0.13)-73.33;
  if (camZ > camZ_max) { camZ = camZ_max; }
  if (camZ < 0.1) { camZ = 0.1;}

  camera = new THREE.PerspectiveCamera( 60, width / height, 1, 10000 );
  camera.position.z = camZ;
  camera.lookAt( scene.position );
  scene.add( camera );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( width, height );

  container[0].appendChild( renderer.domElement );

  if (textureSampleCtx) {
    animate();
  }

  setInterval(render, 300);

}

function animate()
{
  requestAnimationFrame( animate );
  textureSource[0].play();
  textureSampleCtx.drawImage(textureSource[0], 0,0);
  tex.needsUpdate = true;
  render();
}

function render()
{
  renderer.render( scene, camera );
}

function checksupport() {
  var props = ['webgl', 'experimental-webgl'];
  var c = document.createElement("canvas");
  for(var i=0; i<props.length; i++) {
    if(c.getContext(props[i])) {
      return true;
    }
  }
  return false;
} 

function startDrag(e)
{
  e.preventDefault();
  active = "mouse";
  lastX = e.clientX;
  lastY = e.clientY;
}

function moveDrag(e)
{
  e.preventDefault();
  if(active) {
    doRotate(lastX, lastY, e.clientX, e.clientY, 0);
    lastX = e.clientX;
    lastY = e.clientY;
  }
}

function endDrag(e)
{
  e.preventDefault();
  active = 0;
}

function moveWheel(e, d)
{
  e.preventDefault();
  doRotate(0, 0, 0, 0, d);
}

function doRotate(lastX, lastY, curX, curY, wheelDelta)
{
  rotY -= (curX - lastX) * 0.25;
  rotX -= (curY - lastY) * 0.25;
  rotX = Math.max(-88, Math.min(88, rotX));
  camZ += wheelDelta;

  mesh.rotation.y = Math.PI*rotY/180.0;
  mesh.rotation.x = Math.PI*rotX/180.0;
  camera.position.z = camZ;

  render();
}
