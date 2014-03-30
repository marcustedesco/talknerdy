/**
 * File for the editor data object,
 * which contains all methods for manipulating the editor's internal state
 */

function EditorData() {
	
	/**
	 * Array of indices into structures' children.
	 */
	var cursor = [];
	var data = new Program();
	
	var getCursorParent = function() {
		var parent = data;
		for(var i = 0; i < cursor.length - 1; i++) {
			parent = parent.children[cursor[i]];
		}
		return parent;
	};
	
	this.inwards = function() {
		cursor.push(0);
	};
	
	this.outwards = function() {
		cursor.pop();
	};
	
	this.forwards = function() {
		cursor[cursor.length-1]++;
	};
	
	this.backwards = function() {
		cursor[cursor.length-1]--;
	};
	
	this.getAtCursor = function() {
		return getCursorParent().children[last(cursor)];
	};
	
	this.setAtCursor = function(datum) {
		getCursorParent().children[last(cursor)] = datum;
	};
	
	this.insertAtCursor = function(datum) {
		getCursorParent().children.splice(last(cursor), 0, datum);
	};
	
	this.deleteAtCursor = function() {
		getCursorParent().children.splice(last(cursor), 1);
	};
	
	this.toHtml = function() {
		return data.toHtml();
	};
}

function Program() {
	this.children = [];
	this.toHtml = function() {
		return map(toHtml, this.children).join('');
	};
}

function ForLoop() {
	
	this.children = emptyStringArray(4);
	
	this.toHtml = function() {
		return "<p>for( "+toHtml(this.children[0])+"; "+toHtml(this.children[1])+"; "+toHtml(this.children[2])+")</p>"
		+"<ul style=\"list-style-type: none\"><li>"+toHtml(this.children[3])+"</li></ul>";
	};
}

function Statement() {
	this.children = emptyStringArray(1);
	
	this.toHtml = function() {
		return "<p>"+toHtml(this.children[0])+"</p>";
	};
}

/**
 * Like data.toHtml, but handles just strings as well
 * @param data data holder or string
 * @returns HTML representation
 */
function toHtml(data) {
	return isString(data) ? htmlEscape(data) : data.toHtml();
}

/**
 * Creates an array of empty strings of length n
 * @param n length of array
 * @returns The array
 */
function emptyStringArray(n) {
	var toReturn = [];
	for(; n > 0 ; n--) {
		toReturn.push("");
	}
	return toReturn;
}

function isString(dataOrString) {
	return typeof dataOrString == 'string' || dataOrString instanceof String; 
}

function map(f, list) {
	var toReturn = [];
	for(var i = 0; i < list.length; i++) {
		toReturn.push(f(list[i]));
	}
	return toReturn;
}

function last(list) {
	return list[list.length-1];
}

function htmlEscape(string) {
	return string.replace(/[\u00A0-\u2666]/g, function(c) {
		return '&#'+c.charCodeAt(0)+';';
	});
}