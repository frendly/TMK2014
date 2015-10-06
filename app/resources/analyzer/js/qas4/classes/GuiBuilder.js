function GuiBuilder(myDivId, myConfigHandler, myDataHandler) {
    this.divId = myDivId;
    this.configHandler = myConfigHandler;
    this.dataHandler = myDataHandler;

    this.tableBuilder = new TableBuilder(this.divId, this.configHandler, this.dataHandler, this);
    this.chartBuilder = new ChartBuilder(this.divId, this.configHandler, this.dataHandler, this);

    /* JQuery-Objects */
    this.containerDivObject = $('#'+myDivId);
    this.headerDivObject = null;
    this.contentDivObject = null;
    this.tableContainerDivObject = null;
    this.chartContainerDivObject = null;

    this.build = function() {
	  this.addStyleFix();

	  this.prepareContainer();
	  this.buildHeaderAndContent();
	  this.fadeIn();
	  checkScrollColsRequiredAndDoEnable(this.divId);
	  checkForVisibleFootnotes(this.configHandler.getConfig());
    }

    this.addStyleFix = function() {
	  var html = '<!--[if lte IE 6]>'
			   + '<style type="text/css">'
			   + '  .piefix {behavior: url(../iefix/PIEie6.htc);}'
			   + '  table.dataTable td, table.dataTable th { position: relative; }'
			   + '  img.piefix { position: relative; }'
			   + '</style>'
			   + '<![endif]-->'
			   + '<!--[if gt IE 6]>'
			   + '<style type="text/css">.piefix {behavior: url(../iefix/PIE.htc);}</style>'
			   + '<![endif]-->'
			   + '<!--[if IE 8]>'
			   + '<style type="text/css">img.piefix { position: relative; }</style>'
			   + '<![endif]-->';
	  $('head').append(html);
    }

    this.prepareContainer = function() {
	this.containerDivObject.html("");
	this.containerDivObject.css(this.configHandler.getConfig().containerCss);
	if (this.configHandler.getConfig().containerCss3) {
	  this.addCss3Styles(this.containerDivObject, this.configHandler.getConfig().containerCss3);
	}
    }

    this.addCss3Styles = function(jQueryObject, css3ConfigJson) {
	if (css3ConfigJson.borderRadius) {
	    roundBorderCss(jQueryObject, css3ConfigJson.borderRadius);
	}
	if (css3ConfigJson.boxShadow) {
	    dropShadowCss(jQueryObject, css3ConfigJson.boxShadow);
	}
	if(css3ConfigJson.gradient) {
	    gradientCss(jQueryObject, css3ConfigJson.gradient[0], css3ConfigJson.gradient[1]);
	}
    }

    this.buildHeaderAndContent = function() {
	this.buildHeader();
	this.addMainButtons();

	this.buildContent();
	this.addEmptyHiddenChartContainer();
	this.addTable();
	this.addFootnoteTable();
    }

    this.addFootnoteTable = function() {
	if (this.configHandler.getConfig().enableGlobalFootnoteList) {
	    this.tableBuilder.getFootnoteListTableObject().appendTo(this.contentDivObject);
	}
    }

    this.buildHeader = function() {
	this.headerDivObject = $('<div>');
	this.headerDivObject.addClass('q4head');
	this.headerDivObject.css(this.configHandler.getConfig().headerCss)
	this.headerDivObject.appendTo(this.containerDivObject);
    }

    this.addMainButtons = function() {
	var divId = this.divId;

	var tableButton = this.buildMainButtonUglyHack(this.configHandler.getConfig().buttons.tableButton, this.configHandler.getConfig().text.tableButtonTitle);
	tableButton.attr('id', 'tableButton');
	var cfg = this.configHandler.getConfig().buttons.tableButton.css3;
	if (cfg) {
	  this.addCss3Styles(tableButton, cfg);
	}
	tableButton.appendTo(this.headerDivObject);

	// init table button as active
	tableButton.addClass('activeMainButton');
	tableButton.css("background", this.configHandler.getConfig().buttons.mainButtonHoverColor + " none");
	tableButton.css("position","relative");

	$('#'+divId).addClass('table');
	tableButton.click(function() {
		showTable(divId);
		$('.activeMainButton').css("background", "none").removeClass('activeMainButton');
		$(this).addClass('activeMainButton').trigger('changeActiveMainButton');
		$(this).css("background-color", qas4[divId].configHandler.getConfig().buttons.mainButtonHoverColor);
		$('#'+divId).addClass('table').removeClass('line').removeClass('bar');
		$('#exportIMGButton').hide();
	    });

	var lineChartButton = this.buildMainButtonUglyHack(this.configHandler.getConfig().buttons.lineChartButton, this.configHandler.getConfig().text.lineChartButtonTitle);
	lineChartButton.attr('id', 'lineChartButton');
	var cfg = this.configHandler.getConfig().buttons.lineChartButton.css3;
	if (cfg) {
	  this.addCss3Styles(lineChartButton, cfg);
	}
	lineChartButton.css("position","relative");
	lineChartButton.appendTo(this.headerDivObject);
	lineChartButton.click(function() {
		showLineChart(divId);
	    });

	var barChartButton = this.buildMainButtonUglyHack(this.configHandler.getConfig().buttons.barChartButton, this.configHandler.getConfig().text.barChartButtonTitle);
	barChartButton.attr('id', 'barChartButton');
	var cfg = this.configHandler.getConfig().buttons.barChartButton.css3;
	if (cfg) {
	  this.addCss3Styles(barChartButton, cfg);
	}
	barChartButton.css("position","relative");
	barChartButton.appendTo(this.headerDivObject);
	barChartButton.click(function() {
		showBarChart(divId);
	    });

	this.addButtonBar(this.headerDivObject);
    }


    this.buildMainButtonUglyHack = function(buttonObject, text) {
	var realButton = this.buildButton(buttonObject);

	realButton.attr('title', text).attr('alt', text);
	realButton.css({"background":"none", "padding":"0px", "margin":"0px"});
	var realButtonDiv = $('<div></div>');

	realButtonDiv.css({"height":"30px","width":"45px", "line-height":"40px","vertical-align":"middle", "text-align":"center"});
	realButtonDiv.append(realButton);


	var buttonDiv = $('<div></div>');
	buttonDiv.css({
		"float":"left",
		"overflow":"hidden",
		"width":"45px",
		"height":"45px",
		"text-align":"center",
		"margin-right":"20px",
		"padding":"10px",
		"line-height":"10px"
	    });

	var buttonDivText = $('<div>'+text+'</div>');
	buttonDivText.css({"width":"45px", "text-align":"center"});
	var mainButtonLabelStyle = this.configHandler.getConfig().buttons.mainButtonLabel;
	if (mainButtonLabelStyle) {
	  buttonDivText.css(mainButtonLabelStyle);
	}

	buttonDiv.append(realButtonDiv);
	buttonDiv.append($('<br/>'));
	buttonDiv.append(buttonDivText);
	var mainButtonHoverColor = this.configHandler.getConfig().buttons.mainButtonHoverColor;
	if (mainButtonHoverColor) {
	  buttonDiv.mouseenter(function() {
		$(this).css('background', qas4[divId].guiBuilder.configHandler.getConfig().buttons.mainButtonHoverColor + " none 0 0");
	  });
	  buttonDiv.mouseleave(function() {if (!$(this).hasClass('activeMainButton')) {$(this).css('background','none');}});
	}
	return buttonDiv;
    }

    this.addButtonBar = function(whereTo) {
	  var container = $('<div id="exportButtons"></div>');
	  container.css({
		      "position":"absolute",
			  "top":"0px",
			  "right":"0px"
	  });
	  var buttonBarStyle = this.configHandler.getConfig().buttonBar;
	  if (buttonBarStyle && buttonBarStyle.css) {
		container.css(buttonBarStyle.css);
	  }
	  if (buttonBarStyle && buttonBarStyle.css3) {
		this.addCss3Styles(container, buttonBarStyle.css3);
	  }

	  if (this.configHandler.getConfig().exportOptions.print) {
		var btn = this.buildExportButton(
					  this.configHandler.getConfig().buttons.exportPrintButton,
					  this.configHandler.getConfig().text.label_Print);
		btn.addClass('exportPrintButton');
		btn.click(function() {
		  var chartBuilder = qas4[divId].guiBuilder.chartBuilder;
		  if (chartBuilder.chartObject &&
			  qas4[divId].guiBuilder.chartContainerDivObject.css('display') != 'none'
		  ){
			chartBuilder.printChart(qas4[divId].guiBuilder.configHandler.getConfig().printOptions);
		  } else {
			qas4[divId].guiBuilder.printTable();
		  }
		});
		container.append(btn);
		btn.mouseenter(function() {alpha($(this), 50);} );
		btn.mouseleave(function() {alpha($(this), 100);} );
	  }
	  var imageFormats = this.configHandler.getConfig().exportOptions.image;
	  var fileName = this.configHandler.getConfig().exportXLS.file.name;
	  if (typeof imageFormats == 'string' && imageFormats.match(/(jpg|png|csv)/i)) {
		var img = imageFormats.toUpperCase();
		var btn = this.buildExportButton(
					  this.configHandler.getConfig().buttons['export' + img + 'Button'],
					  this.configHandler.getConfig().text['label_' + img + 'Export']);
		btn.addClass('export' + img + 'Button');
		btn.click(function() {
		  var img = this.className.replace(/export(\w{3})Button/gi, '$1');
		  var chartBuilder = qas4[divId].guiBuilder.chartBuilder;
		  if (chartBuilder.chartObject) {
			chartBuilder.chartObject.exportChart(
				  { 'filename': fileName, type: (img.toLowerCase() == 'pdf' ? 'application' : 'image') + '/' + img.toLowerCase(), url: "/export/" },
				  qas4[divId].guiBuilder.configHandler.getConfig().printOptions
			);
		  }
		});
		btn.mouseenter(function() {alpha($(this), 50);} );
		btn.mouseleave(function() {alpha($(this), 100);} );
		container.append(btn);
		btn.hide();
	  } else if (imageFormats.length && imageFormats.length > 0) {
		var btn = this.buildExportButton(
					  this.configHandler.getConfig().buttons['exportIMGButton'],
					  this.configHandler.getConfig().text['label_IMGExport']);
		btn.attr('id', 'exportIMGButton');
		btn.mouseenter(function() {alpha($(this), 50);} );
		btn.mouseleave(function() {alpha($(this), 100);} );
		container.append(btn);
		btn.hide();

		btn.click(function() {
		  var foldout = $('<div id="exportImageSelect"></div>');
		  foldout.hide();
		  foldout.appendTo(document.body);

		  var pos = $('#exportIMGButton img').offset();
		  for (var i = 0; i < imageFormats.length; i++) {
			var img = imageFormats[i].toUpperCase();
			var lnk = $('<a href="#" />');
			lnk.text(qas4[divId].guiBuilder.configHandler.getConfig().text['label_' + img + 'Export']);
			lnk.addClass('export' + img + 'Button');
			lnk.click(function() {
			  var img = this.className.replace(/export(\w{3})Button/gi, '$1');
			  var chartBuilder = qas4[divId].guiBuilder.chartBuilder;
			  if (chartBuilder.chartObject) {
				chartBuilder.chartObject.exportChart(
					  { 'filename': fileName, type: (img.toLowerCase() == 'pdf' ? 'application' : 'image') + '/' + img.toLowerCase(), url: "/export/" },
					  qas4[divId].guiBuilder.configHandler.getConfig().printOptions
				);
			  }
			  $(this).parent('div').hide();
			});
			lnk.css({"cursor":"pointer"});
			lnk.appendTo(foldout);
		  }
		  foldout.css({
			"position" : "absolute",
			"top"      : (pos.top + $(this).outerHeight()) + 5 + "px",
			"left"     : (pos.left) + "px"
		  });

		  var imgCfgCss = qas4[divId].guiBuilder.configHandler.getConfig().exportOptions.css;
		  if (imgCfgCss) {
			foldout.css(imgCfgCss);
		  }
		  var imgCfgCss = qas4[divId].guiBuilder.configHandler.getConfig().exportOptions.css3;
		  if (imgCfgCss) {
			qas4[divId].guiBuilder.addCss3Styles(foldout, imgCfgCss);
		  }

		  foldout.mouseenter(function() {
			  $('#exportImageSelect').clearQueue();
		  });

		  foldout.mouseleave(function() {
			  $('#exportImageSelect').delay(300).queue(function() {
				$(this).remove();
			  });
		  });

		  foldout.show();
		});
	  }

	  if (this.configHandler.getConfig().exportOptions.pdf) {
		var btn = this.buildExportButton(
					  this.configHandler.getConfig().buttons.exportPDFButton,
					  this.configHandler.getConfig().text.label_PDFFull);
		btn.addClass('exportPDFButton');
		btn.click(function() {
		  var cfg = qas4[divId].guiBuilder.configHandler.getConfig();
		  if (cfg.exportOptions.pdf) {
			window.open(cfg.exportOptions.pdf);
		  }
		});
		container.append(btn);
		btn.mouseenter(function() {alpha($(this), 50);} );
		btn.mouseleave(function() {alpha($(this), 100);} );
	  }

	  var btn = this.buildExportButton(this.configHandler.getConfig().buttons.exportXLSButton, this.configHandler.getConfig().text.label_XLSExport);
	  btn.addClass('exportXLSButton');
	  btn.click(function() {
	  	var cfg = qas4[divId].guiBuilder.configHandler.getConfig();
		  if (cfg.exportOptions.xls) {
			window.open(cfg.exportOptions.xls);
		  }
		  /*exportXLS(
			  qas4[divId].dataHandler.getActiveRows(),
			  qas4[divId].dataHandler.getActiveCols(),
			  qas4[divId].configHandler.getConfig().dataFile,
			  qas4[divId].configHandler.getConfig().styleFile
		  );*/
	  });
	  container.append(btn);
	  btn.mouseenter(function() {alpha($(this), 50);} );
	  btn.mouseleave(function() {alpha($(this), 100);} );
	  container.appendTo(whereTo);
	  whereTo.css({"position":"relative"});




	  // absRelButtons
      if(this.configHandler.getConfig().absoluteRelativeTabs) {
		var absRelButtonUL = $('<ul id="absRelButtons" style="display: none"></ul>');
		absRelButtonUL.css(this.configHandler.getConfig().absoluteRelativeTabs.ulCss);

		var absButtonLI = $('<li id="absButton"></li>');
		absButtonLI.css(this.configHandler.getConfig().absoluteRelativeTabs.liCss);
		var absButtonA = $('<a href="#">'+this.configHandler.getConfig().text.absoluteValues+'</a>');
		absButtonA.css(this.configHandler.getConfig().absoluteRelativeTabs.aCss);
		absButtonA.appendTo(absButtonLI);
		absButtonLI.appendTo(absRelButtonUL);
			absButtonLI.click(function() {
			switchToAbsolute(divId);
	    });


		var relButtonLI = $('<li id="relButton"></li>');
		relButtonLI.css(this.configHandler.getConfig().absoluteRelativeTabs.liCss);
		var relButtonA = $('<a href="#">'+this.configHandler.getConfig().text.relativeValues+'</a>');
		relButtonA.css(this.configHandler.getConfig().absoluteRelativeTabs.aCss);
		relButtonA.appendTo(relButtonLI);
		relButtonLI.appendTo(absRelButtonUL);
		relButtonLI.click(function() {
			switchToRelative(divId);
	    });


		absRelButtonUL.appendTo(this.headerDivObject);
	  }

	  // sortByTabs
      if(this.configHandler.getConfig().sortByTabs) {
		var sortByButtonUL = $('<ul id="sortByButtons" style="display: none"></ul>');
		sortByButtonUL.css(this.configHandler.getConfig().sortByTabs.ulCss);

		var sortByYearButtonLI = $('<li id="sortByYearButton"></li>');
		sortByYearButtonLI.css(this.configHandler.getConfig().sortByTabs.liCss);
		var sortByYearButtonA = $('<a href="#">'+this.configHandler.getConfig().text.sortByYear+'</a>');
		sortByYearButtonA.css(this.configHandler.getConfig().sortByTabs.aCss);
		sortByYearButtonA.appendTo(sortByYearButtonLI);
		sortByYearButtonLI.appendTo(sortByButtonUL);
		sortByYearButtonLI.click(function() {
			switchToYearSort(divId);
	    });


		var sortByItemLI = $('<li id="sortByItemButton"></li>');
		sortByItemLI.css(this.configHandler.getConfig().sortByTabs.liCss);
		var sortByItemA = $('<a href="#">'+this.configHandler.getConfig().text.sortByItem+'</a>');
		sortByItemA.css(this.configHandler.getConfig().sortByTabs.aCss);
		sortByItemA.appendTo(sortByItemLI);
		sortByItemLI.appendTo(sortByButtonUL);
		sortByItemLI.click(function() {
			switchToItemSort(divId);
	    });


		sortByButtonUL.appendTo(this.headerDivObject);
	  }

    }

	this.printTable = function () {
	  var builder = this,
		  containerJQ = $('.tableContainer'),
	      container = containerJQ.get(0),
		  footnotesJQ = $('.footnoteTable'),
		  footnotes = footnotesJQ.get(0),
	      origDisplay = [],
		  origParent = container.parentNode,
		  body = document.body,
	      childNodes = body.childNodes;
		  //CSS for Print style
		  $('.tableContainer').css(this.configHandler.getConfig().containerCss);
		  $('.footnoteTable').css(this.configHandler.getConfig().containerCss);
	  if (builder.isPrinting) {
		return;
	  }

	  builder.isPrinting = true;

	  // hide all body content
	  $(body).children().hide();

	  // pull out the chart
	  containerJQ.addClass('print');
	  footnotesJQ.addClass('print')
	  body.appendChild(container);
	  if (footnotes) {
		body.appendChild(footnotes);
	  }

	  // print
	  window.print();

	  // allow the browser to prepare before reverting
	  setTimeout(function() {

		  // put the chart back in
		  containerJQ.removeClass('print');
		  footnotesJQ.removeClass('print');
     	  origParent.appendChild(container);
		  if (footnotes) {
			origParent.appendChild(footnotes);
		  }

		  // restore all body content
		  $(body).children().show();
		//  window.Highcharts.each(childNodes, function(node, i) {
		//	  if (node.nodeType == 1 && node.style && node.style.display) {
		//		  node.style.display = origDisplay[i];
		//	  }
		//  });

		  builder.isPrinting = false;

	  }, 1000);
	}

	function exportXLS(rows,cols,jFile,style){
		if (typeof(style)=='object'&&(style instanceof Array)) {
			style = style[0];
		}
	   var callUrl = "/cgi-bin/getXLSFileFromJson.ssp?r=" + rows + "&c=" + cols + "&jfile=" + jFile + "&styleFile=" + style;
	   window.open(callUrl, "Export", "width=300,height=400,left=100,top=200");
	}

	this.buildExportButton = function (buttonObject, exportLabel) {
	  var button = $('<img>');
	  button.attr('src',this.getButtonSrc(buttonObject));
	  button.attr('title', exportLabel);
	  button.attr('alt', exportLabel);
	  pngfix(button);

	  var container = $('<div></div>');
	  container.css('float', 'left');
	  container.css('position', 'relative');
	  if (buttonObject.css) {
		  container.css(buttonObject.css);
	  }
	  if (buttonObject.css3) {
		  this.addCss3Styles(container, buttonObject.css3);
	  }
	  //pngfix(container);
	  container.append(button);
	  return container;
	}

    this.buildButton = function(buttonObject) {
	var button = $('<img>');
	button.attr('src',this.getButtonSrc(buttonObject));
	if (buttonObject.css) {
	    button.css(buttonObject.css);
		if (buttonObject.css.width) {
		  button.attr('width', buttonObject.css.width.replace(/px/g,''));
		}
		if (buttonObject.css.height) {
		  button.attr('height', buttonObject.css.height.replace(/px/g,''));
		}
	}
	if (buttonObject.css3) {
	    this.addCss3Styles(button, buttonObject.css3);
	}
	pngfix(button);
	return button;
    }

    this.getButtonSrc = function(buttonObject) {
	if (buttonObject.color != null) {
	    return this.configHandler.getConfig().buttonImgPath+buttonObject.src+'.'+buttonObject.color+'.png'
	} else {
	    return this.configHandler.getConfig().buttonImgPath+buttonObject.src;
	}
    }

    this.buildContent = function() {
	  this.contentDivObject = $('<div>');
	  this.contentDivObject.addClass('q4content');
	  this.contentDivObject.css(this.configHandler.getConfig().contentCss)
	  this.contentDivObject.appendTo(this.containerDivObject);
    }

    this.addEmptyHiddenChartContainer = function() {
	  this.chartContainerDivObject = $('<div></div>');
	  this.chartContainerDivObject.addClass('chartContainer');
	  this.chartContainerDivObject.appendTo(this.contentDivObject);
	  this.chartContainerDivObject.hide();
    }

    this.addTable = function() {
	  this.tableContainerDivObject = $('<div></div>');
	  this.tableContainerDivObject.addClass('tableContainer');
	  this.tableContainerDivObject.appendTo(this.contentDivObject);

	  this.buildEditInactiveRowsCheckboxAndAppendTo(this.tableContainerDivObject);
	  this.buildEditInactiveColsCheckboxAndDropDownAndAppendTo(this.tableContainerDivObject);
	  this.tableBuilder.getTableObject().appendTo(this.tableContainerDivObject);

	  this.tableBuilder.hideInactiveRows();
	  this.tableBuilder.hideInactiveColumns();
	  this.configHandler.setStatus('table');
    }

    this.buildEditInactiveColsCheckboxAndDropDownAndAppendTo = function(whereTo) {
	  var divId = this.divId;

	  var dropDownContainer = $('<div></div>');
	  dropDownContainer.css(this.configHandler.getConfig().tableCss.yearSelectDropDownContainer);
	  dropDownContainer.css({'float':'right', 'z-index':99});

	  dropDownContainer.appendTo(whereTo);
	  //label.appendTo(whereTo);
	  //checkbox.appendTo(whereTo);

	  var dropDownMenuWrapper = $('<div></div>');
	  var dropDownWrapperStyleConfig = this.configHandler.getConfig().tableCss.yearSelectDropDownUlWrapperDiv;
	  dropDownMenuWrapper.css(this.configHandler.getConfig().tableCss.yearSelectDropDownUlWrapperDiv);
	  this.addCss3Styles(dropDownMenuWrapper, this.configHandler.getConfig().tableCss.yearSelectDropDownUlWrapperDivCss3);
	  dropDownMenuWrapper.appendTo(dropDownContainer);
	  dropDownMenuWrapper.addClass('showYearsDropDownBox');

	  dropDownMenuWrapper.mouseenter(function() {
		if (!$(this).hasClass('dropped')) {
		  $('#'+divId+' div.showYearsDropDownBox li.notfirst').slideDown(500, function() {
			dropDownMenuWrapper.addClass('dropped');
		  });
		}
	  });
	  dropDownMenuWrapper.mouseleave(function() {
		if ($(this).hasClass('dropped')) {
		  $('#'+divId+' div.showYearsDropDownBox li.notfirst').slideUp(500, function() {
			dropDownMenuWrapper.removeClass('dropped');
		  });
		}
	  });

	  var dropDownButton = this.buildButton(this.configHandler.getConfig().buttons.yearSelectDropDownButton);
	  dropDownButton.appendTo(dropDownMenuWrapper);
	  dropDownButton.attr('title', this.configHandler.getConfig().text.toggleShowAllYearsCheckbox)
					.attr('alt', this.configHandler.getConfig().text.toggleShowAllYearsCheckbox);
	  dropDownButton.click(function() {
		if ($(this).hasClass('dropped')) {
			$('#'+divId+' div.showYearsDropDownBox li.notfirst').slideUp(500, function() {
			  dropDownButton.removeClass('dropped');
			});
		} else {
			$('#'+divId+' div.showYearsDropDownBox li.notfirst').slideDown(500, function() {
			  dropDownButton.addClass('dropped');
			});
		}
	  });

	  var dropDownMenu = $('<ul></ul>');
	  dropDownMenu.css(this.configHandler.getConfig().tableCss.yearSelectDropDownUl);
	  dropDownMenu.appendTo(dropDownMenuWrapper);

	  var li = $('<li></li>');
	  li.css(this.configHandler.getConfig().tableCss.yearSelectDropDownLi);

	  var checkbox = $('<input />');
	  checkbox.attr('type','checkbox');
	  checkbox.attr('id', 'toggleShowAllYearsCheckbox');
	  checkbox.addClass('toggleShowAllYearsCheckbox');
	  checkbox.change(function() {
		  toggleSelectAllYearsCheckbox(divId)
		  });

	  var label = $('<label for="toggleShowAllYearsCheckbox"></label>');
	  label.html(this.configHandler.getConfig().text.toggleShowAllYearsCheckbox);
	  label.css(this.configHandler.getConfig().tableCss.toggleShowAllYearsCheckbox);
	  label.css(this.configHandler.getConfig().tableCss.yearSelectDropDownLabel);
	  label.hover(
		function() {
		  var hoverCSS = qas4[divId].configHandler.getConfig().tableCss.yearSelectDropDownLabelHover;
		  if (hoverCSS) {
			$(this).css(hoverCSS);
		  }
		},
		function() {
		  $(this).css(qas4[divId].configHandler.getConfig().tableCss.yearSelectDropDownLabel);
		}
	  );

	  li.append(checkbox);
	  li.append(label);
	  dropDownMenu.append(li);

	  this.buildColSelectCheckBoxesAndAppendTo(dropDownMenu);
	  $('#'+divId+' div.showYearsDropDownBox li.notfirst').hide();
	}

	this.buildColSelectCheckBoxesAndAppendTo = function(whereTo) {
	  var cols = this.dataHandler.getColHeaders();
	  var activeCols = this.dataHandler.getActiveCols();
	  for (var i = 0; i<cols.length; i++) {
		  this.buildSingleColSelectCheckbox(cols[i], i, whereTo);
	  }
    }

    this.buildSingleColSelectCheckbox = function(colHeaderText, colNumber, whereTo) {
	  var li = $('<li></li>');
	  li.css(this.configHandler.getConfig().tableCss.yearSelectDropDownLi);
	  li.appendTo(whereTo);
	  li.addClass('notfirst');

	  var checkbox = $('<input />');
	  checkbox.attr('type','checkbox');
	  checkbox.attr('id', 'checkbox_' + colNumber);
	  checkbox.addClass('toggleInactiveColsCheckbox');
	  checkbox.addClass('col_'+colNumber);
	  checkbox.appendTo(li);
	  if (this.dataHandler.isColActive(colNumber)) {
			if (typeof checkbox.attr('checked') === 'undefined') {
				// jQuery 1.10
				checkbox.addClass('active').prop('checked', true).parent('li').addClass('active');
			} else {
				checkbox.addClass('active').attr('checked', true).parent('li').addClass('active');
			}
	  } else {
		  checkbox.addClass('inactive');
	  }

	  divId = this.divId;
	  checkbox.change(function(e) {
		  toggleInactiveCol(divId, colNumber);
	  });

	  var label = $('<label for="'+'checkbox_' + colNumber+'"></label>');
	  label.html(colHeaderText);
	  label.appendTo(li);
	  label.css(this.configHandler.getConfig().tableCss.yearSelectDropDownLabel);
	  label.hover(
		function() {
		  var hoverCSS = qas4[divId].configHandler.getConfig().tableCss.yearSelectDropDownLabelHover;
		  if (hoverCSS) {
			$(this).css(hoverCSS);
		  }
		},
		function() {
		  $(this).css(qas4[divId].configHandler.getConfig().tableCss.yearSelectDropDownLabel);
		}
	  );
	  return li;
    }

    this.buildEditInactiveRowsCheckboxAndAppendTo = function(whereTo) {
	var checkbox = $('<input />');
	checkbox.attr('type','checkbox');
	checkbox.attr('id', 'toggleInactiveRowsCheckbox');
	checkbox.addClass('toggleInactiveRowsCheckbox');
	checkbox.css({"float": "left", "display":"none"});
	checkbox.appendTo(whereTo);


	// IPhone style checkbox
	$('head').append("<style>.iCheckbox_container {position: relative; overflow: hidden; float: left; border: 1px solid #ccc;}" +
					 " .iCheckbox_switch {height:16px; width:36px; background-image:url(img/checkbox/bpm-lozenge.png); background-repeat:none; background-position:0px; border-width: 0; position: relative;}" +
					 " label.toggleInactiveRowsLabel { padding-left: 1em; }</style>");
	var cfg = {
	  switch_container_src: 'img/checkbox/bpm-frame.gif',
	  switch_swing: -13,
	  switch_width: 54,
	  switch_height: 16,
	  checkbox_hide: true
	}
	var beginState = this.configHandler.getConfig().inactiveDataDefaultState;
	if (!beginState) {
		beginState = "off";
	}
	checkbox.iCheckbox(beginState, cfg);

	// default text is on as the iCheckbox does one change operation to set the
	// checkbox to off initially - before it is visible
	var label_text = this.configHandler.getConfig().text.toggleHideInactiveRowsCheckbox_on;
	if (beginState == "on") {
		label_text = this.configHandler.getConfig().text.toggleHideInactiveRowsCheckbox_off;
	}
	$('.iCheckbox_switch').attr('title', label_text).attr('alt', label_text);

	this.addCss3Styles($('.iCheckbox_switch').addClass('piefix'), {"borderRadius":"6px"});
	this.addCss3Styles($('.iCheckbox_container').addClass('piefix'), {"borderRadius":"6px"});

	var divId = this.divId;
	checkbox.change(function() {
		var ele = $('.toggleInactiveRowsLabel');
		var label_text = ele.html();
		if (label_text == qas4[divId].configHandler.getConfig().text.toggleHideInactiveRowsCheckbox_off){
		  label_text = qas4[divId].configHandler.getConfig().text.toggleHideInactiveRowsCheckbox_on;
		} else {
		  label_text = qas4[divId].configHandler.getConfig().text.toggleHideInactiveRowsCheckbox_off;
		}
		ele.html(label_text);
		$('.iCheckbox_switch').attr('title', label_text).attr('alt', label_text);
		toggleInactiveRows(divId);
		checkForVisibleFootnotes(qas4[divId].configHandler.getConfig());
	});

	var label = $('<label class="toggleInactiveRowsLabel" for="toggleInactiveRowsCheckbox"></label>');
	label.html(label_text);
	label.css(this.configHandler.getConfig().tableCss.toggleHideInactiveRowsCheckbox);
	label.css('float', 'left');
	label.appendTo(whereTo);
    }

    this.fadeIn = function() {
	$('#_'+this.divId).css("display","none");
	$('#'+this.divId).fadeIn();
    }

    this.showDialog = function() {
	var dialogBox = this.getDialog();
	dialogBox.show();
	dialogBox.appendTo(this.containerDivObject);

	if (this.dataHandler.getTotalNumberOfActiveComparisionKeys() > 1) {
		$('#sortByItemButton').hide();
		$('#sortByYearButton').hide();
	} else {
		$('#sortByItemButton').show();
		$('#sortByYearButton').show();
	}

	this.horizontalCenterTo(dialogBox, this.containerDivObject);
	dialogBox.fadeIn('slow');
    }

    this.horizontalCenterTo = function (what, to) {
	what.css({
		'left':Math.floor(to.width()/2)
	    });
    }

    this.getDialog = function() {
	  var dia = $('.dialog');
	  if (dia.length > 0) {
		dia.empty();
		dia.remove();
	  }
	  var dialogBox = $('<div></div>');
	  dialogBox.css(this.configHandler.getConfig().dialogBox.containerCss);
	  dialogBox.addClass('dialog');
	  dialogBox.addClass('piefix');
	  this.addCss3Styles(dialogBox, this.configHandler.getConfig().dialogBox.containerCss3);

	  var wrapper = $('<div></div>');
	  wrapper.css({
		width    : "100%",
		height	 : "100%",
		position : "relative",
		margin   : "0px !important",
		float    : "left"
	  });
	  this.getDialogHeadingAccordingStatusAndAppendTo(wrapper);
	  this.getDialogWarningsAndAppendTo(wrapper);
	  this.getSelectionBoxAccordingStatusAndAppendTo(wrapper);
	  this.getCancelAndOkayButtonsAndAppendTo(wrapper);
	  wrapper.appendTo(dialogBox);

	  return dialogBox;
    }

    this.getCancelAndOkayButtonsAndAppendTo = function(whereTo) {
	var divId = this.divId;
	var numberOfComparable = this.configHandler.getConfig().numberOfComparableValues;
	if(!numberOfComparable){
		numberOfComparable = 10;
	}

	var cancelButton = $('<a href="javascript:void(0)"></a>');
	var okayButton = $('<a href="javascript:void(0)"></a>');

	cancelButton.html(this.configHandler.getConfig().text.dialogBoxCancelText);
	cancelButton.attr('id','cancelButton');
	okayButton.html(this.configHandler.getConfig().text.dialogBoxOkayText);
	okayButton.attr('id','okayButton');

	cancelButton.css(this.configHandler.getConfig().dialogBox.cancelButtonCss);
	if (this.configHandler.getConfig().dialogBox.cancelButtonCss3) {
	  this.addCss3Styles(cancelButton, this.configHandler.getConfig().dialogBox.cancelButtonCss3);
	}
	okayButton.css(this.configHandler.getConfig().dialogBox.okayButtonCss);
	if (this.configHandler.getConfig().dialogBox.okayButtonCss3) {
	  this.addCss3Styles(okayButton, this.configHandler.getConfig().dialogBox.okayButtonCss3);
	}

	if(this.dataHandler.getTotalNumberOfActiveRows() > numberOfComparable){
		okayButton.css('display','none');
	}

	var numberOfComparableValuesShowError = this.configHandler.getConfig().numberOfComparableValuesShowError;
	if(this.dataHandler.getTotalNumberOfActiveComparisionKeys() > numberOfComparableValuesShowError) {
		okayButton.css('display','none');
	}

	okayButton.click(function(e) {
		e.preventDefault();
		dialogBoxOkay(divId);
		return false;
	    });

	cancelButton.click(function(e) {
		e.preventDefault();
		dialogBoxCancel(divId);
		return false;
	    });

	cancelButton.appendTo(whereTo);
	okayButton.appendTo(whereTo);
    }

    this.getDialogHeadingAccordingStatusAndAppendTo = function(whereTo) {
	var status = this.configHandler.getStatus();
	var headingText = this.configHandler.getConfig().text[status+'Heading'];
	var heading = $('<h1></h1>');
	heading.html(headingText);
	heading.css(this.configHandler.getConfig().dialogBox.headingCss);
	heading.appendTo(whereTo);
    }

    this.getSelectionBoxAccordingStatusAndAppendTo = function(whereTo) {
	var divId = this.divId;

	var dialogBoxLeftColumn = $('<div></div>');
	var dialogBoxRightColumn = $('<div></div>');

	dialogBoxLeftColumn.css(this.configHandler.getConfig().dialogBox.leftColCss);
	dialogBoxRightColumn.css(this.configHandler.getConfig().dialogBox.rightColCss);

	if (this.configHandler.isStatus('lineChartDialog')) {
	    this.getRadioBoxesForLineChartAndAppendToCorrectBoxes(dialogBoxLeftColumn, dialogBoxRightColumn);
	} else {
	    this.getRadioBoxesForBarChartAndAppendToCorrectBoxes(dialogBoxLeftColumn, dialogBoxRightColumn);
	}

	dialogBoxLeftColumn.appendTo(whereTo);
	dialogBoxRightColumn.appendTo(whereTo);
    }


    this.getRadioBoxesForBarChartAndAppendToCorrectBoxes = function(dialogBoxLeftColumn, dialogBoxRightColumn) {
	this.getRadioBoxHeaderWithText(this.configHandler.getConfig().text.barChartAbsoluteRadioText
				       ).appendTo(dialogBoxLeftColumn);
	this.getRadioBoxWithStatusAndText('barChartAbsoluteYearGrouped',
					  this.configHandler.getConfig().text.barChartYearGroupedRadioText
					  ).appendTo(dialogBoxLeftColumn);
	this.getRadioBoxHeaderWithText(this.configHandler.getConfig().text.barChartRelativeRadioText
				       ).appendTo(dialogBoxRightColumn);
	this.getRadioBoxWithStatusAndText('barChartRelativeYearGrouped',
					  this.configHandler.getConfig().text.barChartYearGroupedRadioText
					  ).appendTo(dialogBoxRightColumn);
	if (this.dataHandler.isItemGroupedComparisionPossible()) {
	    this.getRadioBoxWithStatusAndText('barChartRelativeItemGrouped',
					      this.configHandler.getConfig().text.barChartItemGroupedRadioText
					      ).appendTo(dialogBoxRightColumn);
	    this.getRadioBoxWithStatusAndText('barChartAbsoluteItemGrouped',
					      this.configHandler.getConfig().text.barChartItemGroupedRadioText
					      ).appendTo(dialogBoxLeftColumn);
	}
    }



    this.getRadioBoxesForLineChartAndAppendToCorrectBoxes = function(dialogBoxLeftColumn, dialogBoxRightColumn) {
	this.getRadioBoxWithStatusAndText('lineChartAbsolute',
					  this.configHandler.getConfig().text.lineChartAbsoluteRadioText
					  ).appendTo(dialogBoxLeftColumn);
	this.getRadioBoxWithStatusAndText('lineChartRelative',
					  this.configHandler.getConfig().text.lineChartRelativeRadioText
					  ).appendTo(dialogBoxRightColumn);
    }

    this.getRadioBoxHeaderWithText = function(text) {
	var h2 = $('<h2></h2>');
	h2.html(text);
	h2.css(this.configHandler.getConfig().dialogBox.radioButtonHeaderTextCss);

	var numberOfComparable = this.configHandler.getConfig().numberOfComparableValues
	if(!numberOfComparable){
		numberOfComparable = 10;
	}

	if(this.dataHandler.getTotalNumberOfActiveRows() > numberOfComparable){
		h2.css('display','none');
	}

	return h2;
    }

    this.getRadioBoxWithStatusAndText = function(status, text) {
	var radioBox = $('<input type="radio" name="dialogSelect" />');
	radioBox.attr('value',status);

	var radioText = $('<label></label>');
	radioText.append(radioBox);
	radioText.append(text);
	radioText.css(this.configHandler.getConfig().dialogBox.radioButtonTextCss);

	var numberOfComparable = this.configHandler.getConfig().numberOfComparableValues
	if(!numberOfComparable){
		numberOfComparable = 10;
	}

	if(this.dataHandler.getTotalNumberOfActiveRows() > numberOfComparable){
		radioBox.css('display','none');
		radioText.css('display','none');
	}

	var numberOfComparableValuesShowError = this.configHandler.getConfig().numberOfComparableValuesShowError;
	if(this.dataHandler.getTotalNumberOfActiveComparisionKeys() > numberOfComparableValuesShowError) {
		radioBox.css('display','none');
		radioText.css('display','none');
	}

	return radioText;
    }

    this.getDialogWarningsAndAppendTo = function(whereTo) {
	var warnings = this.dataHandler.getWarnings();
	for (var i = 0; i < warnings.length; i++) {
	    var text = this.configHandler.getText(warnings[i]);
		var warningObject = $('<p class="'+ warnings[i] +'"></p>');
	    warningObject.append(text);
	    warningObject.css(this.configHandler.getConfig().dialogBox.warningsCss);
		if (this.configHandler.getConfig().dialogBox.warningsCss3) {
		  this.addCss3Styles(warningObject, this.configHandler.getConfig().dialogBox.warningsCss3);
		}
		if (warnings[i] == 'tooManyComparisionKeysForItemGroupedChartWarning' && this.configHandler.getConfig().dialogBox.tooManyComparisionKeysForItemGroupedChartWarningCss) {
			 warningObject.css(this.configHandler.getConfig().dialogBox.tooManyComparisionKeysForItemGroupedChartWarningCss);
		}
	    whereTo.append(warningObject);
	}
    }
}

