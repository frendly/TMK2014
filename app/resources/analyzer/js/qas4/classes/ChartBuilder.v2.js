var _TEST = [];

function ChartBuilder(myDivId, myConfigHandler, myDataHandler, myGuiBuilder) { 
    this.divId = myDivId;
    this.configHandler = myConfigHandler;
    this.dataHandler = myDataHandler;
    this.guiBuilder = myGuiBuilder;

    this.chartObject;
    this.chartOptions;

    this.buildChartToStatus = function() {
	this.resetChartOptions();
	this.loadBasicChartOptions();
	if (this.configHandler.isStatus('lineChartAbsolute')) {
	    this.addLineChartChartOptions();
	    this.addLineChartAbsoluteDataToChartOptions();
	} else if (this.configHandler.isStatus('lineChartRelative')) {
	    this.addLineChartChartOptions();
	    this.addLineChartRelativeDataToChartOptions();
	} else if (this.configHandler.isStatus('barChartAbsoluteYearGrouped')) {
	    this.addBarChartChartOptions();
	    this.addBarChartAbsoluteYearGroupedDataToChartOptions();
	} else if (this.configHandler.isStatus('barChartRelativeYearGrouped')) {
	    this.addBarChartChartOptions();
	    this.addBarChartRelativeYearGroupedDataToChartOptions();
	} else if (this.configHandler.isStatus('barChartAbsoluteItemGrouped')) {
	    this.addBarChartChartOptions();
	    this.addBarChartAbsoluteItemGroupedDataToChartOptions();
	} else if (this.configHandler.isStatus('barChartRelativeItemGrouped')) {
	    this.addBarChartChartOptions();
	    this.addBarChartRelativeItemGroupedDataToChartOptions();
	} 

	this.addChartStyleFromConfig();
	this.buildChartObjectByChartOptions();
    };

    this.resetChartOptions = function() {
	this.chartOptions = {};
    }

    this.buildChartObjectByChartOptions = function() {
	  if(this.chartOptions.series.length == 0 || this.hasSeriesNoValues()) {
		this.showError();
	  } else {
		if (this.chartObject) {
		  this.chartObject.destroy();
		}
		var legendHeight = (this.chartOptions.series.length * (18)) + (2 * 18);
		this.chartOptions.chart.margin[2] = this.chartOptions.chart.margin[2] + legendHeight;
		this.chartObject = new Highcharts.Chart(this.chartOptions);
      }
	}
	
	this.hasSeriesNoValues = function() {
	  for(var i = 0; i < this.chartOptions.series.length; i++) {
		for(var j = 0; j < this.chartOptions.series[i].data.length; j++) {
		  if (this.chartOptions.series[i].data[j] && this.chartOptions.series[i].data[j].y != null) {
			return false;
		  }
		}
	  }
	  return true;
	}

    this.loadBasicChartOptions = function() {
	$.extend(true, this.chartOptions,
		 {
		     chart: {
			  renderTo: this.guiBuilder.chartContainerDivObject[0],
			  width: null,
			  height:Math.floor(this.guiBuilder.contentDivObject.width()/4*3),
			  margin:this.getChartMarginsByChartType(),
				ignoreHiddenSeries: false
		     },
		     title: {text: null},
		     legend: {
			  layout: 'vertical',
			  align: 'center',
			  verticalAlign: 'bottom',
			  x: 15,
			  y: 0,
			  borderWidth: 0,
			  labelFormatter:function() {
				  return this.options.legendLabelText;
			  },
				useHTML: true,
				itemStyle: {
					display: 'block',
					height: '18px',
					lineHeight: '18px'
				}
			 },
			exporting: {
			  enabled: false
			},
			credits: {
				enabled: false
			}
		 });
    }
	
	this.printChart = function (options) {
	  var newOptions = this.chartOptions;
	  if (options) {
		this.chartObject.destroy();
		$.extend(true, newOptions, options);
		
		$.extend(true, newOptions, {
		  plotOptions: {
			  series: {
				  animation: false
			  }
		  }
		});
		
		this.chartObject = new Highcharts.Chart(newOptions);
		
		this.chartObject.print();
		setTimeout(function() {
		  var chartBuilder = qas4[divId].guiBuilder.chartBuilder;
		  if (chartBuilder.chartObject) {
			chartBuilder.buildChartToStatus();
		  }
		}, 1001);
	  }
	}
    
    this.addLineChartChartOptions = function() {
	$.extend(true, this.chartOptions,
		 {
		     chart: {
			 defaultSeriesType: 'line'
		     },
		     xAxis: {categories: this.dataHandler.getActiveColHeaders(true)},
		     plotOptions: {
			 series: {
			     marker: {
				 enabled: true,
				 symbol: 'circle'
			     }
			 }
		     },
		     tooltip: {
			  useHTML: true,
			  style: {whiteSpace: 'normal'},
			  formatter: function() {
				  return '<b>'+ this.series.options.legendLabelText +'</b>' +
						  this.series.options.footnote + '<br/>'+this.x +': '+ this.point.yString+ ' ' +this.series.options.unit  + this.point.footnote;
			  }
		     }
		 });
    }

    this.addLineChartAbsoluteDataToChartOptions = function() {
		$.extend(true, this.chartOptions,
		 {
		     yAxis: this.getYAxis(),
		     series: this.dataHandler.getActiveDataSeries()
		 });
    }

    this.addLineChartRelativeDataToChartOptions = function() {
		$.extend(true, this.chartOptions,
		 {
		     yAxis: this.getRelativeYAxis(),
		     series: this.dataHandler.getRelativeActiveDataSeries()
		 });
    }


    this.addChartStyleFromConfig = function() {
	$.extend(true, this.chartOptions, this.configHandler.getConfig().chartTheme);
    }

    this.addBarChartChartOptions = function () {
	$.extend(true, this.chartOptions,
		 {
		     chart: {
			 defaultSeriesType: 'column'
		     }
		 });
    }

    this.addBarChartAbsoluteYearGroupedDataToChartOptions = function () {
	$.extend(true, this.chartOptions,
		 {
		     xAxis: {categories: this.dataHandler.getActiveColHeaders(true)},
		     yAxis: this.getYAxis(),
		     series: this.dataHandler.getActiveDataSeries(),
		     tooltip: {
			  useHTML: true,
			  style: {whiteSpace: 'normal'},
			  formatter: function() {
				  return '<b>'+ this.series.options.legendLabelText +'</b>' +
						 this.series.options.footnote + '<br/>'+this.x +': '+ this.point.yString + ' ' +this.series.options.unit  + this.point.footnote;
			  }
		     }
		 });
    }

    this.addBarChartRelativeYearGroupedDataToChartOptions = function () {
	$.extend(true, this.chartOptions,
		 {
		     xAxis: {categories: this.dataHandler.getActiveColHeaders(true)},
		     yAxis: this.getRelativeYAxis(),
		     series: this.dataHandler.getRelativeActiveDataSeries(),
		     tooltip: {
			  useHTML: true,
			  style: {whiteSpace: 'normal'},
			  formatter: function() {
				  return '<b>'+ this.series.options.legendLabelText +'</b>' +
						 this.series.options.footnote + '<br/>'+this.x +': '+ this.point.yString + ' %'  + this.point.footnote;
			  }
		     }
		 });
    }

    this.addBarChartAbsoluteItemGroupedDataToChartOptions = function () {
	$.extend(true, this.chartOptions,
		 {
		     xAxis: {categories: this.dataHandler.getActiveRowHeaders(),
					 labels: {
						formatter: function() {
							var catCount = qas4[divId].guiBuilder.chartBuilder.chartOptions.xAxis.categories.length;
							if (catCount <= 5 && this.value.length > 15) {
								this.value = this.value.substr(0, 13) + '...';
							} else if (catCount > 5) {
								this.value = '';
							}
							return this.value;
						}
					 }
					},
		     yAxis: this.getYAxis(),
		     series: this.dataHandler.getActiveDataSeriesGroupedByItems(),
		     tooltip: {
			  useHTML: true,
			  style: {whiteSpace: 'normal'},
			  formatter: function() {
				  return '<b>'+ this.series.options.legendLabelText +'</b>' +
						 this.series.options.footnote + '<br/>'+this.x +': '+ this.point.yString+ '' +this.point.options.unit  + this.point.footnote;
			  }
		     }
		 });

    }

    this.addBarChartRelativeItemGroupedDataToChartOptions = function () {
	$.extend(true, this.chartOptions,
		 {
		     xAxis: {categories: this.dataHandler.getActiveRowHeaders(),
					 labels: {
						formatter: function() {
							var catCount = qas4[divId].guiBuilder.chartBuilder.chartOptions.xAxis.categories.length;
							if (catCount <= 5 && this.value.length > 15) {
								this.value = this.value.substr(0, 13) + '...';
							} else if (catCount > 5) {
								this.value = '';
							}
							return this.value;
						}
					 }
					},
		     yAxis: this.getRelativeYAxis(),
		     series: this.dataHandler.getRelativeActiveDataSeriesGroupedByItems(),
		     tooltip: {
			  useHTML: true,
			  style: {whiteSpace: 'normal'},
			  formatter: function() {
				  return '<b>'+ this.series.options.legendLabelText +'</b>' +
						 this.series.options.footnote + '<br/>'+this.x +': '+ this.point.yString+ '%'  + this.point.footnote;
			  }
		     }
		 });

    }

    this.getRelativeYAxis = function() {
	return [{
		title:{text:'%'},
		offset:0
	    }];
    }

    this.getYAxis = function() {
	var units = this.dataHandler.getUnitsForActiveComparisonKeys();
	if (units.length == 1) {
	    return this.getSingleYAxisForUnit(units[0]);
	} else if (units.length == 2) {
	    return this.getDualYAxisForUnits(units);
	} else {
	    return this.getMultipleYAxisForUnits(units);
	}

    }

    this.getSingleYAxisForUnit = function(unit) {
	return this.getMultipleYAxisForUnits([unit]);
    }

    this.getDualYAxisForUnits = function(units) {
	var result = this.getMultipleYAxisForUnits(units);
	result[1].opposite=true;
	result[1].offset = 0;
	return result;
    }
    
    this.getMultipleYAxisForUnits = function(units) {
	var result = [];
	for (var i = 0; i < units.length; i++) {
	    result.push({
		    title: {
		        text:units[i]
			    },
			offset : i*this.getSingleAxisWidth(),
			labels: {
				formatter: function() {
					if (location.href.indexOf('_de\.html') >= 0) {
						return Highcharts.numberFormat(this.value, 2, ',', '.');
					} else {
						return Highcharts.numberFormat(this.value, 2, '.', ',');
					}
				}
			}
			});
	}
	return result;
    }

    this.getChartMarginsByChartType = function() {
	if (this.configHandler.isStatusForRelativeChart()) {
	    return [20,0,28,this.getSingleAxisWidth()];
	} else {
	    return [20,this.getRightMarginByYAxis(),28,this.getLeftMarginByYAxis()];
	}
    }

    this.getLeftMarginByYAxis = function() {
	if (this.getYAxis().length == 2) {
	    return this.getSingleAxisWidth();
	} else {
	    return ((this.getYAxis().length)*this.getSingleAxisWidth());
	}
    }

    this.getRightMarginByYAxis = function() {
	if (this.getYAxis().length == 2) {
	    return this.getSingleAxisWidth();
	} else {
	    return 0;
	}
    }

    this.getSingleAxisWidth = function() {return 70;}

	this.showError = function() {
		var warningObject = $('<p></p>');
		warningObject.addClass('noChart');
		warningObject.css({"text-align":"center"});
		warningObject.append(this.configHandler.getText('canNotGenerateChartWarning'))
	    warningObject.css(this.configHandler.getConfig().dialogBox.warningsCss);
		if (this.configHandler.getConfig().dialogBox.warningsCss3) {
		  this.guiBuilder.addCss3Styles(warningObject, this.configHandler.getConfig().dialogBox.warningsCss3);
		}
	    $('.chartContainer').html(warningObject);
	}

}
