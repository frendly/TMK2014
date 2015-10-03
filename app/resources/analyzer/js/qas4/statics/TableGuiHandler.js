function toggleCategoryVisible(myDivId, category) {
    // if not hidden
    var categoryHeaderObject = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader');
    
    if (!categoryHeaderObject.hasClass('hidden')) {
	categoryHeaderObject.addClass('hidden');
	hideCategoryIfClassHidden(myDivId, category);
    } else {
	categoryHeaderObject.removeClass('hidden');
	setCategoryVisible(myDivId, category);
    }
}

function hideCategoryIfClassHidden(myDivId, category) {
    var categoryHeaderObject = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader');
    if (categoryHeaderObject.hasClass('hidden')) {
	var categoryRows = $('#'+myDivId+' table.dataTable tr.category_'+category+'.row');
	var dropDownButton = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader img.dropDownButton');
	var dropUpButton = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader img.dropUpButton');
	categoryRows.hide();
	dropDownButton.show();
	dropUpButton.hide();
    }
}

function setCategoryVisible(myDivId, category) {
    var activeRows = $('#'+myDivId+' table.dataTable tr.category_'+category+'.row.active');
    var inactiveRows = $('#'+myDivId+' table.dataTable tr.category_'+category+'.row.inactive');
    var dropDownButton = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader img.dropDownButton');
    var dropUpButton = $('#'+myDivId+' table.dataTable tr.category_'+category+'.categoryHeader img.dropUpButton');

    activeRows.show();
    fadeToInactiveWithSpeed(myDivId,inactiveRows,0);
    dropDownButton.hide();
    dropUpButton.show();
}

function deactivateCategory (myDivId, categoryId) {
    var activeRows = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+'.row.active');
    activeRows.addClass('inactive');
    activeRows.removeClass('active');

    var inactiveRows = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+'.row.inactive');
    fadeToInactiveWithSpeed(myDivId,inactiveRows, 0);
    qas4[myDivId].dataHandler.deactivateCategory(categoryId);

    var addRowButton = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+' img.addRowButton');
    var removeRowButton = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+' img.removeRowButton');
    addRowButton.show();
    removeRowButton.hide();

    hideCategoryIfAllRowsAreInactive(myDivId, categoryId);
}

function activateCategory (myDivId, categoryId) {
    var inactiveRows = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+'.row.inactive');
    inactiveRows.addClass('active');
    inactiveRows.removeClass('inactive');

    var activeRows = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+'.row.active');
    activeRows.fadeTo(0,1);

    qas4[myDivId].dataHandler.activateCategory(categoryId);

    var addRowButton = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+' img.addRowButton');
    var removeRowButton = $('#'+myDivId+' table.dataTable tr.category_'+categoryId+' img.removeRowButton');
    addRowButton.hide();
    removeRowButton.show();

    hideCategoryIfAllRowsAreInactive(myDivId, categoryId);
}

function deactivateRow (myDivId, rowNumber) {
    var row = $('#'+myDivId+' tr.row_'+rowNumber);
    var rowCells = $('#'+myDivId+' tr.row_'+rowNumber+ ' td').add($('#'+myDivId+' tr.row_'+rowNumber+ ' th'));
    fadeToInactiveWithSpeed(myDivId, row, 0);

    row.removeClass('active');
    row.addClass('inactive');

    qas4[myDivId].dataHandler.deactivateRow(rowNumber);

    var removeRowButton = $('#'+myDivId+' table.dataTable tr.row_'+rowNumber+' img.removeRowButton');
    var addRowButton = $('#'+myDivId+' table.dataTable tr.row_'+rowNumber+' img.addRowButton');

    removeRowButton.hide();
    addRowButton.show();

    var categoryNumber = qas4[myDivId].dataHandler.getCategoryForRow(rowNumber);
    hideCategoryIfAllRowsAreInactive(myDivId, categoryNumber);
}
 
