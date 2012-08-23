$(function(){
    // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
    var swfVersionStr = "11.1.0";
    // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
    var xiSwfUrlStr = "/flash/playerProductInstall.swf";
    var flashvars = {};
    var params = {};
    params.quality = "high";
    params.bgcolor = "#ffffff";
    params.allowscriptaccess = "always";
    params.allowfullscreen = "true";
    params.wmode = "direct";
    var attributes = {};
    attributes.id = "Flash3dApplet";
    attributes.name = "Flash3dApplet";
    attributes.align = "middle";
    swfobject.embedSWF(
        "/flash/Flash3dApplet.swf", "flashContent", 
        "900", "700", 
        swfVersionStr, xiSwfUrlStr, 
        flashvars, params, attributes);
    // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
    swfobject.createCSS("#flashContent", "display:block;text-align:left;");

    setTimeout(loadImage, 3000); // TODO: swfがロードしてloadImageを読んでいいタイミングのイベントを拾う
});



function loadImage()
{
        var url = document.getElementById("urlText").value;
        document.getElementById("Flash3dApplet").loadImage(url);
}

function enableRemoveViewPoint(enable)
{
        document.getElementById("Flash3dApplet").enableRemoveViewPoint(enable);
}
function enableAddViewPoint(enable)
{
        document.getElementById("Flash3dApplet").enableAddViewPoint(enable);
}
function enableWheelControl(enable)
{
        document.getElementById("Flash3dApplet").enableWheelControl(enable);
}
function enablePins(enable)
{
        // Not Implement
// 				document.getElementById("Flash3dApplet").enablePins(enable);
}
function doWheelDelta()
{
        var delta = document.getElementById("mouseWheelDeltaText").value;
        // delta値は大きくなると、イージンの時間がかかる
        document.getElementById("Flash3dApplet").doWheelDelta(delta);
}
function addViewPoint()
{
        var name = document.getElementById("addViewPointNameText").value;
        var rH = document.getElementById("addViewPointHText").value;
        var rV = document.getElementById("addViewPointVText").value;
        var angle = document.getElementById("addViewPointAngleHText").value;
        // 注視点追加
        document.getElementById("Flash3dApplet").addViewPoint(name, rH, rV, angle);
}
function removeViewPoint()
{
        var name = document.getElementById("removeViewPointNameText").value;
        // 注視点削除
        document.getElementById("Flash3dApplet").removeViewPoint(name);
}
function getViewPoint()
{
        return document.getElementById("Flash3dApplet").getViewPoint();
}
function setViewPoint(rH, rV, angle)
{
        document.getElementById("Flash3dApplet").setViewPoint(rH, rV, angle);
}
function setViewPointByName(name)
{
        document.getElementById("Flash3dApplet").setViewPointByName(name);
}
function getViewImage(rH, rV, angle, width, height)
{
        // 指定の視点のサムネイルをPNG形式(BASE64エンコーディング)で返します。
        return document.getElementById("Flash3dApplet").getViewImage(rH, rV, angle, width, height);
}
function getViewImageByName(name)
{
        // 指定名前の視点のサムネイルをPNG形式(BASE64エンコーディング)で返します。
        return document.getElementById("Flash3dApplet").getViewImageByName(name);
}