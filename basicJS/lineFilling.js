/**
  * Contains the Classes for each of the line types (for, while, if, else if, else, variable declaration, variable value setting)
  **/

 function ForLoopLine() {

    this.declarationFilledOut = false;
    this.conditionFilledOut = false;
    this.endOperationFilledOut = false;

    this.variableDeclaration = '';
    this.variableCondition = '';
    this.variableEndOperation = '';


}

/* Determine if declaration commands somewhere in wlToCheck */
ForLoopLine.prototype.isDeclarationFilledOut = function(wlToCheck) {


	var common_Int_Parses = new Array("integer", "in");
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
									if(wlToCheck[i+1].localeCompare("equals") == 0)
									{
										this.variableDeclaration = "int i" + " = " + wlToCheck[i + k + 1];
									}

									else
									{
										this.variableDeclaration = "int " + wlToCheck[i+1].toLowerCase() + " = " + wlToCheck[i + k + 1];
									}
									
									this.declarationFilledOut = true;
									alert(this.variableDeclaration);
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
	return false;
};

/* Determine if endChange commands somewhere in wlToCheck */
ForLoopLine.prototype.isEndOperationFilledOut = function(wlToCheck) {
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