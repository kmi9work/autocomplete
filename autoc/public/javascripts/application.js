// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var active = -1;
var selected_li = null;
var hasFocus = false;

function findTownsPos(obj) {
	var curleft = obj.offsetLeft || 0;
	var curtop = obj.offsetTop || 0;
	while (obj = obj.offsetParent) {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	}
	return {x:curleft, y:curtop};
}

function townsSelect(li){
    alert(li);
  var lis = $("li", "#towns_results");
	if (!lis[0]) return;

	lis.removeClass("ac_over");
	lis.removeClass("ac_loading");
	$(li).addClass("ac_over");
  selected_li = lis[active];
  hasFocus = true
	$(li).addClass("ac_loading");
	requestManData($(li).attr("id"));
}

function moveTownsSelect(step) {
  
  var lis = $("li", "#towns_results");
	if (!lis[0]) return;

	active += step;
  
	if (active < 0) {
		active = 0;
	} else if (active >= lis.size()) {
		active = lis.size() - 1;
	}
	lis.removeClass("ac_over");
	lis.removeClass("ac_loading");
	$(lis[active]).addClass("ac_over");
	selected_li = lis[active];
  hasFocus = true
	$(lis[active]).addClass("ac_loading");
	requestManData($(lis[active]).attr("id"));
	
	if (lis[active]){
    lis[active].scrollIntoViewIfNeeded();
  }
};

function selectTownsCurrent() {
	var li = $("li.ac_over", "#towns_results")[0];
	if (!li) {
    // active = 0;
		moveTownsSelect(1);
	}
	if (li) {
		selectTownsItem(li);
		return true;
	} else {
		return false;
	}
};

function selectTownsItem(li) {
	var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
	li.removeClass("ac_over");
	li.addClass("ac_liselected");
	$results.html("");
	$input.val(v);
	hasFocus = false;
	if (options.isMan){
		hideManNow();
	}
	if (fl){
	  hideResultsNow();
	}
	if (options.onItemSelect) setTimeout(function() { options.onItemSelect(li) }, 1);
};

function requestManData(q){
  var data = null;
  $.get("/main/show_man/" + q, function(data) {
    receiveTownsData(q, data);
  });
}

function receiveManData(q, data) {
	if (data) {
		$(selected_li).removeClass("ac_loading");
    // if( !hasFocus || data.length == 0 ) return hideResultsNow();
		$("#towns_man").html(data);
	}
};




