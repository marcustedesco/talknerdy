

function ControlStructureStack() {

    this.indexOfTop = -1;
    this.listOfControlStructures = new Array();
}


ControlStructureStack.prototype.pushCS = function(typeIntegerRepresentationToPush) {
	this.listOfControlStructures[this.indexOfTop + 1] = typeIntegerRepresentationToPush;
	this.indexOfTop++;
};

/* Pop the most-recent Control Structure */
ControlStructureStack.prototype.popCS = function() {
	if(this.indexOfTop >= 0)
	{
    	var topPopedOff = this.listOfControlStructures[this.indexOfTop];
    	this.listOfControlStructures.splice(this.indexOfTop, 1);
    	this.indexOfTop--;
    	return topPopedOff;
    }

    else
    {
    	return 0; //If 0 returned means that stack is empty (no control structures to close)
    }
};