function hideCategoryIfAllRowsAreInactive(myDivId, categoryNumber) {
    var categoryHeaderRowsWithoutActiveDataRows = $('#'+myDivId+' table.dataTable:not(:has(tr.category_'+categoryNumber+'.active)) tr.category_'+categoryNumber+'.categoryHeader');
	if (qas4[myDivId].dataHandler.getActiveRowHeaders().length > 0) {
	  fadeToInactive(myDivId,categoryHeaderRowsWithoutActiveDataRows);
	  categoryHeaderRowsWithoutActiveDataRows.addClass('inactive');
	}

    var removeCategoryButton = $('#'+myDivId+' table.dataTable:not(:has(tr.category_'+categoryNumber+'.active)) tr.category_'+categoryNumber+'.categoryHeader img.removeCategoryButton');
    var addCategoryButton = $('#'+myDivId+' table.dataTable:not(:has(tr.category_'+categoryNumber+'.active)) tr.category_'+categoryNumber+'.categoryHeader img.addCategoryButton');

    removeCategoryButton.hide();
    addCategoryButton.show();

    var categoryHeaderRowsWithActiveDataRows = $('#'+myDivId+' table.dataTable:has(tr.category_'+categoryNumber+'.active) tr.category_'+categoryNumber+'.categoryHeader');
    categoryHeaderRowsWithActiveDataRows.show();
    categoryHeaderRowsWithActiveDataRows.removeClass('inactive');

    var addCategoryButtonOfActiveCategory = $('#'+myDivId+' table.dataTable:has(tr.category_'+categoryNumber+'.active) tr.category_'+categoryNumber+'.categoryHeader img.addCategoryButton');
    var removeCategoryButtonOfActiveCategory = $('#'+myDivId+' table.dataTable:has(tr.category_'+categoryNumber+'.active) tr.category_'+categoryNumber+'.categoryHeader img.removeCategoryButton');

    addCategoryButtonOfActiveCategory.hide();
    removeCategoryButtonOfActiveCategory.show();
}

function activateRow (myDivId, rowNumber) {
    var row = $('#'+myDivId+' table.dataTable tr.row_'+rowNumber);
    row.show();
    row.removeClass('inactive');
    row.addClass('active');

    qas4[myDivId].dataHandler.activateRow(rowNumber);
    
    var removeRowButton = $('#'+myDivId+' table.dataTable tr.row_'+rowNumber+' img.removeRowButton');
    var addRowButton = $('#'+myDivId+' table.dataTable tr.row_'+rowNumber+' img.addRowButton');

    addRowButton.hide();
    removeRowButton.show();

    var categoryNumber = qas4[myDivId].dataHandler.getCategoryForRow(rowNumber);
    hideCategoryIfAllRowsAreInactive(myDivId, categoryNumber);
}

function fadeToInactiveWithSpeed(myDivId, rowObject, speed) {
	var checked = $('#'+myDivId+' .toggleInactiveRowsCheckbox').attr('checked');
	if (typeof checked === 'undefined') {
		checked = $('#'+myDivId+' .toggleInactiveRowsCheckbox').prop('checked');
	}
  if(!checked) {
			rowObject.css({"display":"none"});
  } else {
			rowObject.show();
  }
}

function fadeToInactive(myDivId, rowObject) {
    fadeToInactiveWithSpeed(myDivId, rowObject, 500);
}

function toggleInactiveRows(myDivId) {
	disableScrollCols(myDivId);
	var checked = $('#'+myDivId+' .toggleInactiveRowsCheckbox').attr('checked');
	if (typeof checked === 'undefined') {
		checked = $('#'+myDivId+' .toggleInactiveRowsCheckbox').prop('checked');
	}
  if(checked) {
		unhideInactiveRows (myDivId);
  } else {
		hideInactiveRows (myDivId);
  }
  checkScrollColsRequiredAndDoEnable(myDivId);
}

function unhideInactiveRows (myDivId) {
    checkAndShowAllCategories(myDivId);
    var inactiveRows = $('#'+myDivId+' table.dataTable tr.row.inactive');
    fadeToInactive(myDivId, inactiveRows);
}

function checkAndHideCategoryIfHidden (myDivId) {
    var totalNumberOfCategories = qas4[myDivId].dataHandler.getTotalNumberOfCategories();
    for (var i = 0; i < totalNumberOfCategories; i++) {
	hideCategoryIfAllRowsAreInactive(myDivId, i);
	hideCategoryIfClassHidden(myDivId, i);
    }
}

function checkAndShowAllCategories (myDivId) {
    var totalNumberOfCategories = qas4[myDivId].dataHandler.getTotalNumberOfCategories();
    for (var i = 0; i < totalNumberOfCategories; i++) {
	setCategoryVisible(myDivId, i);
	hideCategoryIfAllRowsAreInactive(myDivId, i);
    }
}

