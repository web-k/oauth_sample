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

function init()
{
  var e = document.getElementById("controller");
  try {
    build_texture();
  } catch(e) {
  }
  if (hasTouchEvent()) {
    // hideUrlBar();
    //  touch events!
    e.addEventListener("touchstart", startTouch, false);
    e.addEventListener("touchmove", moveTouch, false);
    e.addEventListener("touchend", endTouch, false);
    e.addEventListener("touchcancel", cancelTouch, false);
    document.addEventListener("touchstart", startTouch, false);
    document.addEventListener("touchmove", moveTouch, false);
    document.addEventListener("touchend", endTouch, false);
    document.addEventListener("touchcancel", cancelTouch, false);

    e.addEventListener("gesturestart", stubOut, false);
    e.addEventListener("gesturechanged", stubOut, false);
    document.addEventListener("gesturestart", stubOut, false);
    document.addEventListener("gesturechanged", stubOut, false);
  } else {
    e.addEventListener("mousedown", startDrag, false);
    e.addEventListener("mousemove", moveDrag, false);
    e.addEventListener("mouseup", endDrag, false);
    e.addEventListener("mouseout", endDrag, false);
    document.addEventListener("mousedown", startDrag, false);
    document.addEventListener("mousemove", moveDrag, false);
    document.addEventListener("mouseup", endDrag, false);
    document.addEventListener("mouseout", endDrag, false);
  }
  
  var loadingE = document.getElementById("loading");
  loadingE.parentNode.removeChild(loadingE);
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
  var ctx = $(dst)[0].getContext("2d");
  var src = $("#texture")[0];
  ctx.drawImage(src, x*512, y*512, 512, 512, 0, 0, 283, 283);
}

function startDrag(e)
{
  e.preventDefault();
  window.console.log(e.type + ": " + e.clientX + ", " + e.clientY);
  activeTouchId = "mouse";
  lastX = e.clientX;
  lastY = e.clientY;
}

function moveDrag(e)
{
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
  e.preventDefault();
  window.console.log(e.type + ": " + e.target.id);
  activeTouchId = 0;
}


function startTouch(e)
{
  e.preventDefault();
  //  take the first touch
  activeTouchId = e.changedTouches[0].identifier;
  lastX = e.changedTouches[0].pageX;
  lastY = e.changedTouches[0].pageY;
}


function moveTouch(e)
{
  e.preventDefault();

  if (activeTouchId) {
    //  see if the tracked finger was actually moved
    for (var i=0; i<e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier == activeTouchId) {
        //  it did move!
        var t = e.changedTouches[i];
        rotateByTouch(lastX, lastY, t.pageX, t.pageY);
        lastX = t.pageX;
        lastY = t.pageY;
        break;  //  stop searching
      }
    }
  }
}


function endTouch(e)
{
  e.preventDefault();

  if (activeTouchId) {
    //  see if the tracked finger was actually lifted
    for (var i=0; i<e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier == activeTouchId) {
        //  yup
        activeTouchId = 0;  //  stop following it
        break;  //  stop searching
      }
    }
  }    
}


function cancelTouch(e)
{
  activeTouchId = 0;
}


function rotateByTouch(lastX, lastY, curX, curY)
{
  var e = document.getElementById('cube');
  if ( ! e)
    return;

  rotY -= (curX - lastX) * 0.25;
  rotX += (curY - lastY) * 0.25;
  rotX = Math.max(-88, Math.min(88, rotX));

  e.style.webkitTransform = 'translateZ(200px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
}

function stubOut(e)
{
  e.preventDefault();
}

function hasTouchEvent()
{
  if (document && document.createEvent) {
    try {
      document.createEvent('TouchEvent');
      return true;
    }
    catch (e) {
        //  silently fail
    }
  }
  return false;
}


function hideUrlBar()
{
  setTimeout(function () { window.scrollTo(0, 1) }, 100);
}
