//requirements:

var loaded = 0;
var loaded_callback = function() { loaded++; };

var url = getScriptUrl();
var params = getQueryParameters(url.replace(/^.*\?/, ''));

var chartsLib = 'js/lib/highcharts.js';
var chartsExportLib = 'js/lib/modules/exporting.js';
var chartBuilderLib = 'js/qas4/classes/ChartBuilder.js';
var guiBuilderLib = 'js/qas4/classes/GuiBuilder.js';

if (params.v == 2) {
  chartsLib = 'js/lib/highcharts.v2.3.3.js';
  chartsExportLib = 'js/lib/modules/exporting.v2.3.3.js';
  chartBuilderLib = 'js/qas4/classes/ChartBuilder.v2.js';
}
if (params.v == 3) {
  chartsLib = 'js/lib/highcharts.v3.0.9.js';
  chartsExportLib = 'js/lib/modules/exporting.v3.0.9.js';
  chartBuilderLib = 'js/qas4/classes/ChartBuilder.v2.js';
}
if (params.v == 4) {
  chartsLib = 'js/lib/highcharts.v4.0.3.js';
  chartsExportLib = 'js/lib/modules/exporting.v4.0.3.js';
  chartBuilderLib = 'js/qas4/classes/ChartBuilder.v4.js';
}

if (params.v == 5) {
  chartsLib = 'js/lib/highcharts.v4.0.4.js';
  chartsExportLib = 'js/lib/modules/exporting.v4.0.3.js';
  chartBuilderLib = 'js/qas4/classes/ChartBuilder.v5.js';
}

if (params.v == 6) {
  chartsLib = 'js/lib/highcharts.v4.0.4.js';
  chartsExportLib = 'js/lib/modules/exporting.v4.0.3.js';
  chartBuilderLib = 'js/qas4/classes/ChartBuilder.v6.js';
  guiBuilderLib   = 'js/qas4/classes/GuiBuilder.v2.js';
}

$.getScript(chartsLib, function() {
  $.getScript(chartsExportLib, loaded_callback);
  loaded_callback();
});


var iCheckboxScript = 'js/lib/jquery.iCheckbox.js';
if($.fn.jquery.match(/1\.\d{2}\./)) {
	iCheckboxScript = 'js/lib/jquery.iCheckbox.bgpos.js';
}

$.getScript(iCheckboxScript, loaded_callback);
$.getScript('js/qas4/classes/ConfigHandler.js', loaded_callback);
$.getScript('js/qas4/classes/DataHandler.js', loaded_callback);
$.getScript(guiBuilderLib, loaded_callback);
$.getScript(chartBuilderLib, loaded_callback);
$.getScript('js/qas4/classes/TableBuilder.js', loaded_callback);
$.getScript('js/qas4/classes/QuickAnalyser4.js', loaded_callback);
$.getScript('js/qas4/statics/GuiHandler.js', loaded_callback);
$.getScript('js/qas4/statics/TableGuiHandler.js', loaded_callback);


var qas4 = [];

function buildQas4(myDivId, myConfigUrl) {
    /* loading img */
    $('#'+myDivId).css("display","none");
    $('#'+myDivId).after("<div id='_"+myDivId+"'><img src='img/loading.gif' /> </div>")
    $('#_'+myDivId).css("width","auto");
    $('#_'+myDivId).css("text-align","center");
    $('#_'+myDivId).css("padding-top","50px");

    _buildQas4(myDivId, myConfigUrl);
}

function _buildQas4(myDivId, myConfigUrl) {
  if (loaded == 11) {
	// only if all scripts have been loaded
    var myQas4 =new QuickAnalyser4(myDivId,myConfigUrl);
    qas4[myDivId] = myQas4;
    myQas4.build();
  } else {
	setTimeout("_buildQas4('"+myDivId+"', '"+myConfigUrl+"');",500);
  }
}

function getScriptUrl() {
    var scripts = document.getElementsByTagName('script');
    var element;
    var src;
    for (var i = 0; i < scripts.length; i++) {
        element = scripts[i];
        src = element.src;
        if (src && /qas4\.js/.test(src)) {
            return src;
        }
    }
    return null;
}

function getQueryParameters(query) {
    var args   = query.split('&');
    var params = {};
    var pair;
    var key;
    var value;

	function decode(string) {
        return decodeURIComponent(string || "")
            .replace('+', ' ');
    }
    for (var i = 0; i < args.length; i++) {
        pair = args[i].split('=');
        key = decode(pair[0]);
        value = decode(pair[1]);
        params[key] = value;
    }
    return params;
}