function hideInactiveRows (myDivId) {
    var inactiveRows = $('#'+myDivId+' table.dataTable tr.row.inactive');
    inactiveRows.fadeOut(0);
    checkAndHideCategoryIfHidden(myDivId);
}

function toggleInactiveCol(myDivId, colNumber) {
    updateVisibleCols(myDivId, colNumber);
}

function toggleSelectAllYearsCheckbox(myDivId) {
    var toggleAllYearsCheckbox = $('#'+myDivId+' input.toggleShowAllYearsCheckbox');
		var checked = toggleAllYearsCheckbox.attr('checked');
		if (typeof checked === 'undefined') {
			if (toggleAllYearsCheckbox.prop('checked')) {
				$('input.toggleInactiveColsCheckbox').prop('checked',true);
				updateVisibleCols(myDivId);
			} else {
				toggleAllYearsCheckbox.prop('checked', false);
			}
		} else {
			if (toggleAllYearsCheckbox.attr('checked')) {
				$('input.toggleInactiveColsCheckbox').attr('checked',true);
				updateVisibleCols(myDivId);
			} else {
				toggleAllYearsCheckbox.attr('checked', false);
			}
		}
}

function updateVisibleCols(myDivId, colNumber) {
    var allchecked = true;
    var numberOfCols = qas4[myDivId].dataHandler.getTotalNumberOfCols();
    for (var i = 0; i < numberOfCols; i++) {
	  var toggleInactiveColCheckbox = $('#'+myDivId+' input.toggleInactiveColsCheckbox.col_'+i);
		var checked = toggleInactiveColCheckbox.attr('checked');
		if (typeof checked === 'undefined') {
			checked = toggleInactiveColCheckbox.prop('checked');
		}
	  if (checked) {
		  toggleInactiveColCheckbox.parent('li').addClass('active');
		  disableScrollCols(myDivId);
		  activateCol(myDivId, i);
		  checkScrollColsRequiredAndDoEnable(myDivId);
	  } else {
		  toggleInactiveColCheckbox.parent('li').removeClass('active');
		  allchecked = false;
		  if (qas4[myDivId].dataHandler.isColActive(i) || i == colNumber) {
			disableScrollCols(myDivId);
			deactivateCol(myDivId, i);
			checkScrollColsRequiredAndDoEnable(myDivId);
		  }
	  }
    } 

    var toggleShowAllYearsCheckbox = $('#'+myDivId+' input.toggleShowAllYearsCheckbox');
		var checked = toggleShowAllYearsCheckbox.attr('checked');
		if (typeof checked === 'undefined') {
			if (allchecked) {
				toggleShowAllYearsCheckbox.prop('checked',true);
			} else {
				toggleShowAllYearsCheckbox.prop('checked', false);
			}
		} else {
			if (allchecked) {
				toggleShowAllYearsCheckbox.attr('checked',true);
			} else {
				toggleShowAllYearsCheckbox.removeAttr('checked');
			}
		}
	
	checkForVisibleFootnotes(qas4[divId].configHandler.getConfig());
}


function deactivateCol(myDivId, colNumber) {
    qas4[myDivId].guiBuilder.tableBuilder.hideColAndSetInactive(colNumber);
}

function activateCol(myDivId, colNumber) {
    qas4[myDivId].guiBuilder.tableBuilder.unhideColAndSetActive(colNumber);
}

function checkScrollColsRequiredAndDoEnable(myDivId) {
    if (isScrollColsRequired(myDivId)) {
	  showColScrollButtons(myDivId);
	  recursiveScrollHideLastActiveColsWhileRequired(myDivId);
    } else {
	  hideColScrollButtons(myDivId);
    }
}

function disableScrollCols(myDivId) {
    qas4[myDivId].guiBuilder.tableBuilder.unScrollHideActiveCols();
}

function recursiveScrollHideLastActiveColsWhileRequired(myDivId) {
    hideLeftestVisibleCol(myDivId);
    if (isScrollColsRequired(myDivId)) {
	  recursiveScrollHideLastActiveColsWhileRequired(myDivId);
    } 
}

