/**
  * Contains the Classes for each of the line types (for, while, if, else if, else, variable declaration, variable value setting)
  **/

										/* FOR LOOPS */
 function ForLoopLine() {

    this.declarationFilledOut = false;
    this.conditionFilledOut = false;
    this.endOperationFilledOut = false;

    this.variableDeclaration = '';
    this.variableUsedForComparison = '';

    this.variableCondition = '';

    this.variableEndOperation = '';

    this.printedDeclaration = false;
    this.printedCondition = false;
}

/* Determine if declaration commands somewhere in wlToCheck */
ForLoopLine.prototype.isDeclarationFilledOut = function(wlToCheck) {


	var common_Int_Parses = new Array("integer", "in", "int");
	var common_Equals_Parses = new Array("equals", "equal");


    for(var i = 0; i < wlToCheck.length; ++i)
    {
		for(var j = 0; j < common_Int_Parses.length; ++j)
		{
			if(wlToCheck[i].localeCompare(common_Int_Parses[j]) == 0)
			{
				//Make sure within 2 of end of word list (because need 'equals' and value after this, at least)
				if(i + 2 < wlToCheck.length)
				{
					for(var k = 1; i + k < wlToCheck.length && k < 4; ++k)
					{
						for(var l = 0; l < common_Equals_Parses.length; ++l)
						{
							if(common_Equals_Parses[l].localeCompare(wlToCheck[i + k]) == 0)
							{
								if(i + k + 1 < wlToCheck.length)
								{
									//If parse text directly after 'integer' is equals, then assume variable name is i
									if(wlToCheck[i+1].localeCompare("equals") == 0 || wlToCheck[i+1].localeCompare("equal") == 0)
									{
										this.variableUsedForComparison = 'i';
										this.variableDeclaration = "int i" + " = " + wlToCheck[i + k + 1];
									}

									else
									{
										this.variableUsedForComparison = wlToCheck[i+1].toLowerCase();
										this.variableDeclaration = "int " + wlToCheck[i+1].toLowerCase() + " = " + wlToCheck[i + k + 1];
									}
									
									this.declarationFilledOut = true;
									//alert(this.variableDeclaration);
									return true;
								}
							}
						}
	    			}
    			}
			}
		}
    }

    return false;
};

/* Determine if condition commands somewhere in wlToCheck */
ForLoopLine.prototype.isConditionFilledOut = function(wlToCheck) {

	//if declaration part already filled out and obviously if declaration's last index is less than the size of the word list (because will be going past that point)
	if(this.declarationFilledOut)
	{
		var common_Less_Than_Parses = new Array("less", "lesson", "lesson");
		var common_Greater_Than_Parses = new Array("greater");

	
		for(var i = 0; i < wlToCheck.length; ++i)
		{
			var isLessThanComparison = false;
			var isGreaterThanComparison = false;

			for(var jl = 0; jl < common_Less_Than_Parses.length; ++jl)
			{
				if(wlToCheck[i].localeCompare(common_Less_Than_Parses[jl]) == 0)
				{
					isLessThanComparison = true;
				}
			}

			if(!isLessThanComparison) //If isn't a less than condition... then check if it's greater than condition
			{
				for(var gl = 0; gl < common_Greater_Than_Parses.length; ++gl)
				{
					if(wlToCheck[i].localeCompare(common_Greater_Than_Parses[gl]) == 0)
					{
						isGreaterThanComparison = true;
					}
				}
			}

			if(isLessThanComparison || isGreaterThanComparison)
			{
				//assume saying 'less than 4' (so would go +2 from i (which is position of 'less'))
				if(i + 2 < wlToCheck.length)
				{
					if(isLessThanComparison)
					{
						this.variableCondition = this.variableUsedForComparison + ' < ' + String(wlToCheck[i+2]);
					}

					else 
					{
						this.variableCondition = this.variableUsedForComparison + ' > ' + String(wlToCheck[i+2]);
					}

					//alert(this.variableCondition);

					this.conditionFilledOut = true;

					return true;
				}
			}
		}
	}

	return false;
};