/**** HELPER FUNCTIONS ****/
function roundBorderCss(obj, radius) {
    obj.css({'-moz-border-radius': radius,
			'-webkit-border-radius': radius,
			'border-radius': radius});
    if (navigator.userAgent.toLowerCase().match(/msie [78]/)) { obj.addClass("piefix"); }
}

function dropShadowCss(obj, shadow) {
    obj.css({'-webkit-box-shadow': shadow,
			'-moz-box-shadow': shadow,
			'box-shadow': shadow});
    if (navigator.userAgent.toLowerCase().match(/msie [78]/)) { obj.addClass("piefix"); }
}

function gradientCss(obj, from, to) {
    obj.css('background', from);

    if (navigator.userAgent.toLowerCase().match(/msie [78]/))  {
        obj.css('-pie-background', 'linear-gradient('+from+', '+to+')');
	obj.addClass("piefix");
    } else {
	  obj.css('background', '-webkit-gradient(linear, left bottom, left top, from('+from+'), to('+to+'))');
	  obj.css('background', '-moz-linear-gradient('+from+', '+to+')');
	  obj.css('background', 'linear-gradient('+from+', '+to+')');
    }
}

function alpha (obj, percent) {
  var percentage_quot = (percent / 100);
  if (navigator.userAgent.toLowerCase().match(/msie [78]/))  {
	//obj.css('filter', 'alpha(opacity=' + percent + ')');
  } else {
    obj.css({'opacity': percentage_quot, '-moz-opacity': percentage_quot});
  }
}

function pngfix(obj) {
  if (navigator.userAgent.toLowerCase().match(/msie [78]/))  {
		obj.addClass('piefix');
		obj.css({"-pie-png-fix":"true"});
  }
}
