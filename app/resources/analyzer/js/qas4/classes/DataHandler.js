function DataHandler(myConfigHandler) {
    this.tableData = {};
    this.rowCategoryMapper = null;
    this.visibleCols = null;

    /*constructor*/
    this.configHandler = myConfigHandler;

    var myData = null;
    $.ajax({
	    url: this.configHandler.getConfig().dataPath+this.configHandler.getConfig().dataFile,
	    dataType: 'json',
	    async: false,
	    success : function(data) {
		  myData = data;
	    }

    });
    this.tableData = myData;
	
    this.getTotalNumberOfCols = function() {
	  return this.tableData.numberData[0].length;
    }// getTotalNumberOfCols

    this.getTotalNumberOfRows = function() {
	  return this.tableData.numberData.length;
    }// getTotalNumberOfRows

    this.getTotalNumberOfCategories = function() {
	  return this.tableData.categories.length;
    }// getTotalNumberOfCategories
    
    this.getCategoryName = function (categoryId) {
	  if (categoryId == null) {return null}
	  return this.tableData.categories[categoryId].name;
    }// getCategoryName

    this.getCategoryRows = function (categoryId) {
	  if (categoryId == null) {return this.getRowsWithoutCategory()}
	  return this.tableData.categories[categoryId].rows;
    }// getCategoryRows

    this.getRowsWithoutCategory = function () {
	  var myRowCategoryMapper = this.getRowCategoryMapper();
	  var rowsWithoutCategory = [];
		 
	  for (var row = 0; row < this.getTotalNumberOfRows(); row++) {
		  if (myRowCategoryMapper[row] == null)
		  rowsWithoutCategory.push(row);
	  }
	  return rowsWithoutCategory;
    }// getRowsWithoutCategory

    this.getRowCategoryMapper = function () {
	  if (this.rowCategoryMapper == null) {this.buildRowCategoryMapper();}
	  return this.rowCategoryMapper;
    }// getRowCategoryMapper

    this.buildRowCategoryMapper = function () {
	  myRowCategoryMapper = [];
	  for (var row = 0; row < this.getTotalNumberOfRows(); row++) {
		  myRowCategoryMapper.push(null);
	  }
  
	  for (var category = 0; category < this.getTotalNumberOfCategories(); category ++) {
		  jQuery.each(this.getCategoryRows(category),function() {
		  myRowCategoryMapper[this]=category;
		  });
	  }
	  this.rowCategoryMapper = myRowCategoryMapper;
    }// buildRowCategoryMapper

    this.getActiveRows = function() {
	  return this.tableData.activeRows;
    }// getActiveRows

    this.isRowActive = function(row) {
	  return ($.inArray(row, this.getActiveRows()) > -1);
    }// isRowActive

    this.deactivateRow = function(row) {
	  if (this.isRowActive(row)) {
		  var arrayPos = $.inArray(row, this.getActiveRows());
		  this.getActiveRows().splice(arrayPos, 1);
	  }
    }// deactivateRow

    this.activateRow = function(row) {
	  if (!this.isRowActive(row)) {
		  this.getActiveRows().push(row);
	  }
    }// activateRow

    this.deactivateCategory = function(categoryId) {
	  var rows = this.getCategoryRows(categoryId);
	  for (var i = 0; i < rows.length; i++) {
		  this.deactivateRow(rows[i]);
	  }
    }// deactivateCategory

    this.activateCategory = function(categoryId) {
	  var rows = this.getCategoryRows(categoryId);
	  for (var i = 0; i < rows.length; i++) {
		  this.activateRow(rows[i]);
	  }
    }// activateCategory

    this.getActiveCols = function() {
	  return this.tableData.activeCols;
    }// getActiveCols

	this.getTotalNumberOfActiveRows = function() {
		return $("tr.active").length;
    }// getTotalNumberOfActiveRows

    this.getLastVisibleCol = function() {
	  for (var col = this.getTotalNumberOfCols()-1; col >= 0; col--) {
		  if (this.isColVisible(col)) {
		  return col;
		  }
	  }
	  return null;
    }// getLastVisibleCol

    this.getFirstVisibleCol = function() {
	  for (var col = 0; col < this.getTotalNumberOfCols(); col++) {
		  if (this.isColVisible(col)) {
		  return col;
		  }
	  }
	  return null;
    }// getFirstVisibleCol

    this.getActiveInvisibleColRight = function() {
	  for (var col = this.getLastVisibleCol()+1; col < this.getTotalNumberOfCols(); col++) {
		  if (this.isColActive(col)) {
		  return col;
		  }
	  }
	  return null;
    }// getActiveInvisibleColRight

    this.isActiveInvisibleColRight = function() {
	  return (this.getActiveInvisibleColRight()!=null);
    }// isActiveInvisibleColRight

    this.getActiveInvisibleColLeft = function() {
	  for (var col = this.getFirstVisibleCol()-1; col >= 0; col--) {
		  if (this.isColActive(col)) {
		  return col;
		  }
	  }
	  return null;
    }// getActiveInvisibleColLeft


    this.isActiveInvisibleColLeft = function() {
	  return (this.getActiveInvisibleColLeft()!=null);
    }// isActiveInvisibleColLeft
    

    this.isColVisible = function(col) {
	  return ($.inArray(col, this.getVisibleCols()) > -1);
    }// isColVisible

    this.getVisibleCols = function() {
	  if (this.visibleCols == null) {
		  this.resetVisibleCols();
	  }
	  return this.visibleCols;
    }// getVisibleCols

    this.setColVisible = function(col) {
	  if (!this.isColVisible()) {
		  this.getVisibleCols().push(col);
	  }
    }// setColVisible

    this.setColInvisible = function(col) {
	  if (this.isColVisible(col)) {
		  var arrayPos = $.inArray(col, this.getVisibleCols());
		  this.getVisibleCols().splice(arrayPos, 1);
	  }
    }// setColInvisible

    this.resetVisibleCols = function() {
	  this.visibleCols = this.getActiveCols().slice(0);
    }// resetVisibleCols

    this.getColHeaders = function(colNumber) {
	  var column = this.tableData.colHeaders;
	  if (colNumber >= 0 && !column[colNumber].match(/<span/g)) {
		var arrayOfFootnoteObjects = this.getFootnotesForColumn(colNumber);
		for (var i = 0; i< arrayOfFootnoteObjects.length; i++) {
			column[colNumber] = column[colNumber] +
			                    '<span style="font-family: Arial, Helvetica, sans-serif;">' + this.getFootnoteSymbol(arrayOfFootnoteObjects[i].number) + '</span>'; 
		}
		return column;
	  } else {
		return column;
	  }
    }// getColHeaders

    this.getCategoryNameForRow = function(row) {
	  return this.getCategoryName(this.getCategoryForRow(row));
    }// getCategoryNameForRow
    
    this.getCategoryForRow = function(row) {
	  if (isDefined(this.getRowCategoryMapper()[row])) {
		  return this.getRowCategoryMapper()[row];
	  } else {
		  return null;
	  }
    }// getCategoryForRow

    this.getActiveColHeaders = function(withFootnotes) {
	  var result = [];
	  for (var i = 0; i < this.getTotalNumberOfCols(); i++) {
		  if (this.isColActive(i)) {
		  result.push(this.getColHeaders(withFootnotes ? i : null)[i]);
		  }
	  }
	  return result;
    }// getActiveColHeaders

    this.getActiveRowHeaders = function() {
	  var result = [];
	  for (var i = 0; i < this.getTotalNumberOfRows(); i++) {
		  if (this.isRowActive(i)) {
		  result.push(this.getRowHeader(i));
		  }
	  }
	  return result;
    }// getActiveRowHeaders
    
    this.getActiveRowHeadersWithCategoryNames = function() {
	  var result = [];
	  for (var i = 0; i < this.getTotalNumberOfRows(); i++) {
		  if (this.isRowActive(i)) {
		  result.push(this.getLegendLabelText(i));
		  }
	  }
	  return result;
    }// getActiveRowHeadersWithCategoryNames


    this.getActiveDataSeries = function() {
	  var result = [];
	  for (var i = 0; i< this.getTotalNumberOfRows(); i++) {
		  if (this.isRowActive(i)) {
		  result.push(this.getSingleActiveDataSeries(i));
		  }
	  }
	  return result;
    }// getActiveDataSeries

    this.getActiveDataSeriesGroupedByItems = function () {
	  var result = [];
	  for (var i = 0; i< this.getTotalNumberOfCols(); i++) {
		  if (this.isColActive(i)) {
		  result.push(this.getSingleActiveDataSeriesGroupedByItems(i));
		  }
	  }
	  return result;
    }// getActiveDataSeriesGroupedByItems

    this.getRelativeActiveDataSeriesGroupedByItems = function() {
	  var absoluteDataSeries = this.getActiveDataSeriesGroupedByItems();
	  return this.relativizeDataSeries(absoluteDataSeries);
    }// getRelativeActiveDataSeriesGroupedByItems


    
    this.getRelativeActiveDataSeries = function() {
	  var absoluteDataSeries = this.getActiveDataSeries();
	  return this.relativizeDataSeries(absoluteDataSeries);
    }// getRelativeActiveDataSeries

    this.relativizeDataSeries = function (absoluteDataSeries) {
	  var relativeDataSeries = [];
	  for (var i = 0; i < absoluteDataSeries.length; i++) {
		  if (this.isDataSeriesRelativizeable(absoluteDataSeries[i])) {
		  relativeDataSeries.push(this.relativizeSingleDataSeries(absoluteDataSeries[i]));
		  }
	  }
	  return relativeDataSeries;
    }// relativizeDataSeries
    
    this.isDataSeriesRelativizeable = function (absoluteDataSeries) {
	  return this.hasRelativizeableBase (absoluteDataSeries);
    }// isDataSeriesRelativizeable
    
    this.hasRelativizeableBase = function(absoluteDataSeries) {
	  return this.hasNumbersInSeries(absoluteDataSeries)
    }// hasRelativizeableBase
    
	this.hasNumbersInSeries = function(absoluteDataSeries) {
	  for(var j = 0; j < absoluteDataSeries.data.length; j++) {
		var value = absoluteDataSeries.data[j].y;
		if (!isNaN(value) && value != null) {
		  return true;
		}
	  }
	  return false;
	}
	
    this.relativizeSingleDataSeries = function(singleAbsoluteDataSeries) {
	  var result = singleAbsoluteDataSeries;
	  result.data = this.relativizeDataObjectArray(singleAbsoluteDataSeries.data);
	  result.yAxis = 0;
	  result.unit = '%'
	  return result;
    }// relativizeSingleDataSeries

    this.relativizeDataObjectArray = function (absoluteDataObjectArray) {
			var firstValue = null;
			var relativeDataObjectArray = [];
			var isDescending = this.tableData.colHeaders[0].search(/^\d\d\d\d$/) >= 0
												 && parseInt(this.tableData.colHeaders[0]) > parseInt(this.tableData.colHeaders[1]);
			var i = isDescending ? (absoluteDataObjectArray.length - 1) : 0;

			while (true) {
				if (!isNaN(absoluteDataObjectArray[i].y) && absoluteDataObjectArray[i].y != null) {
					if (!firstValue) {
						firstValue = absoluteDataObjectArray[i].y;
					}
					var relativeDataObject = {};
					var absoluteDataObject = absoluteDataObjectArray[i];
					
					if (firstValue > 0 || firstValue < 0) {
						relativeDataObject.y = absoluteDataObject.y/firstValue*100 ;
					} else {
						relativeDataObject.y = 0;
					}					
					relativeDataObject.yString = Math.floor(relativeDataObject.y*10)/10;
					relativeDataObject.footnote = absoluteDataObject.footnote;
					
					relativeDataObjectArray.push(relativeDataObject);
				} else {
					relativeDataObjectArray.push(null);
				}
				
				if (isDescending) {
					if (i <= 0) {
						relativeDataObjectArray.reverse();
						break;
					} else {
						i -= 1;
					}
				} else {
					if (i + 1 >= absoluteDataObjectArray.length) {
						break;
					} else {
						i += 1;
					}
				}
			}
			
			return relativeDataObjectArray;
    }// relativizeDataObjectArray
    
    this.getSingleActiveDataSeriesGroupedByItems = function(col) {
	  var result = {name:null, data:[]};
	  result.name = this.getColHeaders()[col];
	  result.data = this.buildDataObjectArrayGroupedByItems(col);
	  result.legendLabelText = this.getColHeaders()[col];
	  result.footnote = '';
	  var footnotes = this.getFootnotesForColumn(col);
	  if (footnotes.length) {
		for (var i = 0; i < footnotes.length; i++) {
		  result.footnote += '<span style="font-family: Arial, Helvetica, sans-serif;">' +
							this.getFootnoteSymbol(footnotes[i].number) + '</span>';
		}
	  }
	  return result;
    }// getSingleActiveDataSeriesGroupedByItems

    this.getSingleActiveDataSeries = function (row) {
	  var result = {name:null, data:[]};
	  result.name = this.getRowHeader(row);
	  result.data = this.buildDataObjectArray(row);
	  result.legendLabelText = this.getLegendLabelText(row);
	  result.unit = this.getUnit(row);
	  result.yAxis = this.getAxisNumber(row);
	  
	  result.footnote = '';
	  var footnotes = this.getFootnotesForRow(row);
	  if (footnotes.length) {
		for (var i = 0; i < footnotes.length; i++) {
		  result.footnote += '<span style="font-family: Arial, Helvetica, sans-serif;">' +
							this.getFootnoteSymbol(footnotes[i].number) + '</span>';
		}
	  }
	  return result;
    }// getSingleActiveDataSeries

    this.buildDataObjectArray = function(row) {
	  return this.getActiveNumberAndStringData(row);
    }// buildDataObjectArray

    this.buildDataObjectArrayGroupedByItems = function (col) {
	  return this.getActiveNumberAndStringAndUnitAndAxisDataForColumn(col);
    }// buildDataObjectArrayGroupedByItems

    this.getLegendLabelText = function(row) {
	  if (this.getCategoryNameForRow(row) != null) {
		  return this.getCategoryNameForRow(row)+': '+this.getRowHeader(row);
	  } else {
		  return this.getRowHeader(row);
	  }
    }// getLegendLabelText

    this.getAxisNumber = function(row) {
	  var activeComparisonKeys = this.getActiveComparisonKeys();
	  for (var i = 0; i<activeComparisonKeys.length; i++) {
		  if (this.getComparisonKey(row) == activeComparisonKeys[i]) {
		  return i;
		  }
	  }
	  return 0;
    }// getAxisNumber

    this.getRowHeader = function (row) {
	  return this.tableData.rowHeaders[row];
    }// getRowHeader

    this.getUnit = function(row) {
	  return this.tableData.units[row];
    }// getUnit

    this.getComparisonKey = function(row) {
	  return this.tableData.comparisonKey[row];
    }// getComparisonKey

    this.getActiveComparisonKeys = function() {
	  var activeComparisonKeys = [];
	  var activeRows = this.getActiveRows();
	  for (var i = 0; i < activeRows.length; i++) {
		  var comparisonKey = this.getComparisonKey(activeRows[i]);
		  if ($.inArray(comparisonKey, activeComparisonKeys) == -1) {
		  activeComparisonKeys.push(comparisonKey);
		  }
	  }
	  return activeComparisonKeys;
    }// getActiveComparisonKeys

    this.getTotalNumberOfActiveComparisionKeys = function () {
	  return this.getActiveComparisonKeys().length;
    }// getTotalNumberOfActiveComparisionKeys

    this.getTotalNumberOfActiveRows = function () {
	  return this.getActiveRows().length;
    }// getTotalNumberOfActiveRows

    this.getActiveUnits = function() {
	  var activeUnits = [];
	  var activeRows = this.getActiveRows();
	  for (var i = 0; i < activeRows.length; i++) {
		  var unit = this.getUnit(activeRows[i]);
		  if ($.inArray(unit, activeUnits) == -1) {
		  activeUnits.push(unit);
		  }
	  }
	  return activeUnits;
    }// getActiveUnits

    this.getUnitsForActiveComparisonKeys = function() {
	  var comparisonKeys = this.getActiveComparisonKeys();
	  var units = [];
	  var activeRows = this.getActiveRows();
	  for (var keyCounter = 0; keyCounter < comparisonKeys.length; keyCounter++) {
		  for (var rowCounter = 0; rowCounter<activeRows.length; rowCounter++) {
		  if (comparisonKeys[keyCounter]==this.getComparisonKey(activeRows[rowCounter])) {
			  units.push(this.getUnit(activeRows[rowCounter]));
			  break;
		  }
		  }
	  }
	  return units;
    }// getUnitsForActiveComparisonKeys

    this.getActiveNumberAndStringData = function (row) {
	  var result = [];
	  for (var col = 0; col < this.getTotalNumberOfCols(); col++) {
		  if (this.isColActive(col)) {
			var footnotes = this.getFootnotesForCell(col, row);
			var footnote = '';
			if (footnotes.length) {
			  for (var i = 0; i < footnotes.length; i++) {
				footnote += '<span style="font-family: Arial, Helvetica, sans-serif;">' +
						this.getFootnoteSymbol(footnotes[i].number) + '</span>';
			  }
			}
			result.push(
				  {
				  y:this.getNumberCellData(row, col),
				  yString:this.getStringCellData(row, col),
				  'footnote':footnote
				   });
		  }
	  }
	  return result;
    }// getActiveNumberAndStringData

    this.getActiveNumberAndStringAndUnitAndAxisDataForColumn = function (col) {
	  var result = [];
	  for (var row = 0; row < this.getTotalNumberOfRows(); row++) {
		  if (this.isRowActive(row)) {
			var footnotes = this.getFootnotesForCell(col, row);
			var footnote = '';
			if (footnotes.length) {
			  for (var i = 0; i < footnotes.length; i++) {
				footnote += '<span style="font-family: Arial, Helvetica, sans-serif;">' +
						this.getFootnoteSymbol(footnotes[i].number) + '</span>';
			  }
			}
			result.push(
				  {
				  y:this.getNumberCellData(row, col),
				  yString: this.getStringCellData(row,col),
				  yAxis:this.getAxisNumber(row),
				  unit:this.getUnit(row),
				  'footnote':footnote
				  });
		  }
	  }
	  return result;
    }// getActiveNumberAndStringAndUnitAndAxisDataForColumn

    this.getNumberCellData = function(row, col) {
	  return this.tableData.numberData[row][col];
    }// getNumberCellData

    this.getStringCellData = function(row, col) {
	  var val = this.tableData.stringData[row][col];
	  return val;
    }// getStringCellData

    this.isColActive = function(col) {
	  return ($.inArray(col, this.getActiveCols()) > -1);
    }// isColActive

    this.activateCol = function(col) {
	  if (!this.isColActive(col)) {
		  this.getActiveCols().push(col);
	  }
    }// activateCol

    this.deactivateCol = function(col) {
	  if (this.isColActive(col)) {
		  var arrayPos = $.inArray(col, this.getActiveCols());
		  this.getActiveCols().splice(arrayPos, 1);
	  }
    }// deactivateCol


    this.getWarnings = function () {
	  var result = [];
  
	  var numberOfComp = this.configHandler.getConfig().numberOfComparableValues
	  if(!numberOfComp){
		  numberOfComp = 10;
	  }

	  var numberOfComparableValuesShowWarning = this.configHandler.getConfig().numberOfComparableValuesShowWarning;
	  if(!numberOfComparableValuesShowWarning){
		  numberOfComparableValuesShowWarning = 2;
	  }
	
	  if (this.getTotalNumberOfActiveRows() > numberOfComp) {
		  result.push('tooManyActiveKeys');		
	  } else if (this.getTotalNumberOfActiveComparisionKeys() > numberOfComparableValuesShowWarning) { 
		  result.push('moreThanTwoComparisionKeysWarning');
	  }
  
	  if (!this.isItemGroupedComparisionPossible()) {
		  if (this.configHandler.getConfig().tooManyComparisionKeys) {
			  result.push('tooManyComparisionKeysForItemGroupedChartWarning');
		  }		
	  }
  
	  return result;
    }// getWarnings

    this.isItemGroupedComparisionPossible = function() {
	  return (!this.configHandler.isStatusForBarChart()
		  || this.getTotalNumberOfActiveComparisionKeys() <= 1);
    }// isItemGroupedComparisionPossible

    
    this.getFootnotes = function() {
	  return this.tableData.footnotes;
    }// getFootnotes

    this.getFootnotesForColumn = function(columnNumber) {
	  var footnotes = [];
	  for (var i = 0; i < this.getFootnotes().length; i++) {
		  if ($.inArray(columnNumber,this.getFootnotes()[i].col) != -1) {
		  footnotes.push(this.getFootnotes()[i]);
		  }
	  }
	  return footnotes;
    }// getFootnotesForColumn

    this.getFootnotesForRow = function(rowNumber) {
	  var footnotes = [];
	  for (var i = 0; i < this.getFootnotes().length; i++) {
		  if ($.inArray(rowNumber,this.getFootnotes()[i].row) != -1) {
		  footnotes.push(this.getFootnotes()[i]);
		  }
	  }
	  return footnotes;
    }// getFootnotesForRow
	
	this.getFootnotesForCategory = function(catNumber) {
	  var footnotes = [];
	  for (var i = 0; i < this.getFootnotes().length; i++) {
		  if ($.inArray(catNumber,this.getFootnotes()[i].category) != -1) {
		  footnotes.push(this.getFootnotes()[i]);
		  }
	  }
	  return footnotes;
    }// getFootnotesForCategory

    this.getFootnotesForCell = function (columnNumber, rowNumber) {
	  var footnotes = [];
	  for (var i = 0; i < this.getFootnotes().length; i++) {
		  if (this.isFootnoteIsForCell(this.getFootnotes()[i], columnNumber, rowNumber)) {
		  footnotes.push(this.getFootnotes()[i]);
		  }
	  }
	  return footnotes;
    }// getFootnotesForCell
    
    this.isFootnoteIsForCell = function(footnote, columnNumber, rowNumber) {
	  for (var i = 0; i < footnote.dataCell.length; i++) {
		  if (footnote.dataCell[i].col == columnNumber && footnote.dataCell[i].row == rowNumber) {
		  return true;
		  }
	  }
	  return false;
    }// isFootnoteIsForCell

	this.getFootnoteSymbol = function (footnote) {
		var translator = {
			1 : '\u00b9',
			2 : '\u00b2',
			3 : '\u00b3',
			4 : '\u2074',
			5 : '\u2075',
			6 : '\u2076',
			7 : '\u2077',
			8 : '\u2078',
			9 : '\u2079',
			0 : '\u2070'
		};
		if (footnote.length == 1) {
			return translator[footnote];
		}
		var ret = '';
		var eles = footnote.split('');
		for (var i = 0; i < eles.length; i++) {
			if (translator[eles[i]]) {
				ret += translator[eles[i]];
			}
		}
		return ret;
	}// getFootnoteSymbol
    
}

/*statics*/
function isBoolean(o) {return 'boolean' === typeof o;}
function isDefined(o) {return !('undefined' === typeof o);}

