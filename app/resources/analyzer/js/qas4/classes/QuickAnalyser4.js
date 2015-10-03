function QuickAnalyser4(myDivId, myConfigUrl) {
    this.configHandler = new ConfigHandler(myConfigUrl);
    this.dataHandler = new DataHandler(this.configHandler);
    this.guiBuilder = new GuiBuilder(myDivId, this.configHandler, this.dataHandler);
    
    this.build = function () {
	this.guiBuilder.build();
    }
}