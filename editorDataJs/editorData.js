/**
 * File for the editor data object,
 * which contains all methods for manipulating the editor's internal state
 */

function EditorData() {
	
	/**
	 * Array of indices into structures' children.
	 */
	var cursor = [0];
	var data = new Program();
	
	var getCursorParentChildren = function() {
		var parent = data;
		for(var i = 0; i < cursor.length - 1; i++) {
			parent = parent.children[cursor[i]];
		}
		return parent.children;
	};
	
	this.inwards = function() {
		if(isString(this.getAtCursor())) {
			return false;
		} else {
			cursor.push(0);
			return true;
		}
	};
	
	this.outwards = function() {
		if(cursor.length === 1) {
			return false;
		} else {
			cursor.pop();
			return true;
		}
	};
	
	this.forwards = function() {
		if(last(cursor) === getCursorParentChildren().length) {
			return false;
		} else {
			cursor[cursor.length-1]++;
			return true;
		}
	};
	
	this.backwards = function() {
		if(last(cursor) === 0) {
			return false;
		} else {
			cursor[cursor.length-1]--;
			return true;
		}
	};
	
	this.getAtCursor = function() {
		return getCursorParentChildren()[last(cursor)];
	};
	
	this.setAtCursor = function(datum) {
		if(this.isSomethingAtCursor()) {
			getCursorParentChildren()[last(cursor)] = datum;
			return true;
		} else {
			return false;
		}
	};
	
	this.insertAtCursor = function(datum) {
		getCursorParentChildren().splice(last(cursor), 0, datum);
	};
	
	this.deleteAtCursor = function() {
		if(this.isSomethingAtCursor()) {
			getCursorParentChildren().splice(last(cursor), 1);
			return true;
		} else {
			return false;
		}
	};
	
	this.toHtml = function() {
		return data.toHtml();
	};
	
	this.isSomethingAtCursor = function() {
		return last(cursor) !== getCursorParentChildren().length;
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