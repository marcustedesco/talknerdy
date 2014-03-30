
function ControlStructureStack() {}

        ControlStructureStack.prototype.indexOfTop = 0;
        ControlStructureStack.prototype.listOfControlStructures = new Array();


        ControlStructureStack.prototype.pushCS = function(){
          alert('I am walking!');
        };

        /* Pop the most-recent Control Structure */
        ControlStructureStack.prototype.popCS = function(){
          alert('hello');
        };