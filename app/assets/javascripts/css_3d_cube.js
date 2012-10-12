/* main.js */

/*
Copyright (c) 2008-2010 wayne a. lee

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var rotY = 0;
var rotX = 0;
var camZ;

var active = 0;
var lastX;
var lastY;
var lastZ;
var $controller;
var is_css_transition_supported = false;

function build_texture()
{
  initCss3dStyle();
  buildCube();
}

function initCss3dStyle()
{
  rotY = 0;
  rotX = 0;
  lastX = 0;
  lastY = 0;
  lastZ = 0;
  var container_width = $('#container').width();
  var container_height = $('#container').height();
  var container_max = container_width > container_height ? container_width : container_height;
  var cube_size = $('.side').width();
  camZ = Math.floor(container_max*5/8);
  if (container_max-cube_size > 0) { camZ += Math.floor((container_max-cube_size)/4); }
  $('#controller')
    .css('transform', '2000px');
  $('#container')
    .css('transform-style', 'preserve-3d')
    .css('perspective', camZ);
  $('#cube')
    .css('transform-style', 'preserve-3d')
    .css('transform', 'translateZ('+camZ+'px)');
  $('.side')
    .css('backface-visibility', 'hidden')
    .css('left', Math.floor((container_width-cube_size)/2))
    .css('top', Math.floor((container_height-cube_size)/2));
  $('#loading')
    .css('border-radius', '8px');
  var p = navigator.platform;
  if (p.indexOf( "iPhone" ) > -1 || p.indexOf( "iPad" ) > -1  || p.indexOf( "iPod" ) > -1 ) { is_css_transition_supported = true; }
}

function buildCube()
{
  var z = Math.floor($('.side').width()/2)-1;
  var translate_z = 'translateZ(-'+z+'px)';
  $("#side1").css('transform', translate_z);
  $("#side2").css('transform', 'rotateY(-90deg) ' + translate_z);
  $("#side3").css('transform', 'rotateY(180deg) ' + translate_z);
  $("#side4").css('transform', 'rotateY(90deg) ' + translate_z);
  $("#side5").css('transform', 'rotateX(-90deg) ' + translate_z);
  $("#side6").css('transform', 'rotateX(90deg) ' + translate_z);
}

function startDrag(e)
{
  if (!in_area(e.pageX, e.pageY)) { return; }
  e.preventDefault();
  active = "mouse";
  lastX = e.pageX;
  lastY = e.pageY;
}

function moveDrag(e)
{
  if (!in_area(e.pageX, e.pageY)) { return; }
  e.preventDefault();
  if(active) {
    doRotate(lastX, lastY, e.pageX, e.pageY, 0);
    lastX = e.pageX;
    lastY = e.pageY;
  }
}

function endDrag(e)
{
  if (!in_area(e.pageX, e.pageY)) { return; }
  e.preventDefault();
  active = 0;
}

function moveWheel(e, d)
{
  e.preventDefault();
  doRotate(0, 0, 0, 0, d);
}

function in_area(x,y)
{
  var c_x = $controller.offset().left;
  var c_y = $controller.offset().top;
  var c_w = $controller.width();
  var c_h = $controller.height();
  return ((c_x<=x && x<=c_x+c_w) && (c_y<=y && y<=c_y+c_h))
}

function doRotate(lastX, lastY, curX, curY, wheelDelta, animate)
{
  if (typeof animate === 'undefined') { animate = false; }
  var $e = $('#cube');
  var $c = $('#container');
  if ($e.size()==0) { return; }

  rotY -= (curX - lastX) * 0.25;
  rotX += (curY - lastY) * 0.25;
  rotX = Math.max(-88, Math.min(88, rotX));
  camZ += wheelDelta;

  if (!is_css_transition_supported && wheelDelta != 0) { $c.remove(); }
  var transform_style = "translateZ(" + Math.floor(camZ) + "px) rotateX(" + Math.floor(rotX) + "deg) rotateY(" + Math.floor(rotY) + "deg)";
  if (animate && is_css_transition_supported) {
    $e.css("transition", "all 1s");
    $c.css("transition", "all 1s");
  } else if (is_css_transition_supported) {
    $e.css("transition", "none");
    $c.css("transition", "none");
  }
  $e.css("transform", transform_style);
  $c.css("perspective", Math.floor(camZ) +'px');
  if (!is_css_transition_supported && wheelDelta != 0) { $(".css3_3d_transform .body").prepend($c); }
}

function hideUrlBar()
{
  setTimeout(function () { window.scrollTo(0, 1) }, 100);
}

function checksupport()
{
  var props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
  var f = $("#cube")[0];
  for(var i=0; i<props.length; i++) {
    if(props[i] in f.style) {
      var p = props[i].replace('Perspective','');
      return p.toLowerCase();
    }
  }
  return false;
} 

var autoRotationTimeoutID;
function autoRotation()
{
    var moveX = parseInt(1);
    doRotate(0, 0, moveX, 0, 0);
    autoRotationTimeoutID = setTimeout("autoRotation()", 10);
}
function rotation_check()
{
  if( $("#rotation").attr('checked')){
    autoRotation();
  }else{
    clearTimeout(autoRotationTimeoutID);
  }
}

var tapZoomLevel = 0;
var tapZoomLevelMax = 2;
var tapZoomDelta = 150;
function tap(e)
{
  if (!in_area(e.pageX, e.pageY)) { return; }
  var delta = tapZoomDelta;
  var animate = is_css_transition_supported;
  if (tapZoomLevel == tapZoomLevelMax) {
    delta = delta * tapZoomLevel * -1;
    doRotate(0,0,0,0,delta,animate);
    tapZoomLevel = 0;
  } else {
    doRotate(0,0,0,0,delta,animate);
    tapZoomLevel += 1;
  }
  return false;
}

var pinchZoomRatio =2;
function pinch(event, property) {
  doRotate(0,0,0,0,parseInt(property.description.split(":")[1])*pinchZoomRatio);
  return false;
}
