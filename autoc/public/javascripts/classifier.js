jQuery.classifier = function(input, options) {
	// Create a link to self
	var me = this;

	// Create jQuery object for input element
	var $input = $(input).attr("autocomplete", "off");

	// Apply inputClass if necessary
	if (options.inputClass) $input.addClass(options.inputClass);

	// Create results
	// Create jQuery object for results
	// Add to body element
  var classifier;
	var $classifier;
	var selected_li;
	var groups;
	var $groups;
	var subgroups;
	var $subgroups;
	var categories;
  var $categories;
  
  groups     = document.createElement("div");
  $groups    = $(groups);
  $groups.css("display", "inline-block").css("float", "left").addClass(options.groupsClass);
  
  subgroups  = document.createElement("div");
  $subgroups = $(subgroups);
  $subgroups.css("display", "inline-block").css("float", "center").addClass(options.subgroupsClass);
  
  categories  = document.createElement("div");
  $categories = $(categories);
  $categories.css("display", "inline-block").css("float", "right").addClass(options.categoriesClass);
  
  classifier = document.createElement("div");
  $classifier = $(classifier);
  $classifier.hide().addClass(options.classifierClass).css("position", "absolute");
  if (options.classifierWidth > 0) $classifier.css("width", options.classifierWidth);
  $classifier.append(groups).append(subgroups).append(categories);
  $("body").append(classifier);

	input.autocompleter = me;

	var timeout = null;
	var prev = "";
	var active = -1;
	var cache = {};
	var keyb = false;
	var hasFocus = false;
	var lastKeyPressCode = null;
	var type = 0;

	$input
	.keydown(function(e) {
		// track last key pressed
		lastKeyPressCode = e.keyCode;
		switch(e.keyCode) {
			case 38: // up
				e.preventDefault();
				moveSelect(-1);
				break;
			case 40: // down
				e.preventDefault();
				moveSelect(1);
				break;
      case 39: // right
        $("li",classifier).removeClass("ac_over")
        type = 0;
        break;  
      case 37: // left
        $("li",classifier).removeClass("ac_over")
        type = 0;
        break;
			case 9:  // tab
			case 13: // return
  			if (selectCurrent()){
  				$input.get(0).blur();
  			}
  			e.preventDefault();
				break;
			case 27: //esc
			  type = 0;
			  hideClassifierNow();
			  break;
			default:
				active = -1;
				if (timeout) clearTimeout(timeout);
				type = 0;
				timeout = setTimeout(function(){onChange();}, options.delay);
				break;
		}
	})
	.focus(function(){
		// track whether the field has focus, we shouldn't process any results if the field no longer has focus
		hasFocus = true;
	})
	.blur(function() {
		// track whether the field has focus
		hasFocus = false;
    // hideClassifier();
	});
	$classifier.mouseenter(function(){
	  hasFocus = true;
	}).mouseleave(function(){
	  hasFocus = false;
	  hideClassifier();
	});
  hideClassifierNow();
	function onChange() {
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		if( lastKeyPressCode == 46 || (lastKeyPressCode > 8 && lastKeyPressCode < 32) ) return $classifier.hide();
		var v = $input.val();
		if (v == prev) return;
		prev = v;
		if (v.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			requestClassifierData(v);
		} else {
			$input.removeClass(options.loadingClass);
			$classifier.hide();
		}
	};

 	function moveSelect(step) {
 	  var lis
    switch (type){
      case 0:
        lis = $("li", groups);
        break;
      case 1:
        lis = $("li", subgroups);
        break;
      case 2:
        lis = $("li", categories);
        break;
    };
		if (!lis) return;

		active += step;

		if (active < 0) {
			active = 0;
		} else if (active >= lis.size()) {
			active = lis.size() - 1;
		}
		lis.removeClass("ac_over");
		$(lis[active]).addClass("ac_over");
		if (lis[active]){
      lis[active].scrollIntoViewIfNeeded();
    }
		// Weird behaviour in IE
		// if (lis[active] && lis[active].scrollIntoView) {
		// 	lis[active].scrollIntoView(false);
		// }

	};

	function selectCurrent() {
	  
	  var li;
	  switch (type){
	    case 0:
	      li = $("li.ac_over", groups)[0];
	      if (li){
	        type++;
	        $(li).removeClass("ac_over").addClass(options.liSelected).addClass(options.loadingClass);
	        subgroups.innerHTML = "";
	        categories.innerHTML = "";
  	      requestClassifierData($(li).html());
	      }
	      return false;
	    case 1:
  	    li = $("li.ac_over", subgroups)[0];
  	    if (li){
  	      type++;
  	      $(li).removeClass("ac_over").addClass(options.liSelected).addClass(options.loadingClass);
  	      categories.innerHTML = "";
  	      requestClassifierData($(li).html());
  	    }
	      return false;
	    case 2:
  	    type = 0;
	      li = $("li.ac_over", categories)[0];
	      $(li).removeClass("ac_over");
        if (!li) {
    			var $li = $("li", categories);
    			if (options.selectOnly) {
    				if ($li.length == 1) li = $li[0];
    			} else if (options.selectFirst) {
    				li = $li[0];
    			}
    		}
    		if (li) {
    			selectItem(li);
    			return true;
    		} else {
    			return false;
    		}
	  }
	};
	
	function selectCurrentMouse() {
	  var li;
	  if (li = $("li.ac_over", groups)[0] ){
	    type = 1;
	    $(li).removeClass("ac_over").addClass(options.liSelected).addClass(options.loadingClass);
	    subgroups.innerHTML = "";
      categories.innerHTML = "";
	    requestClassifierData($(li).html());
	  }else if (li = $("li.ac_over", subgroups)[0]) {
	    type = 2;
	    $(li).removeClass("ac_over").addClass(options.liSelected).addClass(options.loadingClass);
      categories.innerHTML = "";
	    requestClassifierData($(li).html());
	  }else{
	    type = 0;
      li = $("li.ac_over", categories)[0];
      $(li).removeClass("ac_over");
      if (!li) {
  			var $li = $("li", categories);
  			if (options.selectOnly) {
  				if ($li.length == 1) li = $li[0];
  			} else if (options.selectFirst) {
  				li = $li[0];
  			}
  		}
  		if (li) {
  			selectItem(li);
  			return true;
  		} else {
  			return false;
  		}
	  }
	};

	function selectItem(li) {
		var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
		hasFocus = false;
		input.lastSelected = v;
		prev = v;
		$groups.html("");
		$subgroups.html("");
		$categories.html("");
		$input.val(v);
		hideClassifierNow();
	};

	// selects a portion of the input string
	function createSelection(start, end){
		// get a reference to the input element
		var field = $input.get(0);
		if( field.createTextRange ){
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if( field.setSelectionRange ){
			field.setSelectionRange(start, end);
		} else {
			if( field.selectionStart ){
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	};

	// fills in the input box w/the first match (assumed to be the best match)
	function autoFill(sValue){
		// if the last user key pressed was backspace, don't autofill
		if( lastKeyPressCode != 8 ){
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(prev.length));
			// select the portion of the value not typed by the user (so the next character will erase)
			createSelection(prev.length, sValue.length);
		}
	};

	function showClassifier() {
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(input);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (options.width > 0) ? options.width : $input.width() * 3;
		// reposition
		$classifier.css({
			width: parseInt(iWidth) + "px",
			top: (pos.y + input.offsetHeight) + "px",
			left: pos.x + "px"
		}).show();
	};
	
	function hideClassifier() {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(hideClassifierNow, 500);
	};
	
	function hideClassifierNow() {
	  if (!hasFocus){
	    if (timeout) clearTimeout(timeout);
  		$input.removeClass(options.loadingClass);
  		if ($classifier.is(":visible")) {
  			$classifier.hide();
  		}
	  }
	};
	
	function parseData(data) {
		if (!data) return null;
		var parsed = [];
		var rows = data.split(options.lineSeparator);
		for (var i=0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(options.cellSeparator);
			}
		}
		return parsed;
	};

	function dataToDom(data) {
		var ul = document.createElement("ul");
		var num = data.length;
		// limited results to a max number
		if( (options.maxItemsToShow > 0) && (options.maxItemsToShow < num) ) num = options.maxItemsToShow;

		for (var i=0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			var li = document.createElement("li");
			li.innerHTML = row;
			var extra = null;
			ul.appendChild(li);
			$(li)
			.hover(function() { 
				  $("li", ul).removeClass("ac_over"); 
				  $(this).addClass("ac_over");
  				active = $("li", ul).indexOf($(this).get(0));   
			  },
				function() { 
				  $(this).removeClass("ac_over"); 
				}
			)
			.click(function(e) { 
			  $input.focus();
			  e.preventDefault(); 
			  selectCurrentMouse();
			  
        // e.stopPropagation();
			  
			});
		}
		return ul;
	};
	
	function selectCategories(){
	  
	};
	
	function selectSubgroups(){
	  
	};
	
	function receiveClassifierData(q, data) {
	  $input.removeClass(options.loadingClass)
		if (data) {
		  //if( !hasClassifierFocus || data.length == 0 ) return hideClassifierNow();
		  switch (type){
		    case 0:
		      $groups.html(dataToDom(data[0]));
		      $subgroups.html(dataToDom(data[1]));
		      $categories.html(dataToDom(data[2]));
		      break;
		    case 1:
		      $subgroups.html(dataToDom(data[0]));
		      $categories.html(dataToDom(data[1]));
		      $('li', groups).removeClass(options.loadingClass);
		      //selectSubgroups(); 
		      break;
		    case 2:
		      $categories.html(dataToDom(data[0]));
		      $('li', subgroups).removeClass(options.loadingClass);
		      //selectCategories();
		      break;
		  }
        // if ($.browser.msie) {
        //  // we put a styled iframe behind the calendar so HTML SELECT elements don't show through
        //  $groups.append(document.createElement('iframe'));
        // }
  		showClassifier();			
		}
	};
  
	
	function requestClassifierData(q) {
	// type: on change input -- 0; select groups -- 1; select sub -- 2;
  	q = q.toLowerCase();
  	var data = null;
	  if( (typeof options.url == "string") && (options.url.length > 0) ){
    	$.get(makeClassifierUrl(q), function(data) {
    	  data = parseData(data);
    		receiveClassifierData(q, data);
    	});
    } 
	};

  function makeClassifierUrl(q) {
    var url = options.url + "?classifier=" + encodeURI(q) + "&type=" + type;		
		return url;
	};

	function matchSubset(s, sub) {
		if (!options.matchCase) s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};

	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	}
	function find(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	}
}

