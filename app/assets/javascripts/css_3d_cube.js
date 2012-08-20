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
var camZ = 200;

var active = 0;
var lastX;
var lastY;
var lastZ;
var $controller;

function build_texture()
{
  initCss3dStyle();
  copyImage("#side1", 'translateZ(-141px)');
  copyImage("#side2", 'rotateY(-90deg) translateZ(-141px)');
  copyImage("#side3", 'rotateY(180deg) translateZ(-141px)');
  copyImage("#side4", 'rotateY(90deg) translateZ(-141px)');
  copyImage("#side5", 'rotateX(-90deg) translateZ(-141px)');
  copyImage("#side6", 'rotateX(90deg) translateZ(-141px)');
}

function initCss3dStyle()
{
  $('#controller')
    .css('transform', '1000px');
  $('#container')
    .css('transform-style', 'preserve-3d')
    .css('perspective', '200');
  $('#cube')
    .css('transform-style', 'preserve-3d')
    .css('transform', 'translateZ(200px)');
  $('.side')
    .css('backface-visibility', 'hidden');
  $('#loading')
    .css('border-radius', '8px');
}

function copyImage(dst, transform)
{
  $(dst).css('transform', transform);
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

function doRotate(lastX, lastY, curX, curY, wheelDelta)
{
  var $e = $('#cube');
  var $c = $('#container');
  if ($e.size()==0) { return; }

  rotY -= (curX - lastX) * 0.25;
  rotX += (curY - lastY) * 0.25;
  rotX = Math.max(-88, Math.min(88, rotX));
  camZ += wheelDelta;

  var transform_style = "translateZ(" + Math.floor(camZ) + "px) rotateX(" + Math.floor(rotX) + "deg) rotateY(" + Math.floor(rotY) + "deg)";
  $e.css('transform', transform_style);
  $c.css('perspective', Math.floor(camZ) +'px');
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
