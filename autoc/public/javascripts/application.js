// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var active = -1;
var selected_li = null;
var hasFocus = false;
var timeout = null;

function findTownsPos(obj) {
	var curleft = obj.offsetLeft || 0;
	var curtop = obj.offsetTop || 0;
	while (obj = obj.offsetParent) {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	}
	return {x:curleft, y:curtop};
}

function classifierSelect(li){
	var lis = $("li", "#groups");
	if (!lis[0]) return;
	lis.removeClass("ac_over");
	$(li).addClass("ac_over");
	hasFocus = true
}

function casesSelect(li){
	var lis = $("li", "#cases_results");
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

	var lis = $("li", "#cases_results");
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
	var li = $("li.ac_over", "#cases_results")[0];
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

function selectCasesItem(li){
	$("#cases_link").html(li.innerHTML);
	hasFocus = false;
	hideResultsNow();
}

function selectClassifierGroup(li){
  var lis = $("li", "#groups");
  lis.removeClass("ac_liselected");
  $(li).addClass("ac_liselected");
  requestSubgroupsData($(li).attr("id"));
}

function selectClassifierSubgroup(li){
  var lis = $("li", "#subgroups");
  lis.removeClass("ac_liselected");
  $(li).addClass("ac_liselected");
  requestCategoriesData($(li).attr("id"));
};

function selectClassifierCategory(li){
	$("#classifier_link").html(li.innerHTML);
	hasFocus = false;
	hideClassifierNow();
}

function requestCategoriesData(q){
	var data = null;
	$.get("/main/categories/" + q, function(data) {
		receiveCategoriesData(data);
	});
}

function receiveCategoriesData(data) {
	if (data) {
		$("li", "#subgroups").removeClass("ac_loading");
		// if( !hasFocus || data.length == 0 ) return hideResultsNow();
		$("#categories").html(data);
	}
};


function requestSubgroupsData(q){
	var data = null;
	$.get("/main/subgroups/" + q, function(data) {
		receiveSubgroupsData(data);
	});
}

function receiveSubgroupsData(data) {
	if (data) {
		$("li", "#groups").removeClass("ac_loading");
		// if( !hasFocus || data.length == 0 ) return hideResultsNow();
		$("#subgroups").html(data);
	}
};



function requestManData(q){
	var data = null;
	$.get("/main/show_man/" + q, function(data) {
		receiveManData(data);
	});
}

function receiveManData(data) {
	if (data) {
		$("li", "#cases_results").removeClass("ac_loading");
		// if( !hasFocus || data.length == 0 ) return hideResultsNow();
		$("#cases_man").html(data);
	}
};

function hideResults() {
	if (timeout) clearTimeout(timeout);
	timeout = setTimeout(hideResultsNow, 500);
};

function hideResultsNow() {
  if (!hasFocus){
		if (timeout) clearTimeout(timeout);
		if ($("#cases").is(":visible")) {
			$("#cases").hide();
		}
  }
};

function hideClassifierNow(){
  if (!hasFocus){
    var lis = $("li", "#classifier");
    lis.removeClass("ac_liselected")
    $("#subgroups").html("");
    $("#categories").html("");
		if (timeout) clearTimeout(timeout);
		if ($("#classifier").is(":visible")) {
			$("#classifier").hide();
		}
  }
}



