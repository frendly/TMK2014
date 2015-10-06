function TableBuilder(myDivId, myConfigHandler, myDataHandler, myGuiBuilder) { 
    this.divId         = myDivId;
    this.configHandler = myConfigHandler;
    this.dataHandler   = myDataHandler;
    this.guiBuilder    = myGuiBuilder;

    this.tableObject       = null;
    this.tableHeaderObject = null;
    this.tableBodyObject   = null;

    this.footnoteListTable = null;

    this.getTableObject = function() {
	  if (this.tableObject == null) {
		  this.buildTableObject();
	  }
	  return this.tableObject;
    }// getTableObject

    this.getFootnoteListTableObject = function() {
	  if (this.footnoteListTable == null) {
		  this.buildFootnoteListTable();
	  }
	  
	  return this.footnoteListTable;
    }// getFootnoteListTableObject

    this.buildTableObject = function () {
	  this.tableObject = $('<table></table>');
	  this.tableObject.addClass('dataTable');
	  this.tableObject.css('clear', 'both');
	  this.tableObject.css(this.configHandler.getConfig().tableCss.table);
  
	  this.buildTableHeaderObject().appendTo(this.tableObject);
	  this.buildTableBodyObject().appendTo(this.tableObject);
  
	  this.generateCssClassesForInactiveStyleSettings();
	  this.generateCssClassesForMouseHovering();
    }// buildTableObject

    this.hideInactiveRows = function() {
	  for ( row = 0; row < this.dataHandler.getTotalNumberOfRows(); row ++) {
		  if (!this.dataHandler.isRowActive(row)) {
			this.hideRowAndSetInactive(row);
		  } else {
			this.setRowActive(row);
		  }
	  }
    }// hideInactiveRows
    
    this.hideRowAndSetInactive = function(row) {
	  deactivateRow(this.divId, row);
    }// hideRowAndSetInactive
    
    this.setRowActive = function(row) {
	  activateRow(this.divId, row);
    }// setRowActive

    this.hideInactiveColumns = function() {
	  for ( col = 0; col < this.dataHandler.getTotalNumberOfCols(); col++) {
		if (!this.dataHandler.isColActive(col)) {
		  this.hideColAndSetInactive(col);
		}
	  }
    }// hideInactiveColumns

    this.hideColAndSetInactive = function(col) {
	  this.dataHandler.deactivateCol(col);
      this.scrollHideCol(col);
    }// hideColAndSetInactive

    this.scrollHideCol = function(col) {
	  $('#'+this.divId+' thead th.col_'+col).hide();
	  $('#'+this.divId+' tbody td.col_'+col).hide();
	  this.dataHandler.setColInvisible(col);
	  this.changeCategoryColspan(-1);
    }// scrollHideCol

    this.unScrollHideCol = function(col) {
	  if (!this.dataHandler.isColVisible(col)) {
		  $('#'+this.divId+' thead th.col_'+col).show();
		  $('#'+this.divId+' tbody td.col_'+col).show();
		  
		  this.dataHandler.setColVisible(col);
		  this.changeCategoryColspan(+1);
	  }
    }// unScrollHideCol
    
    this.unScrollHideActiveCols = function() {
	  var activeCols = this.dataHandler.getActiveCols();
	  for (var i = 0; i < activeCols.length; i++) {
		  this.unScrollHideCol(activeCols[i]);
	  }
    }// unScrollHideActiveCols

    this.unhideColAndSetActive = function(col) {
	  if (!this.dataHandler.isColActive(col)) {
		  this.dataHandler.activateCol(col);
		  this.unScrollHideCol(col);
	  }
    }// unhideColAndSetActive

    this.changeCategoryColspan = function(howMuch) {
	  this.setCategoryColspan(this.getCategoryColspan()+howMuch);
    }// changeCategoryColspan

    this.getCategoryColspan = function() {
	  return parseInt($('#'+this.divId+' tr.categoryHeader th').attr('colspan'));
    }// getCategoryColspan

    this.setCategoryColspan = function(colspan) {
	  $('#'+this.divId+' tr.categoryHeader th').attr('colspan', colspan);
    }// setCategoryColspan

    this.buildTableHeaderObject = function() {
	  this.tableHeaderObject = $('<thead></thead>');
	  var headerRow = $('<tr></tr>');
	  
	  this.buildTitle().appendTo(headerRow);
	  this.buildLeftScrollColButton().appendTo(headerRow);
	  this.buildColumnHeadersTo(headerRow);
	  this.buildRightScrollColButton().appendTo(headerRow);
  
	  headerRow.appendTo(this.tableHeaderObject);
	  return this.tableHeaderObject;
    }// buildTableHeaderObject

    this.buildLeftScrollColButton = function() {
	  return this.buildScrollColButton(true);
    }// buildLeftScrollColButton

    this.buildRightScrollColButton = function() {
	  return this.buildScrollColButton(false);
    }// buildRightScrollColButton

    this.buildScrollColButton = function (isLeftOne) {
	  var buttonObj = (isLeftOne?this.configHandler.getConfig().buttons.scrollColLeftButton:this.configHandler.getConfig().buttons.scrollColRightButton);
	  var th = $('<th>&nbsp;</th>');
	  var cfg = this.configHandler.getConfig();
	  th.css(this.configHandler.getConfig().tableCss.colHeaderTh);
	  th.css(this.configHandler.getConfig().tableCss.colHeaderScrollButtonTh);
	  th.click(
			   (isLeftOne ?
				  function() {
					colScrollLeft(myDivId);
					checkForVisibleFootnotes(cfg);
				  }
				:
				  function() {
					colScrollRight(myDivId);
					checkForVisibleFootnotes(cfg);
				  }
				));
	  var button = this.guiBuilder.buildButton(buttonObj);
	  var myDivId = this.divId;
	  //button.attr('alt', (isLeftOne?'L':'R'));
	  //button.attr('title', (isLeftOne?'L':'R'));
	  button.appendTo(th);
	  button.addClass('colScrollButton');
	  button.css('cursor', 'pointer');
	  return th;
    }// buildScrollColButton

    this.buildTitle = function() {
	  var titleObject = $('<th>&nbsp;</th>');
	  titleObject.html(this.dataHandler.tableData.title);
	  titleObject.css(this.configHandler.getConfig().tableCss.colHeaderTh);
	  titleObject.css(this.configHandler.getConfig().tableCss.titleTh);
	  titleObject.attr('colspan', 1+this.getUnitTdColSpan());
	  return titleObject;
    }// buildTitle

    this.buildColumnHeadersTo = function (whereTo) {
	  for ( col = 0; col < this.dataHandler.getTotalNumberOfCols(); col ++) {
		  this.buildSingleColumnHeaderTo(whereTo, col);
	  }
    }// buildColumnHeadersTo

    this.buildSingleColumnHeaderTo = function (whereTo, columnNumber) {
	  var th = $('<th></th>');
	  th.html(this.dataHandler.tableData.colHeaders[columnNumber]);
	  this.appendColumnHeaderFootnotesTo(th, columnNumber);
	  th.css(this.configHandler.getConfig().tableCss.colHeaderTh);
	  th.addClass('col_'+columnNumber);
	  th.appendTo(whereTo);
    }// buildSingleColumnHeaderTo

    this.buildTableBodyObject = function() {
	  this.tableBodyObject = $('<tbody></tbody>');
	  this.buildTableRowsForCategory(null);
	  this.buildTableRowsForExistingCategories();
	  return this.tableBodyObject;
    }// buildTableBodyObject

    this.buildTableRowsForExistingCategories = function() {
	  for (category = 0; category < this.dataHandler.getTotalNumberOfCategories(); category ++) {
		  this.buildTableRowsForCategory(category);
	  }
    }// buildTableRowsForExistingCategories

    this.buildTableRowsForCategory = function ( category ) {
	  var categoryHeader = this.dataHandler.getCategoryName(category);
	  var categoryRows = this.dataHandler.getCategoryRows(category);
  
	  this.buildTableHeaderRowForCategory(category , categoryHeader);
	  this.buildTableDataRowsForCategory(category , categoryRows);
    }// buildTableRowsForCategory

    this.buildTableHeaderRowForCategory = function(category, categoryHeader) {
	  if (categoryHeader != null) {
		  var tr = $('<tr></tr>');
		  tr.addClass('category_'+category);
		  tr.addClass('categoryHeader');
		  tr.appendTo(this.tableBodyObject);
  
		  var header = $('<th></th>');
		  header.addClass('category_'+category);
		  header.attr('colspan',
			  this.dataHandler.getTotalNumberOfCols()
			  +this.getTrHeaderColspan()
			  +this.getScrollButtonColSpan()
			  -this.getAddAndRemoveButtonTdColSpan()
			  +this.getUnitTdColSpan());
		  header.css(this.configHandler.getConfig().tableCss.rowTd);
		  header.css(this.configHandler.getConfig().tableCss.categoryHeaderTd);
  
		  var dropUpButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.dropUpButton);
		  header.append(dropUpButton);
		  dropUpButton.addClass('dropUpButton');
		  
		  var dropUpText = this.configHandler.getConfig().text.dropUpButton;
		  dropUpButton.attr('title', dropUpText)
					  .attr('alt', dropUpText);
		  
		  var myDivId = this.divId;
		  dropUpButton.click(function() {toggleCategoryVisible(myDivId, category);});
  
		  var dropDownButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.dropDownButton);
		  header.append(dropDownButton);
		  dropDownButton.addClass('dropDownButton');
		  dropDownButton.click(function() {toggleCategoryVisible(myDivId, category);});
		  dropDownButton.hide();
		  
		  var dropDownText = this.configHandler.getConfig().text.dropDownButton;
		  dropDownButton.attr('title', dropDownText)
						.attr('alt', dropDownText);
  
		  header.append(this.dataHandler.tableData.categories[category].name);
		  header.appendTo(tr);
  
		  var addAndRemoveCategoryButtonTd = this.buildAddAndRemoveCategoryButtonTd(category);
		  addAndRemoveCategoryButtonTd.appendTo(tr);
		  
		  this.appendCategoryHeaderFootnotesTo(header, category);
	  }
    }// buildTableHeaderRowForCategory

    this.getTrHeaderColspan = function() {return 1;}
    this.getAddAndRemoveButtonTdColSpan = function() {return 1;}
    this.getScrollButtonColSpan = function () {return 2;}
    this.getUnitTdColSpan = function () {return 1;}

    this.buildTableDataRowsForCategory = function(category , categoryRows) {
	  for (var i = 0; i < categoryRows.length; i++) {
		  var row = categoryRows[i];
		  var tr = $('<tr></tr>');
		  tr.addClass('row');
		  tr.addClass('row_'+row);
		  tr.addClass('category_'+(category==null?'null':category));
		  tr.appendTo(this.tableBodyObject);
		  
		  var header = $('<th></th>');
		  header.addClass('row_'+row);
		  header.html(this.dataHandler.tableData.rowHeaders[row]);
		  header.css(this.configHandler.getConfig().tableCss.rowTd);
		  header.css(this.configHandler.getConfig().tableCss.dataRowHeaderTd);
		  header.css(this.getDataRowEvenOddCss(i));
		  
		  if (this.isRowHeaderIndented(row)) {
			header.css('padding-left', '25px');
		  }
  
		  this.appendRowHeaderFootnotesTo(header, row);
		  
		  header.appendTo(tr);
  
		  unitTd = $('<th></th>');
		  unitTd.addClass('row_'+row);
		  unitTd.addClass('unit_row');
		  unitTd.html(this.dataHandler.getUnit(row));
		  unitTd.css(this.configHandler.getConfig().tableCss.rowTd);
		  unitTd.css(this.configHandler.getConfig().tableCss.dataRowHeaderTd);
		  unitTd.css(this.getDataRowEvenOddCss(i));
		  unitTd.css("white-space","nowrap");
  
		  unitTd.appendTo(tr);
		  
		  this.buildEmptyTdAsPlaceholderForColScrolls(row, i).appendTo(tr);
		  for (col = 0; col < this.dataHandler.getTotalNumberOfCols(); col++) {
		  var td = $('<td></td>');
		  td.addClass('row_'+row);
		  td.addClass('col_'+col);
		  td.html(this.dataHandler.getStringCellData(row, col));
		  td.css(this.configHandler.getConfig().tableCss.rowTd);
		  td.css(this.configHandler.getConfig().tableCss.dataRowTd);
		  td.css(this.getDataRowEvenOddCss(i));
		  td.css("white-space","nowrap");
		  this.appendCellFootnotesTo(td, row, col);
		  this.applyMouseHovering(td,row,col);
  
		  td.appendTo(tr);
		  }
		  this.buildAddAndRemoveButtonTd(row, i).appendTo(tr);
	  }
    }// buildTableDataRowsForCategory

	this.isRowHeaderIndented = function (row) {
	  var check = '|' + this.dataHandler.tableData.indentedRows.join('|') + '|';
	  return check.indexOf('|' + row + '|') >= 0;
	}// isRowHeaderIndented

    this.applyMouseHovering  = function(td,row,col) {
	  var divId = this.divId
	  td.mouseenter(function(){mouseHoverOn(divId, row, col);});
	  td.mouseleave(function(){mouseHoverOff(divId, row, col);});
    }// applyMouseHovering

    this.getDataRowEvenOddCss = function(evenOddCounter) {
	  if (evenOddCounter%2==0) {
		  return this.configHandler.getConfig().tableCss.dataRowEven;
	  } else {
		  return this.configHandler.getConfig().tableCss.dataRowOdd;
	  }
    }// getDataRowEvenOddCss
    
    this.buildEmptyTdAsPlaceholderForColScrolls = function(rowNumber, evenOddCounter) {
	  var td = $('<td>&nbsp;</td>');
	  td.addClass('row_'+rowNumber);
	  td.addClass('col_scroll');
	  td.css(this.configHandler.getConfig().tableCss.rowTd);
	  td.css(this.configHandler.getConfig().tableCss.dataRowTd);
	  td.css(this.getDataRowEvenOddCss(evenOddCounter));
	  return td;
    }

    this.buildAddAndRemoveButtonTd = function(rowNumber, evenOddCounter) {
	  var td = $('<td></td>');
	  td.addClass('row_'+rowNumber);
	  td.addClass('col_scroll');
	  td.css(this.configHandler.getConfig().tableCss.rowTd);
	  td.css(this.configHandler.getConfig().tableCss.dataRowTd);
	  td.css(this.configHandler.getConfig().tableCss.removeButtonRowTd);
  
	  td.css(this.getDataRowEvenOddCss(evenOddCounter));
  
	  var removeRowButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.removeButton);
	  removeRowButton.addClass('removeRowButton');
	  
	  var removeRowText = this.configHandler.getConfig().text.removeRowButton;
	  removeRowButton.attr('title', removeRowText)
					 .attr('alt', removeRowText);
  
	  var addRowButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.addButton);
	  addRowButton.addClass('addRowButton');
	  
	  var addRowText = this.configHandler.getConfig().text.addRowButton;
	  addRowButton.attr('title', addRowText)
				  .attr('alt', addRowText);
  
	  var myDivId = this.divId;
	  removeRowButton.click(function() {deactivateRow(myDivId, rowNumber);});
	  addRowButton.click(function() {activateRow(myDivId, rowNumber);});
	  td.append(removeRowButton);
	  td.append(addRowButton);
	  addRowButton.hide();
	  return td;
    }// buildAddAndRemoveButtonTd

    this.buildAddAndRemoveCategoryButtonTd = function(categoryId) {
	  var td = $('<td></td>');
	  td.addClass('category_'+categoryId);
	  td.css(this.configHandler.getConfig().tableCss.rowTd);
	  td.css(this.configHandler.getConfig().tableCss.categoryHeaderTd);
	  td.css(this.configHandler.getConfig().tableCss.removeButtonRowTd);
  
	  var removeRowButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.removeButton);
	  removeRowButton.addClass('removeCategoryButton');
	  
	  var removeRowText = this.configHandler.getConfig().text.removeCategoryRowButton;
	  removeRowButton.attr('title', removeRowText)
					 .attr('alt', removeRowText);
  
	  var addRowButton = this.guiBuilder.buildButton(this.configHandler.getConfig().buttons.addButton);
	  addRowButton.addClass('addCategoryButton');
  
	  var addRowText = this.configHandler.getConfig().text.addCategoryRowButton;
	  addRowButton.attr('title', addRowText)
				  .attr('alt', addRowText);
  
	  var myDivId = this.divId;
	  removeRowButton.click(function() {deactivateCategory(myDivId, categoryId);});
	  addRowButton.click(function() {activateCategory(myDivId, categoryId);});
	  td.append(removeRowButton);
	  td.append(addRowButton);
	  addRowButton.hide();
	  return td;
    }// buildAddAndRemoveCategoryButtonTd

    this.appendColumnHeaderFootnotesTo = function (thElement, columnNumber) {
	  if (this.configHandler.getConfig().showFootnotesInTableUpperSpans) {
		  this.appendFootnoteUpperSpansTo(thElement, this.dataHandler.getFootnotesForColumn(columnNumber));
	  }
    }// appendColumnHeaderFootnotesTo
	
	this.appendCategoryHeaderFootnotesTo = function (thElement, categoryNumber) {
	  if (this.configHandler.getConfig().showFootnotesInTableUpperSpans) {
		  this.appendFootnoteUpperSpansTo(thElement, this.dataHandler.getFootnotesForCategory(categoryNumber));
	  }
    }// appendCategoryHeaderFootnotesTo

    this.appendRowHeaderFootnotesTo = function (thElement, rowNumber) {
	  if (this.configHandler.getConfig().showFootnotesInTableUpperSpans) {
		  this.appendFootnoteUpperSpansTo(thElement, this.dataHandler.getFootnotesForRow(rowNumber));
	  }
    }// appendRowHeaderFootnotesTo

    this.appendCellFootnotesTo = function (tdElement, rowNumber, colNumber) {
	  if (this.configHandler.getConfig().showFootnotesInTableUpperSpans) {
		  this.appendFootnoteUpperSpansTo(tdElement, this.dataHandler.getFootnotesForCell(colNumber, rowNumber));
	  }
    }// appendCellFootnotesTo

    this.appendFootnoteUpperSpansTo = function(thElement, arrayOfFootnoteObjects) {
	  for (var i = 0; i<arrayOfFootnoteObjects.length; i++) {
		  this.appendSingleFootnoteUpperSpanTo(thElement, arrayOfFootnoteObjects[i], (i + 1) < (arrayOfFootnoteObjects.length)) 
	  }
    }// appendFootnoteUpperSpansTo

    this.appendSingleFootnoteUpperSpanTo = function(thElement, footnoteObject, hasNext) {
	  var upperSpan = $('<sup></sup>');
	  upperSpan.append(footnoteObject.number);
	  if (hasNext && this.configHandler.getConfig().footnoteSpacer) {
		upperSpan.append(this.configHandler.getConfig().footnoteSpacer);
	  }
	  upperSpan.css(this.configHandler.getConfig().tableCss.footnoteUpperSpan);
	  upperSpan.appendTo(thElement);
	  // only apply footnote overlays when footnotes are shown
	  if (this.configHandler.getConfig().showFootnotesInTableUpperSpans) {
		upperSpan.mouseenter(function() {
		  qas4[divId].guiBuilder.tableBuilder.showFootnoteOverlay($(this), footnoteObject.text);
		});
		upperSpan.mouseleave(function() {
		  qas4[divId].guiBuilder.tableBuilder.hideFootnoteOverlay();
		});
	  }
    }// appendSingleFootnoteUpperSpanTo
	
	this.showFootnoteOverlay = function (ele, text) {
	  var pos = ele.offset();
	  var overlay = $('#footnoteOverlay');
	  if (overlay.length == 0) {
		overlay = $('<div id="footnoteOverlay"></div>');
		overlay.hide();
		overlay.appendTo(document.body);
	  } else {
		overlay.empty();
		overlay.hide();
	  }
	  overlay.text(text);
	  
	  if (this.configHandler.getConfig().tableCss.footnoteOverlayCss) {
		overlay.css(this.configHandler.getConfig().tableCss.footnoteOverlayCss);
		var maxWidth = this.configHandler.getConfig().tableCss.footnoteOverlayCss.maxwidth;
		if (maxWidth && overlay.outerWidth() > maxWidth) {
		  overlay.css({'width': maxWidth + "px"});
		}
		overlay.css({
			'-moz-box-sizing': 'border-box',
			'-webkit-box-sizing': 'border-box',
			'box-sizing': 'border-box'
		})
	  }
	  if (this.configHandler.getConfig().tableCss.footnoteOverlayCss3) {
		this.guiBuilder.addCss3Styles(overlay, this.configHandler.getConfig().tableCss.footnoteOverlayCss3);
	  }
	  
	  var offsetTop  = 14;
	  var offsetLeft = 14;
	  
	  if (pos.left + offsetLeft + overlay.width() > $(window).width()) {
		pos.left = pos.left - overlay.width() - ele.width();
		if (pos.left < 0) {
			pos.left = 7;
		}
	  }
	  
	  if (pos.top + offsetTop + overlay.height() > $(window).height()) {
		pos.top = pos.top - overlay.height() - ele.height();
		offsetTop *= -1;
	  }
	  
	  overlay.css({
		position: "absolute",
		top: (pos.top + offsetTop) + "px",
		left: (pos.left + offsetLeft) + "px"
	  });
	  
	  overlay.fadeIn(300);
	}// showFootnoteOverlay
	
	this.hideFootnoteOverlay = function () {
	  var overlay = $('#footnoteOverlay');
	  if (overlay.length > 0) {
		overlay.remove();
	  }
	}// hideFootnoteOverlay

    this.buildFootnoteListTable = function() {
	  this.footnoteListTable = $('<table></table');
	  this.footnoteListTable.addClass('footnoteTable');
	  this.footnoteListTable.css(this.configHandler.getConfig().footnoteTableCss.table);
	  this.buildFootnoteTableRowsAndAppendTo(this.footnoteListTable);
    }// buildFootnoteListTable

    this.buildFootnoteTableRowsAndAppendTo = function(footnoteTable) {
	  for (var i = 0; i < this.dataHandler.getFootnotes().length; i++) {
		  this.buildSingleFootnoteTableRowAndAppendTo(footnoteTable, this.dataHandler.getFootnotes()[i]);
	  }
    }// buildFootnoteTableRowsAndAppendTo

    this.buildSingleFootnoteTableRowAndAppendTo = function(footnoteTable, footnoteObject) {
	  var tr = $('<tr></tr>');
	  tr.addClass('footnoteRow');
	  tr.css(this.configHandler.getConfig().footnoteTableCss.tr);
	  
	  var numberTd = this.getSingleTableCellWithContentAndClassAndCss(footnoteObject.number, 'footnoteNumberCell', this.configHandler.getConfig().footnoteTableCss.td);
	  numberTd.css(this.configHandler.getConfig().footnoteTableCss.numberTd);
	  var textTd = this.getSingleTableCellWithContentAndClassAndCss(footnoteObject.text, 'footnoteTextCell', this.configHandler.getConfig().footnoteTableCss.td);
  
	  tr.append(numberTd);
	  tr.append(textTd);
  
	  tr.appendTo(footnoteTable);
    }// buildSingleFootnoteTableRowAndAppendTo

    this.getSingleTableCellWithContentAndClassAndCss = function(content, className, cssObject) {
	  var td = $('<td></td>');
	  td.addClass(className);
	  td.css(cssObject);
	  td.html(content);
	  return td;
    }// getSingleTableCellWithContentAndClassAndCss

    this.generateCssClassesForInactiveStyleSettings = function() {
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable tr.categoryHeader.inactive td, #'+divId+' table.dataTable tr.categoryHeader.inactive th', this.configHandler.getConfig().tableCss.categoryInactiveHeaderTd);
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable tr.row.inactive td, #'+divId+' table.dataTable tr.row.inactive th', this.configHandler.getConfig().tableCss.dataRowInactiveTd);
    }// generateCssClassesForInactiveStyleSettings

    this.generateCssClassesForMouseHovering = function() {
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable tr.row td.hover_col', this.configHandler.getConfig().tableCss.hoverTdRow);
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable thead th.hover_col', this.configHandler.getConfig().tableCss.hoverColHeaderTh);
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable tr.row td.hover_row', this.configHandler.getConfig().tableCss.hoverTd);
	  this.generateImportantCssClassesForGivenSelectorAndStyleObject('#'+divId+' table.dataTable tr.row th.hover_row', this.configHandler.getConfig().tableCss.hoverTh);
    }// generateCssClassesForMouseHovering

    this.generateImportantCssClassesForGivenSelectorAndStyleObject = function(classSelector, styleDefinitionObject) {
	  var divId = this.divId;
	  var styleText = "";
	  
	  $.each(styleDefinitionObject, function(key, value) { 
		  styleText+=classSelector+' { '+key+':'+value+' !important;} ';
		  });
	  
	  $('head').append($('<style>'+styleText+'</style>'));
    }// generateImportantCssClassesForGivenSelectorAndStyleObject

}// TableBuilder

