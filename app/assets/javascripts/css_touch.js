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

var activeTouchId = 0;
var lastX;
var lastY;
var $controller;

$(function(){
  $("#rotation").attr('checked',false);
  init();
});

function init()
{
  try {
    build_texture();
  } catch(e) {
  }

  $controller = $("#controller");
  $controller.on("vmousedown", startDrag);
  $controller.on("vmousemove", moveDrag);
  $controller.on("vmouseup", endDrag);
  $controller.on("vmouseout", endDrag);

  var $document = $(document);
  $document.on("vmousedown", startDrag);
  $document.on("vmousemove", moveDrag);
  $document.on("vmouseup", endDrag);
  $document.on("vmouseout", endDrag);
  
  $("#loading").remove();
}

function build_texture()
{
  copyImage("#side1", 0, 0);
  copyImage("#side2", 1, 0);
  copyImage("#side3", 2, 0);
  copyImage("#side4", 0, 1);
  copyImage("#side5", 1, 1);
  copyImage("#side6", 2, 1);
}

function copyImage(dst, x, y)
{
  var ctx = $("#controller")[0].getContext("2d");
  var src = $(dst)[0];
  ctx.drawImage(src, x*512, y*512, 512, 512, 0, 0, 283, 283);
}

function startDrag(e)
{
  if (!in_area(e.clientX, e.clientY)) { return; }
  e.preventDefault();
  window.console.log(e.type + ": " + e.clientX + ", " + e.clientY);
  activeTouchId = "mouse";
  lastX = e.clientX;
  lastY = e.clientY;
}

function moveDrag(e)
{
  if (!in_area(e.clientX, e.clientY)) { return; }
  e.preventDefault();
  if(activeTouchId) {
    window.console.log(e.type + ": " + e.clientX + ", " + e.clientY);
    rotateByTouch(lastX, lastY, e.clientX, e.clientY);
    lastX = e.clientX;
    lastY = e.clientY;
  }
}

function endDrag(e)
{
  if (!in_area(e.clientX, e.clientY)) { return; }
  e.preventDefault();
  window.console.log(e.type + ": " + e.target.id);
  activeTouchId = 0;
}

function in_area(x,y)
{
  var c_x = $controller.offset().left;
  var c_y = $controller.offset().top;
  var c_w = $controller.width();
  var c_h = $controller.height();
  return ((c_x<=x && x<=c_x+c_w) && (c_y<=y && y<=c_y+c_h))
}

function rotateByTouch(lastX, lastY, curX, curY)
{
  var $e = $('#cube');
  if ($e.size()==0) { return; }

  rotY -= (curX - lastX) * 0.25;
  rotX += (curY - lastY) * 0.25;
  rotX = Math.max(-88, Math.min(88, rotX));

  var transform_style = 'translateZ(200px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
  $e.css('-webkit-transform', transform_style);
}

function hideUrlBar()
{
  setTimeout(function () { window.scrollTo(0, 1) }, 100);
}

var autoRotationTimeoutID;
function autoRotation()
{
    var moveX = parseInt(1);
    rotateByTouch(0, 0, moveX, 0);
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
