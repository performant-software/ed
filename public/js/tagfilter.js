///////////////////////////////////////
// tagfilter.js
// Applies filters to the page
///////////////////////////////////////

// Setup

// Grab a reference to the all the annotations
var annotations = $(".annotator-hl");

// Keep a copy of the background colors at load
var annotationColors=[];
annotations.each(function( index ) {
	//$(this).attr("style", "background-color:")
	annotationColors.push($(this).css('background-color'));
});


//Select2 boxes
var tf = $('#tag-filter').select2({
	data: filterLists['tags'],
	placeholder: "Select one or more tags",
	theme: "classic",
	width: "300px",
});

var cf = $('#cat-filter').select2({
	data: filterLists['annotation_categories'],
	placeholder: "Select one or more categories",
	theme: "classic",
	width: "300px",
});

var uf = $('#user-filter').select2({
	data: filterLists['user'],
	placeholder: "Select one or more annotators",
	theme: "classic",
	width: "300px",
});

// Arrays of filters
var tagFilters = [];
var categoryFilters = [] ;
var annotatorFilters = [];

// Do this on load (not so useful right now, but in future could keep settings in localstore)
applyFiltersToPage();


// Actually apply the filters to the page
function applyFiltersToPage(){

	// If we have at least one filter enabled, then we will be manually re-coloring
	if(tagFilters.length > 0 || categoryFilters.length > 0 || annotatorFilters.length >0 ){
		// blank them out first
		annotations.attr("style", "background-color:rgba(1,1,1,0.1);border:0");
	// Otherwise just reset to original and GTFO
	}else{
		annotations.attr("style", "background-color:rgba(0,0,0,0.0);border:0");
		resetAnnotationsToOriginal();
		return;
	}

	//Tags
	console.log("%c TAGS: %c" + tagFilters,'background: #bbbbbb; color: #0000FF','background: #FFFFFF; color: #000000');
	for (var i = 0; i < tagFilters.length; i++) {
		var thisTag=tagFilters[i];
		$("span[data-tags~='" + thisTag + "']").attr("style", "border:1px solid red");
	}

	//Categories
	console.log("%c CATEGORIES: %c" + categoryFilters,'background: #bbbbbb; color: #EEFF00','background: #FFFFFF; color: #000000');
	for (var i = 0; i < categoryFilters.length; i++) {
		var thisCategory=categoryFilters[i];
		$("span[data-annotation_categories~='" + thisCategory + "']").attr("style", "border:1px solid green");
	}

	//Annotators
	console.log("%c ANNOTATORS: %c" + annotatorFilters,'background: #bbbbbb; color: #FF00FF','background: #FFFFFF; color: #000000');
	for (var i = 0; i < annotatorFilters.length; i++) {
		var thisUser=annotatorFilters[i];
		$("span[data-user~='" + thisUser + "']").attr("style", "border:1px solid blue");
	}
}


// Filter add/remove handlers

// Tag Add
tf.on("select2:select", function(e) {
	tagFilters.push(e.params.data.id);
	applyFiltersToPage();
});

// Tag Remove
tf.on('select2:unselect', function(e) {
	removeObjectFromArray(e.params.data.id,tagFilters);
	applyFiltersToPage();
});


// Category Add
cf.on("select2:select", function(e) {
	console.log("Adding:" + e.params.data.id);
	categoryFilters.push(e.params.data.id);
	applyFiltersToPage();
});
// Category Remove
cf.on('select2:unselect', function(e) {
	removeObjectFromArray(e.params.data.id,categoryFilters);
	applyFiltersToPage();
});


// Annotator Add
uf.on("select2:select", function(e) {
	annotatorFilters.push(e.params.data.id);
	applyFiltersToPage();
});
// Annotator Remove
uf.on('select2:unselect', function(e) {
	removeObjectFromArray(e.params.data.id,annotatorFilters);
	applyFiltersToPage();
});


// Resets the annotations to their original colors
function resetAnnotationsToOriginal(){
	idx=0;
	annotations.each(function( index ) {
		//$(this).css('background-color','yellow');
		//annotationColors.push($(this).css('background-color'));
		$(this).css("background-color", annotationColors[idx]);
		idx++;
	});
}


// Any annotation gets clicked
annotations.click(function(a) {
	var idtarget = a.target;

	$(".glyphicon-comment").remove();
	$(idtarget).prepend('<i class="glyphicon glyphicon-comment"></i>');

	var customTags = ['[%', '%]'];
	var anno = Object.assign({}, idtarget.dataset)

	anno.quote = $(idtarget).text()
	var template = $('#annotation-template').html();
	Mustache.parse(template, customTags);
	var rendered = Mustache.render(template, anno);
	$("#annotation-viewer").html(rendered);

});


// Helper: Remove objects from array
function removeObjectFromArray(obj,array){
	var idx = array.indexOf(obj);
	if (idx > -1) {
		array.splice(idx, 1);
	}
}

// Helper: Array Support for old IE (via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill)
Array.prototype.indexOf || (Array.prototype.indexOf = function(d, e) {
    var a;
    if (null == this) throw new TypeError('"this" is null or not defined');
    var c = Object(this),
        b = c.length >>> 0;
    if (0 === b) return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b) return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d) return a;
        a++
    }
    return -1
});


// TODO: Implement Next/Previous Annotation Buttons.
// TODO: Implement Next/Previous Viewport's-worth Buttons. (page breaks?)