function isScrollColsRequired(myDivId) {
    var tableContainer = $('#'+myDivId+' .tableContainer');
    var table = $('#'+myDivId+' .tableContainer table');
	var ie6width = $('body div').css('width');
	var ie6padding = $('#'+myDivId).css('padding-left'),
		ie6width = ie6width.replace(/px/g, '') - (2 * (ie6padding.replace(/px/g, '')));
	var isLastCol = qas4[myDivId].dataHandler.getFirstVisibleCol() == qas4[myDivId].dataHandler.getLastVisibleCol();
    return !isLastCol && (
						  (tableContainer.width() > $(window).width() && $(window).width() > 0) ||
						  tableContainer.width() < table.outerWidth() ||
						  ie6width < table.outerWidth()
						  );
}

function showColScrollButtons(myDivId) {
    var scrollButton = $('#'+myDivId+' .colScrollButton');
    scrollButton.show();
}

function hideColScrollButtons(myDivId) {
    var scrollButton = $('#'+myDivId+' .colScrollButton');
    scrollButton.hide();
}

function colScrollLeft(myDivId) {
    if (isActiveInvisibleColLeft(myDivId)) {
	  showActiveColLeftOfVisibleCols(myDivId);
	  hideRightestVisibleCol(myDivId);
    }
}

function colScrollRight(myDivId) {
    if (isActiveInvisibleColRight(myDivId)) {
	  showActiveColRightOfVisibleCols(myDivId);
	  hideLeftestVisibleCol(myDivId);
    }
}

function hideRightestVisibleCol(myDivId) {
    var col = qas4[myDivId].dataHandler.getLastVisibleCol();
    qas4[myDivId].guiBuilder.tableBuilder.scrollHideCol(col);
}

function showActiveColLeftOfVisibleCols(myDivId) {
    var col = qas4[myDivId].dataHandler.getActiveInvisibleColLeft();
    qas4[myDivId].guiBuilder.tableBuilder.unScrollHideCol(col);
}

function hideLeftestVisibleCol(myDivId) {
    var col = qas4[myDivId].dataHandler.getFirstVisibleCol();
    qas4[myDivId].guiBuilder.tableBuilder.scrollHideCol(col);
}

function showActiveColRightOfVisibleCols(myDivId) {
    var col = qas4[myDivId].dataHandler.getActiveInvisibleColRight();
    qas4[myDivId].guiBuilder.tableBuilder.unScrollHideCol(col);
}

function isActiveInvisibleColRight(myDivId) {
    return qas4[myDivId].dataHandler.isActiveInvisibleColRight();
}

function isActiveInvisibleColLeft(myDivId) {
    return qas4[myDivId].dataHandler.isActiveInvisibleColLeft();
}

function mouseHoverOn(divId, row, col) {
    $('#'+divId+' table.dataTable td.row_'+row).addClass("hover_row");
    $('#'+divId+' table.dataTable th.row_'+row).addClass("hover_row");

    $('#'+divId+' table.dataTable td.col_'+col).addClass("hover_col");
    $('#'+divId+' table.dataTable th.col_'+col).addClass("hover_col");
}

function mouseHoverOff(divId, row, col) {
    $('#'+divId+' table.dataTable td.row_'+row).removeClass("hover_row");
    $('#'+divId+' table.dataTable th.row_'+row).removeClass("hover_row");

    $('#'+divId+' table.dataTable td.col_'+col).removeClass("hover_col");
    $('#'+divId+' table.dataTable th.col_'+col).removeClass("hover_col");
}

function checkForVisibleFootnotes(cfg) {
  $('.footnoteRow').removeClass('visible').hide();
  var $sups = $('table.dataTable sup:visible');
  if($sups.length > 0) {
	var knownFootnotes = [];
	$sups.each(function() {
	  var footnoteMarker = $(this).text();
	  if (cfg.footnoteSpacer) {
		var regexp = new RegExp(cfg.footnoteSpacer, 'g');
		footnoteMarker = footnoteMarker.replace(regexp, '');
	  }
	  if (!knownFootnotes[footnoteMarker]) {
		knownFootnotes[footnoteMarker] = 1;
	  }
	});
	$('.footnoteNumberCell').each(function() {
	  var footnoteMarker = $(this).text();
	  if (knownFootnotes[footnoteMarker] == 1) {
		$(this).parent().addClass('visible').show();
	  }
	});
  }
}