/* Determine if endChange commands somewhere in wlToCheck */
ForLoopLine.prototype.isEndOperationFilledOut = function(wlToCheck) {

	var common_Decrement_Parses = new Array("decrement", "decremental");
	var common_Increment_Parses = new Array("increment", "increments", "anchorman", "incremental");


	for(var i = 0; i < wlToCheck.length; ++i)
	{
		for(var j = 0; j < common_Decrement_Parses.length; ++j)
		{
			if(wlToCheck[i].localeCompare(common_Decrement_Parses[j]) == 0)
			{
				if(i+1 < wlToCheck[wlToCheck.length-1]) //As long as there is a value after..
				{
					var decrementEndValue = wlToCheck[wlToCheck.length - 1]; //Value will be last in word list
					this.variableEndOperation = this.variableUsedForComparison + " = " + this.variableUsedForComparison + " - " + decrementEndValue;
					this.endOperationFilledOut = true;
					return true;
				}
			}
		}

		for(var k = 0; k < common_Increment_Parses.length; ++k)
		{
			if(wlToCheck[i].localeCompare(common_Increment_Parses[k]) == 0)
			{
				var incrementEndValue = wlToCheck[wlToCheck.length - 1]; //Value will be last in word list
				this.variableEndOperation = this.variableUsedForComparison + " = " + this.variableUsedForComparison + " + " + incrementEndValue;
				this.endOperationFilledOut = true;
				return true;
			}
		}
	}

	return false;
};

ForLoopLine.prototype.isAllFilledOut = function(wordListToCheck) {

	if(!this.declarationFilledOut && !this.isDeclarationFilledOut(wordListToCheck))
	{
		return false;
	}

	if(!this.conditionFilledOut && !this.isConditionFilledOut(wordListToCheck))
	{
		return false;
	}


	if(!this.endOperationFilledOut && !this.isEndOperationFilledOut(wordListToCheck))
	{
		return false;
	}

	return true;
};


					/*Declaring variable*/
 function VariableChangeLine() {
 	this.resultToPrint = "";
 }

VariableChangeLine.prototype.create = function(wlToCheck) {
	var common_Int_Parses = new Array("integer", "in", "int");
	var common_String_Parses = new Array("String", "string");
	var common_Equals_Parses = new Array("equals", "equal");

	var isInteger = false;
	var isString = false;
	var typeIndex = 0;

	for(var i = 0; i < wlToCheck.length; ++i)
	{
		for(var j = 0; j < common_Int_Parses.length; ++j)
		{
			if(wlToCheck[i].localeCompare(common_Int_Parses[j]) == 0)
			{
				isInteger = true;
				typeIndex = i;
			}
		}

		for(var j = 0; j < common_String_Parses.length; ++j)
		{
			if(wlToCheck[i].localeCompare(common_String_Parses[j]) == 0)
			{
				isInteger = true;
				typeIndex = i;
			}
		}

		if(isInteger || isString)
		{
			//Start @ i+2 because i+1 is the name of the variable
			for(var k = i + 2; k < wlToCheck.length; ++k)
			{
				for(var l = 0; l < common_Equals_Parses.length; ++l)
				{
					if(wlToCheck[k].localeCompare(common_Equals_Parses[l]) == 0)
					{
						//Make sure won't go out of bounds when getting value
						if(k+1 < wlToCheck.length)
						{
							//integer
							if(isInteger)
							{
								this.resultToPrint = "int " + wlToCheck[i+1] + " = " + wlToCheck[k+1] + ";";
							}

							//String
							else
							{
								this.resultToPrint = "String " + wlToCheck[i+1] + " = \"" + wlToCheck[k+1] + "\";";
							}

							return true;
						}
					}
				}
			}
		}
	}

	return false;
}


/* While Loop */

/*function WhileLoopLine() {
	this.resultToPrint = "";
}

WhileLoopLine.prototype.create = function(wlToCheck) {
	var 



}*/


