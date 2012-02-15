# EditDidWhat javascript library
Compare two strings to see what has changed, and perform some string manipulation. Used to see what the user changed in a text input field (single- or multiline), and then act accordingly.

## Original purpose
Developed to provide several different autocomplete features in a multiline free-text address input fields.

* Changes on the first line would autocomplete the full address from users' most used addresses.
* Changes on the lines after the first line matching
 * the start of a street name would autocomplete the street name.
 * a complete street name would autocomplete/suggest valid street numbers.
 * zip codes would autocomplete the city name.

## Demos
* [`example/autocomplete-lines-starting-with-digits.html`](http://joelpurra.github.com/editdidwhat/example/autocomplete-lines-starting-with-digits.html): Even lines that start with digits are autocompleted with names matching these digits.

## Usage
EditDidWhat works best with smaller changes, such as single key strokes.

```javascript
var previous =	"The first line.\nThe text is miispleed.\nWonder what has changed?"
var current =	"The first line.\nThe text is corrected.\nWonder what has changed?"
var replaceWith = "But now it has been replaced."

var change = EditDidWhat.detectChange(previous, current);
var diffIndex = EditDidWhat.findDifferenceIndex(previous, current);
var diffLastIndex = EditDidWhat.findLastDifferenceIndex(previous, current);
var diffLineNumber = EditDidWhat.getLineNumberAt(current, diffIndex);
var diffLinePrevious = EditDidWhat.getLine(previous, diffLineNumber);
var diffLineCurrent = EditDidWhat.getLine(current, diffLineNumber);
var diffLineReplaced = EditDidWhat.replaceLine(current, diffLineNumber, replaceWith);

console.log("previous", previous);
console.log("current", current);
console.log("change", change); // EditDidWhat.StatusReplace
console.log("diffIndex", diffIndex); // 28
console.log("diffLineNumber", diffLineNumber); // 1
console.log("diffLinePrevious", diffLinePrevious); // The text is miispleed.
console.log("diffLineCurrent", diffLineCurrent); // The text is corrected.
console.log("diffLineReplaced", diffLineReplaced); // New string with the corrected line replaced.
```
## Dependencies
EditDidWhat does not have any runtime dependencies.

## Browser compatibility
Should be compatible with any javascript-enabled browser. You are encouraged to [run the EditDidWhat test suite](http://joelpurra.github.com/editdidwhat/test/) and then report any issues.

## License
Developed for PTS by Joel Purra <http://joelpurra.se/>

Copyright (c) 2011, 2012, The Swedish Post and Telecom Authority (PTS)
All rights reserved.

Released under the BSD license.