jQuery.fn.classifier = function(url, options, data) {
	// Make sure options exists
	options = options || {};
	// Set url as option
	options.url = url;
	// set some bulk local data
	options.data = ((typeof data == "object") && (data.constructor == Array)) ? data : null;
	// Set default values for required options
	options.inputClass = options.inputClass || "ac_input";
	options.lineSeparator = options.lineSeparator || "\n";
	options.cellSeparator = options.cellSeparator || "|";
	options.minChars = options.minChars || 1;
	options.delay = options.delay || 400;
	options.matchCase = options.matchCase || 0;
	options.matchSubset = options.matchSubset || 1;
	options.matchContains = options.matchContains || 0;
	options.mustMatch = options.mustMatch || 0;
	options.extraParams = options.extraParams || {};
	options.loadingClass = options.loadingClass || "ac_loading";
	options.selectFirst = options.selectFirst || false;
	options.selectOnly = options.selectOnly || false;
	options.maxItemsToShow = options.maxItemsToShow || -1;
	options.autoFill = options.autoFill || false;
	options.width = parseInt(options.width, 10) || 0;
  options.classifierClass = options.classifierClass || "ac_classifier";
  options.liSelected = options.liSelected || "ac_liselected";
  options.classifierWidth = options.classifierWidth || 0;
  options.groupsClass = options.groupsClass || "ac_groups";
  options.subgroupsClass = options.subgroupsClass || "ac_subgroups"
  options.categoriesClass = options.categoriesClass || "ac_categories"
	this.each(function() {
		var input = this;
		new jQuery.classifier(input, options);
	});

	// Don't break the chain
	return this;
}
