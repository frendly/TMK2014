function ConfigHandler(myConfigFileName) {
    this.config = {};

    this.addConfig = function(myUrl) {
	this.addConfigTo(myUrl, this.config);
    }

    this.addSingleOrMultipleConfigFromPath = function(path, configFilenameArrayOrString) {
	return this.addSingleOrMultipleConfigFromPathTo(path, configFilenameArrayOrString, this.config);
    }

    this.addConfigTo = function(myUrl, whereTo) {
	$.extend(true, whereTo, this.loadConfigFile(myUrl));
    }

    this.addSingleOrMultipleConfigFromPathTo = function(myPath, configFilenameArrayOrString, whereTo) {
	if ($.isArray(configFilenameArrayOrString)) {
	    for (var i = 0; i < configFilenameArrayOrString.length; i++) {
		this.addConfigTo(myPath+configFilenameArrayOrString[i], whereTo);
	    }
	} else {
	    this.addConfigTo(myPath+configFilenameArrayOrString, whereTo);
	}
    }

    this.doChartThemeOptionsYAxisUglyHack = function(oldYAxisConfig) {
			if (!$.isArray(oldYAxisConfig)) {
					newYAxisConfig = [];
					for (var i = 0; i < 20; i++) {
						newYAxisConfig.push (oldYAxisConfig);
					}
					return newYAxisConfig;
			} else {
					return oldYAxisConfig;
			}
    }

    this.addChartThemeConfig = function() {
	this.config.chartTheme = {};
	this.addSingleOrMultipleConfigFromPathTo(this.config.chartThemePath,this.config.chartThemeFile, this.config.chartTheme)
	this.config.chartTheme.yAxis = this.doChartThemeOptionsYAxisUglyHack(this.config.chartTheme.yAxis);
    }

    this.loadConfigFile = function(myUrl) {
	var config = null;
	$.ajax({
	    url: myUrl,
	    dataType: 'text',
	    async: false,
	    success : function(data) {
		    config = eval('('+data+')');
	    }
	});
	return config;
    }

    this.getConfig = function() {
	return this.config;
    }

    /*CONSTRUCTOR*/
    /* load global config */
    this.addConfig("config.json");

    /* add site config */
    this.addConfig(this.config.configPath+checkFileName(myConfigFileName));

    /* add style config */
    this.addSingleOrMultipleConfigFromPath(this.config.stylePath,this.config.styleFile);

    /* add chart style config */
    this.addChartThemeConfig();

    /* add language config */
    this.addSingleOrMultipleConfigFromPath(this.config.languagePath,this.config.languageFile);

    this.status = null;
    this.setStatus = function(myStatus) {
	this.status = myStatus;
    }

    this.getStatus = function() {
	return this.status;
    }

    this.isStatus = function(myStatus) {
	return (this.status == myStatus);
    }

    this.isStatusForBarChart = function() {
	return (
		   this.isStatus('barChartAbsoluteYearGrouped')
		|| this.isStatus('barChartRelativeYearGrouped')
		|| this.isStatus('barChartAbsoluteItemGrouped')
		|| this.isStatus('barChartRelativeItemGrouped')
		|| this.isStatus('barChartDialog')
	);
    }

    this.isStatusForRelativeChart = function() {
	return(
	       this.isStatus('lineChartRelative')
	    || this.isStatus('barChartRelativeYearGrouped')
	    || this.isStatus('barChartRelativeItemGrouped')
	);
    }

    this.getText = function(key) {
	return this.getConfig().text[key];
    }

}

function checkFileName(fileName) {
    if (fileName.match(/^\w+\.\w+$/))
	{ return fileName; }
    else
	{ return "default.json"; }
}
