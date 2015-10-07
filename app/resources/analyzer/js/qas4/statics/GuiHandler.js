function showLineChart(myDivId) {
    hideDialog(myDivId);
    qas4[myDivId].configHandler.setStatus('lineChartDialog');
    qas4[myDivId].guiBuilder.showDialog();
    selectFirstRadioBox(myDivId);
}

function showBarChart(myDivId) {
    hideDialog(myDivId);
    qas4[myDivId].configHandler.setStatus('barChartDialog');
    qas4[myDivId].guiBuilder.showDialog();
    selectFirstRadioBox(myDivId);
}

function selectFirstRadioBox(myDivId) {
	var $ele = $('#'+myDivId+' div.dialog input:first');
	if (typeof $ele.attr('checked') === 'undefined') {
		$ele.prop('checked',true);
	} else {
    $ele.attr('checked','checked');
	}
}

function showChart(myDivId) {
    qas4[myDivId].guiBuilder.chartBuilder.buildChartToStatus();

    hideDialog(myDivId);
    hideTableContainer(myDivId);
    showChartContainer(myDivId);
	$('#absRelButtons').show();
	var status = qas4[myDivId].configHandler.getStatus();
	if (status.match(/Absolute/g)) {
		$('#absButton').addClass('active');
		$('#relButton').removeClass('active');
	} else if (status.match(/Relative/g)) {
		$('#relButton').addClass('active');
		$('#absButton').removeClass('active');
	} else {
		$('#absButton').removeClass('active');
		$('#relButton').removeClass('active');
	}

	if (status.match(/Year/g)) {
		$('#sortByButtons').show();
		$('#sortByYearButton').addClass('active');
		$('#sortByItemButton').removeClass('active');
	} else if (status.match(/Item/g)) {
		$('#sortByButtons').show();
		$('#sortByItemButton').addClass('active');
		$('#sortByYearButton').removeClass('active');
	} else {
		$('#sortByButtons').hide();
		$('#sortByYearButton').removeClass('active');
		$('#sortByItemButton').removeClass('active');
	}
}

function showTable(myDivId) {
    qas4[myDivId].configHandler.setStatus('table');
    hideDialog(myDivId);
    hideChartContainer(myDivId);
    showTableContainer(myDivId);
	$('#absRelButtons').hide();
	$('#sortByButtons').hide();
}

function hideDialog(myDivId) {
    $('#'+myDivId+' div.dialog').fadeOut('slow');
}

function showTableContainer(myDivId) {
    $('#'+myDivId+' div.tableContainer').fadeIn();
}

function hideTableContainer(myDivId) {
    $('#'+myDivId+' div.tableContainer').hide();
}

function showChartContainer(myDivId) {
    $('#'+myDivId+' div.chartContainer').fadeIn();
}

function hideChartContainer(myDivId) {
    $('#'+myDivId+' div.chartContainer').hide();
}

function dialogBoxOkay(myDivId) {
    setStatusByRadioBox(myDivId);
	var action = $('#'+myDivId+' div.dialog input:radio:checked').val();
	if (action.match(/barChart/g)) {
	  $('.activeMainButton').css("background", "none").removeClass('activeMainButton');
	  $('#barChartButton').addClass('activeMainButton')
						  .css("background-color", qas4[divId].configHandler.getConfig().buttons.mainButtonHoverColor)
						  .trigger('changeActiveMainButton');
	  $('#'+divId).addClass('bar').removeClass('line').removeClass('table');
	} else if (action.match(/lineChart/g)) {
	  $('.activeMainButton').css("background", "none").removeClass('activeMainButton');
	  $('#lineChartButton').addClass('activeMainButton')
						   .css("background-color", qas4[divId].configHandler.getConfig().buttons.mainButtonHoverColor)
						   .trigger('changeActiveMainButton');
	  $('#'+divId).addClass('line').removeClass('bar').removeClass('table');
	}
	$('#exportIMGButton').show();
    showChart(myDivId);
}

function setStatusByRadioBox(myDivId) {
    qas4[myDivId].configHandler.setStatus($('#'+myDivId+' div.dialog input:radio:checked').val());
}

function dialogBoxCancel(myDivId) {
    hideDialog(myDivId);
}

function switchToAbsolute(myDivId) {
    var status = qas4[myDivId].configHandler.getStatus();
	if (status.match(/Relative/g)) {
		var newStatus = status.replace('Relative', 'Absolute');
		qas4[myDivId].configHandler.setStatus(newStatus);
		$('#absButton').addClass('active');
		$('#relButton').removeClass('active');
		showChart(myDivId);
	}
}

function switchToRelative(myDivId) {
    var status = qas4[myDivId].configHandler.getStatus();
	if (status.match(/Absolute/g)) {
		var newStatus = status.replace('Absolute', 'Relative');
		qas4[myDivId].configHandler.setStatus(newStatus);
		$('#relButton').addClass('active');
		$('#absButton').removeClass('active');
		showChart(myDivId);
	}
}


function switchToYearSort(myDivId) {
    var status = qas4[myDivId].configHandler.getStatus();
	if (status.match(/Item/g)) {
		var newStatus = status.replace('Item', 'Year');
		qas4[myDivId].configHandler.setStatus(newStatus);
		$('#sortByYearButton').addClass('active');
		$('#sortByItemButton').removeClass('active');
		showChart(myDivId);
	}
}

function switchToItemSort(myDivId) {
    var status = qas4[myDivId].configHandler.getStatus();
	if (status.match(/Year/g)) {
		var newStatus = status.replace('Year', 'Item');
		qas4[myDivId].configHandler.setStatus(newStatus);
		$('#sortByItemButton').addClass('active');
		$('#sortByYearButton').removeClass('active');
		showChart(myDivId);
	}
}