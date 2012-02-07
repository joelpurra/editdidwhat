/*!
* @license EditDidWhat
* Copyright (c) 2011, 2012 The Swedish Post and Telecom Authority (PTS)
* Developed for PTS by Joel Purra <http://joelpurra.se/>
* Released under the BSD license.
*
* Compare two strings to see what has changed, and perform some string manipulation.
*/

/*jslint white: true, maxlen: 120*/

// All functions are static; var line = EditDidWhat.getLine(str, lineNumber);
// TODO: look for a more complete string manipulation library
// TODO: convert some functions to extend String or jQuery.fn
(function (namespace)
{
	var edw = namespace.EditDidWhat = {};

	// TODO: expand with edw.Insert
	edw.StatusUnknown = "EditDidWhat.StatusUnknown";
	edw.StatusAdd = "EditDidWhat.StatusAdd";
	edw.StatusRemove = "EditDidWhat.StatusRemove";
	edw.StatusReplace = "EditDidWhat.StatusReplace";
	edw.StatusNoChange = "EditDidWhat.StatusNoChange";
	edw.StatusAppended = "EditDidWhat.StatusAppended";

	edw.detectChange = function (previous, current)
	{
		var diffIndex = edw.findDifferenceIndex(previous, current);

		if (previous.length < current.length)
		{
			if (diffIndex === previous.length)
			{
				return edw.StatusAppended;
			}

			return edw.StatusAdd;
		}

		if (previous.length > current.length)
		{
			return edw.StatusRemove;
		}

		if (previous.length === current.length)
		{
			if (diffIndex === -1)
			{
				return edw.StatusNoChange;
			}

			return edw.StatusReplace;
		}

		return edw.StatusUnknown;
	};

	edw.findDifferenceIndex = function (previous, current, start)
	{
		if (previous === current)
		{
			// No difference
			return -1;
		}

		if (start === undefined)
		{
			start = 0;
		}

		var 
			i = start,
			shortestLength = edw.getShortestLength(previous, current);

		for (void (0); i < shortestLength; i += 1)
		{
			if (previous.charAt(i) !== current.charAt(i))
			{
				return i;
			}
		}

		return i;
	};

	edw.findLastDifferenceIndex = function (previous, current, start)
	{
		if (previous === current)
		{
			// No difference
			return -1;
		}

		if (previous.length !== current.length)
		{
			return edw.getLongestLength(previous, current) - 1;
		}

		if (start === undefined)
		{
			start = previous.length - 1;
		}

		var i = start;

		for (void (0); i >= 0; i -= 1)
		{
			if (previous.charAt(i) !== current.charAt(i))
			{
				return i;
			}
		}

		return i;
	};

	edw.getShortestLength = function (a, b)
	{
		if (a === undefined
            || b === undefined
            || a === null
            || b === null
            || typeof (a) !== "string"
            || typeof (b) !== "string")
		{
			throw new Error("Invalid arguments: \"" + a + "\", \"" + b + "\".");
		}

		return (a.length < b.length) ? a.length : b.length;
	};

	edw.getLongestLength = function (a, b)
	{
		if (a === undefined
            || b === undefined
            || a === null
            || b === null
            || typeof (a) !== "string"
            || typeof (b) !== "string")
		{
			throw new Error("Invalid arguments: \"" + a + "\", \"" + b + "\".");
		}

		return (a.length > b.length) ? a.length : b.length;
	};

	edw.getCount = function (str, subpattern)
	{
		if (str === undefined
            || subpattern === undefined
            || str === null
            || subpattern === null
            || typeof (str) !== "string"
			|| (typeof (subpattern) !== "string"
				&& !(subpattern instanceof RegExp))
			|| (typeof (subpattern) === "string"
				&& subpattern.length < 1))
		{
			throw new Error("Invalid arguments: \"" + str + "\", \"" + subpattern + "\".");
		}

		return str.split(subpattern).length - 1;
	};

	edw.getLineCount = function (str)
	{
		return edw.getCount(str, '\n') + 1;
	};

	edw.getLineStartAt = function (str, index)
	{
		if (index < 0
			|| index > str.length
			|| (index === str.length
				&& str.length > 0
				&& str.charAt(str.length - 1) !== '\n'))
		{
			throw new Error("index " + index + " out of bounds in str \"" + str + "\"");
		}

		if (index === 0)
		{
			return 0;
		}

		if (index === str.length)
		{
			return str.length;
		}

		var 
			i,
			start = 0,
			previousChar = '';

		for (i = 0; i <= index; i += 1)
		{
			if (previousChar === '\n')
			{
				start = i;
			}

			previousChar = str.charAt(i);
		}

		return start;
	};

	edw.getLineEndAt = function (str, index)
	{
		if (index < 0
			|| index > str.length
			|| (index === str.length
				&& str.length > 0
				&& str.charAt(str.length - 1) !== '\n'))
		{
			throw new Error("index " + index + " out of bounds in str \"" + str + "\"");
		}

		if (index === 0
			&& str.length === 0)
		{
			return 0;
		}

		if (index === str.length)
		{
			return str.length;
		}

		var 
			i,
			currentChar,
			previousChar = '',
			end;

		for (i = 0; i < str.length; i += 1)
		{
			currentChar = str.charAt(i);

			if (currentChar === '\n')
			{
				if (i === 0
                    || previousChar === '\n')
				{
					end = i;
				}
				else
				{
					end = i - 1;
				}

				if (i >= index)
				{
					return end;
				}
			}

			previousChar = currentChar;
		}

		return str.length - 1;
	};

	edw.getLineNumberAt = function (str, index)
	{
		if (index < 0
			|| index > str.length
			|| (index === str.length
				&& str.length > 0
				&& str.charAt(str.length - 1) !== '\n'))
		{
			throw new Error("index " + index + " out of bounds in str \"" + str + "\"");
		}

		if (index === 0)
		{
			return 0;
		}

		if (index === str.length)
		{
			return edw.getLineCount(str) - 1;
		}

		var 
			i,
			lineNumber = 0,
			previousChar = '';

		for (i = 0; i <= index; i += 1)
		{
			if (previousChar === '\n')
			{
				lineNumber += 1;
			}

			previousChar = str.charAt(i);
		}

		return lineNumber;
	};

	edw.getLineStart = function (str, lineNumber)
	{
		if (lineNumber < 0
			|| lineNumber >= edw.getLineCount(str))
		{
			throw new Error("Line number " + lineNumber + " out of bounds in str \"" + str + "\"");
		}

		if (lineNumber === 0)
		{
			return 0;
		}

		var 
			i,
			lineNumberCount = 0,
			previousChar = '';

		for (i = 0; i < str.length; i += 1)
		{
			if (previousChar === '\n')
			{
				lineNumberCount += 1;

				if (lineNumberCount === lineNumber)
				{
					break;
				}
			}

			previousChar = str.charAt(i);
		}

		return i;
	};

	edw.getLineEnd = function (str, lineNumber)
	{
		if (lineNumber < 0
			|| lineNumber >= edw.getLineCount(str))
		{
			throw new Error("Line number " + lineNumber + " out of bounds in str \"" + str + "\"");
		}

		if (lineNumber === 0
			&& str.length === 0)
		{
			return 0;
		}

		if (lineNumber === edw.getLineCount(str) - 1)
		{
			return str.length;
		}

		var 
			i,
			lineNumberCount = 0;

		for (i = 0; i < str.length; i += 1)
		{
			if (str.charAt(i) === '\n')
			{
				if (lineNumberCount === lineNumber)
				{
					break;
				}

				lineNumberCount += 1;
			}
		}

		return i;
	};

	edw.getLineAt = function (str, index)
	{
		if (index < 0
			|| index > str.length)
		{
			throw new Error("index " + index + " out of bounds in str \"" + str + "\"");
		}

		var lineNumber = edw.getLineNumberAt(str, index);

		return edw.getLine(str, lineNumber);
	};

	edw.getLine = function (str, lineNumber)
	{
		if (lineNumber < 0
			|| lineNumber >= edw.getLineCount(str))
		{
			throw new Error("Line number " + lineNumber + " out of bounds in str \"" + str + "\"");
		}

		return str.split('\n')[lineNumber];
	};

	edw.replaceLineAt = function (str, index, replaceWith)
	{
		if (index < 0
			|| index > str.length)
		{
			throw new Error("index " + index + " out of bounds in str \"" + str + "\"");
		}

		var lineNumber = edw.getLineNumberAt(str, index);

		return edw.replaceLine(str, lineNumber, replaceWith);
	};

	edw.replaceLine = function (str, lineNumber, replaceWith)
	{
		if (lineNumber < 0
			|| lineNumber >= edw.getLineCount(str))
		{
			throw new Error("Line number " + lineNumber + " out of bounds in str \"" + str + "\"");
		}

		var lines = str.split('\n');

		lines[lineNumber] = replaceWith;

		return lines.join('\n');
	};

} (this));