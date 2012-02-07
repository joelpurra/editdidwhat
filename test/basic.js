/// <reference path="qunit/qunit/qunit.js" />
/// <reference path="../src/editdidwhat.joelpurra.js" />

/*jslint white: true, regexp: true, maxlen: 120*/
/*global EditDidWhat, module, test, ok, strictEqual, notStrictEqual*/

String.prototype.withReadableLinebreaks = function () {

    return this.replace(/\n/g, "\\n");
};


(function () {

    var errorRepresentationString = "Error";

    (function () {
        module("Library init");

        test("Object exists", 2, function () {
            notStrictEqual(typeof (EditDidWhat), "undefined", "EditDidWhat is undefined.");
            strictEqual(typeof (EditDidWhat), "object", "EditDidWhat is not an object.");
        });

        test("Statuses", 6, function () {
            strictEqual(typeof (EditDidWhat.StatusUnknown), "string", "EditDidWhat.StatusUnknown is not a string.");
            strictEqual(typeof (EditDidWhat.StatusAdd), "string", "EditDidWhat.StatusAdd is not a string.");
            strictEqual(typeof (EditDidWhat.StatusRemove), "string", "EditDidWhat.StatusRemove is not a string.");
            strictEqual(typeof (EditDidWhat.StatusReplace), "string", "EditDidWhat.StatusReplace is not a string.");
            strictEqual(typeof (EditDidWhat.StatusNoChange), "string", "EditDidWhat.StatusNoChange is not a string.");
            strictEqual(typeof (EditDidWhat.StatusAppended), "string", "EditDidWhat.StatusAppended is not a string.");
        });

    }());

    (function () {
        module("detectChange");

        test("StatusNoChange", 4, function () {

            var result;

            function bothNoChange(both) {

                result = EditDidWhat.detectChange(both, both);
                strictEqual(result, EditDidWhat.StatusNoChange, both + " strings returned " + result);
            }

            bothNoChange("");
            bothNoChange("A");
            bothNoChange("ABC");
            bothNoChange("AAAAAAAAAAAAAAAAA");
        });

        test("StatusAppended", 5, function () {

            var result;

            function appendSimple(before) {

                var after = before + "a";
                result = EditDidWhat.detectChange(before, after);
                strictEqual(result, EditDidWhat.StatusAppended, before + "/" + after + " strings returned " + result);
            }

            appendSimple("");
            appendSimple("A");
            appendSimple("0");
            appendSimple("AAAAAAAA");
            appendSimple("ABC");
        });

        test("StatusRemoved", 4, function () {

            var result;

            function removeSimple(before) {

                var after;

                if (before.length >= 1) {
                    after = before.substr(0, before.length - 1);
                } else {
                    after = "";
                }

                result = EditDidWhat.detectChange(before, after);
                strictEqual(result, EditDidWhat.StatusRemove, before + "/" + after + " strings returned " + result);
            }

            removeSimple("A");
            removeSimple("0");
            removeSimple("AAAAAAAA");
            removeSimple("ABC");
        });

        test("StatusAdd", 4, function () {

            var result;

            function addSimple(before, after) {

                result = EditDidWhat.detectChange(before, after);
                strictEqual(result, EditDidWhat.StatusAdd, before + "/" + after + " strings returned " + result);
            }

            addSimple("AA", "AbA");
            addSimple("00", "010");
            addSimple("AAAAAAAA", "AAAAAAAbA");
            addSimple("ABC", "AbBC");
        });

        test("StatusReplace", 4, function () {

            var result;

            function addSimple(before, after) {

                result = EditDidWhat.detectChange(before, after);
                strictEqual(result, EditDidWhat.StatusReplace, before + "/" + after + " strings returned " + result);
            }

            addSimple("AA", "AB");
            addSimple("00", "01");
            addSimple("AAABAAAA", "AAAAAAAA");
            addSimple("ABC", "ADC");
        });
    }());

    (function () {
        module("findDifferenceIndex");

        test("Simple", 30, function () {

            var result;

            function differenceIndex(before, after, expected) {

                result = EditDidWhat.findDifferenceIndex(before, after);
                strictEqual(result, expected, before + "/" + after + " strings returned " + result);
            }

            differenceIndex("", "", -1);
            differenceIndex("", "A", 0);
            differenceIndex("A", "", 0);
            differenceIndex("AA", "ABC", 1);
            differenceIndex("ABC", "AA", 1);
            differenceIndex("ABC", "A", 1);
            differenceIndex("ABC", "", 0);
            differenceIndex("B", "AB", 0);
            differenceIndex("AB", "B", 0);
            differenceIndex("AB", "", 0);
            differenceIndex("AA", "AA", -1);
            differenceIndex("AA", "AB", 1);
            differenceIndex("AB", "AA", 1);
            differenceIndex("AB", "A", 1);
            differenceIndex("00", "01", 1);
            differenceIndex("01", "00", 1);
            differenceIndex("01", "0", 1);
            differenceIndex("AAABAAAA", "AAAAAAAA", 3);
            differenceIndex("AAAAAAAA", "AAABAAAA", 3);
            differenceIndex("AAAAAAAA", "AAABAAA", 3);
            differenceIndex("AAAAAAAA", "AAABAA", 3);
            differenceIndex("AAAAAAAA", "AAABA", 3);
            differenceIndex("AAAAAAAA", "AAAB", 3);
            differenceIndex("AAAAAAAA", "AAA", 3);
            differenceIndex("AAAAAAAA", "AA", 2);
            differenceIndex("AAAAAAAA", "A", 1);
            differenceIndex("AAAAAAAA", "", 0);
            differenceIndex("ABC", "ADC", 1);
            differenceIndex("ADC", "ABC", 1);
            differenceIndex("ADC", "AB", 1);
        });
    }());

    (function () {
        module("findLastDifferenceIndex");

        test("Simple", 30, function () {

            var result;

            function lastDifferenceIndex(before, after, expected) {

                result = EditDidWhat.findLastDifferenceIndex(before, after);
                strictEqual(result, expected, before + "/" + after + " strings returned " + result);
            }

            lastDifferenceIndex("", "", -1);
            lastDifferenceIndex("", "A", 0);
            lastDifferenceIndex("A", "", 0);
            lastDifferenceIndex("AA", "ABC", 2);
            lastDifferenceIndex("ABC", "AA", 2);
            lastDifferenceIndex("ABC", "A", 2);
            lastDifferenceIndex("ABC", "", 2);
            lastDifferenceIndex("B", "AB", 1);
            lastDifferenceIndex("AB", "B", 1);
            lastDifferenceIndex("AB", "", 1);
            lastDifferenceIndex("AA", "AA", -1);
            lastDifferenceIndex("AA", "AB", 1);
            lastDifferenceIndex("AB", "AA", 1);
            lastDifferenceIndex("AB", "A", 1);
            lastDifferenceIndex("00", "01", 1);
            lastDifferenceIndex("01", "00", 1);
            lastDifferenceIndex("01", "0", 1);
            lastDifferenceIndex("AAABAAAA", "AAAAAAAA", 3);
            lastDifferenceIndex("AAAAAAAA", "AAABAAAA", 3);
            lastDifferenceIndex("AAAAAAAA", "AAABAAA", 7);
            lastDifferenceIndex("AAAAAAAA", "AAABAA", 7);
            lastDifferenceIndex("AAAAAAAA", "AAABA", 7);
            lastDifferenceIndex("AAAAAAAA", "AAAB", 7);
            lastDifferenceIndex("AAAAAAAA", "AAA", 7);
            lastDifferenceIndex("AAAAAAAA", "AA", 7);
            lastDifferenceIndex("AAAAAAAA", "A", 7);
            lastDifferenceIndex("AAAAAAAA", "", 7);
            lastDifferenceIndex("ABC", "ADC", 1);
            lastDifferenceIndex("ADC", "ABC", 1);
            lastDifferenceIndex("ADC", "AB", 2);
        });
    }());

    (function () {
        module("getShortestLength");

        test("Simple", 15, function () {

            var result;

            function shortestLength(a, b, expected) {

                result = EditDidWhat.getShortestLength(a, b);
                strictEqual(result, expected, a + "/" + b + " strings returned " + result);
            }

            shortestLength("", "", 0);
            shortestLength("a", "", 0);
            shortestLength("", "b", 0);
            shortestLength("a", "b", 1);
            shortestLength("aa", "", 0);
            shortestLength("aa", "b", 1);
            shortestLength("aaa", "bb", 2);
            shortestLength("", "bb", 0);
            shortestLength("a", "bb", 1);
            shortestLength("aa", "bb", 2);
            shortestLength("", "bbb", 0);
            shortestLength("a", "bbb", 1);
            shortestLength("aa", "bbb", 2);
            shortestLength("aaa", "bbb", 3);
            shortestLength("aaaa", "bbb", 3);
        });
    }());

    (function () {
        module("getLongestLength");

        test("Simple", 15, function () {

            var result;

            function longestLength(a, b, expected) {

                result = EditDidWhat.getLongestLength(a, b);
                strictEqual(result, expected, a + "/" + b + " strings returned " + result);
            }

            longestLength("", "", 0);
            longestLength("a", "", 1);
            longestLength("", "b", 1);
            longestLength("a", "b", 1);
            longestLength("aa", "", 2);
            longestLength("aa", "b", 2);
            longestLength("aaa", "bb", 3);
            longestLength("", "bb", 2);
            longestLength("a", "bb", 2);
            longestLength("aa", "bb", 2);
            longestLength("", "bbb", 3);
            longestLength("a", "bbb", 3);
            longestLength("aa", "bbb", 3);
            longestLength("aaa", "bbb", 3);
            longestLength("aaaa", "bbb", 4);
        });
    }());

    (function () {
        module("getCount");

        var result;

        function getCount(a, b, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getCount(a, b);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getCount(a, b);
            }

            strictEqual(result, expected, a + "/" + b + " strings returned " + result);
        }

        test("Error", 8, function () {

			getCount(undefined, "a", Error);
			getCount(null, "a", Error);
			getCount(new Date(), "a", Error);
            getCount("", "", Error);
            getCount("a", "", Error);
            getCount("", undefined, Error);
            getCount("", null, Error);
            getCount("", new Date(), Error);
        });

        test("String", 11, function () {

            getCount("", "b", 0);
            getCount("a", "b", 0);
            getCount("aa", "a", 2);
            getCount("aa", "b", 0);
            getCount("ab", "a", 1);
            getCount("ab", "b", 1);
            getCount("ab", "ab", 1);
            getCount("aba", "a", 2);
            getCount("aba", "b", 1);
            getCount("aba", "ab", 1);
            getCount("aba", "ba", 1);
        });

        test("RegExp", 11, function () {

            getCount("", /./, 0);
			getCount("", /.+/, 0);
            getCount("a", /./, 1);
			getCount("a", /.+/, 1);
            getCount("aa", /./, 2);
			getCount("aa", /.+/, 1);
            getCount("aaa", /./, 3);
			getCount("aaa", /.+/, 1);
            getCount("aba", /./, 3);
			getCount("aba", /.+/, 1);
            getCount("aba", /(.)\1/, 0);
        });
    }());

    (function () {
        module("getLineCount");

        var result;

        function getLineCount(a, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineCount(a);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineCount(a);
            }

            strictEqual(result, expected, a + " string returned " + result);
        }

        test("String", 9, function () {

            getLineCount("", 1);
			getLineCount("\n", 2);
			getLineCount("\n\n", 3);
			getLineCount("a", 1);
			getLineCount("a\n", 2);
			getLineCount("a\n\n", 3);
			getLineCount("a\na", 2);
			getLineCount("a\na\n", 3);
			getLineCount("a\na\na", 3);
        });
    }());

	(function () {
        module("getLineStartAt");

        var result;

        function lineStartAt(str, index, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineStartAt(str, index);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineStartAt(str, index);
            }

            strictEqual(result, expected, str.withReadableLinebreaks() + " at index " + index + " returned " + result);
        }

        test("Line breaks", 20, function () {

            lineStartAt("", 0, 0);
            lineStartAt("", 1, Error);
            lineStartAt("\n", 0, 0);
            lineStartAt("\n", 1, 1);
            lineStartAt("\n", 2, Error);
            lineStartAt("\n\n", 0, 0);
            lineStartAt("\n\n", 1, 1);
            lineStartAt("\n\n", 2, 2);
            lineStartAt("\n\n", 3, Error);
            lineStartAt("\n\n\n", 0, 0);
            lineStartAt("\n\n\n", 1, 1);
            lineStartAt("\n\n\n", 2, 2);
            lineStartAt("\n\n\n", 3, 3);
            lineStartAt("\n\n\n", 4, Error);
            lineStartAt("\n\n\n\n", 0, 0);
            lineStartAt("\n\n\n\n", 1, 1);
            lineStartAt("\n\n\n\n", 2, 2);
            lineStartAt("\n\n\n\n", 3, 3);
            lineStartAt("\n\n\n\n", 4, 4);
            lineStartAt("\n\n\n\n", 5, Error);

        });

        test("Line contents", 36, function () {

            lineStartAt("a", 0, 0);
            lineStartAt("a", 1, Error);
            lineStartAt("a\n", 0, 0);
            lineStartAt("a\n", 1, 0);
            lineStartAt("a\n", 2, 2);
            lineStartAt("a\n", 3, Error);
            lineStartAt("aa\n", 0, 0);
            lineStartAt("aa\n", 1, 0);
            lineStartAt("aa\n", 2, 0);
            lineStartAt("aa\n", 3, 3);
            lineStartAt("aa\n", 4, Error);
            lineStartAt("a\na", 0, 0);
            lineStartAt("a\na", 1, 0);
            lineStartAt("a\na", 2, 2);
            lineStartAt("a\na", 3, Error);
            lineStartAt("a\nb\n", 0, 0);
            lineStartAt("a\nb\n", 1, 0);
            lineStartAt("a\nb\n", 2, 2);
            lineStartAt("a\nb\n", 3, 2);
            lineStartAt("a\nb\n", 4, 4);
            lineStartAt("a\nb\n", 5, Error);
            lineStartAt("a\nb\nc", 0, 0);
            lineStartAt("a\nb\nc", 1, 0);
            lineStartAt("a\nb\nc", 2, 2);
            lineStartAt("a\nb\nc", 3, 2);
            lineStartAt("a\nb\nc", 4, 4);
            lineStartAt("a\nb\nc", 5, Error);
            lineStartAt("aa\nbb\ncc", 0, 0);
            lineStartAt("aa\nbb\ncc", 1, 0);
            lineStartAt("aa\nbb\ncc", 2, 0);
            lineStartAt("aa\nbb\ncc", 3, 3);
            lineStartAt("aa\nbb\ncc", 4, 3);
            lineStartAt("aa\nbb\ncc", 5, 3);
            lineStartAt("aa\nbb\ncc", 6, 6);
            lineStartAt("aa\nbb\ncc", 7, 6);
            lineStartAt("aa\nbb\ncc", 8, Error);

        });
    }());

    (function () {
        module("getLineEndAt");

        var result;

        function lineEndAt(str, index, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineEndAt(str, index);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineEndAt(str, index);
            }

            strictEqual(result, expected, str.withReadableLinebreaks() + " at index " + index + " returned " + result);
        }

        test("Line breaks", 20, function () {

            lineEndAt("", 0, 0);
            lineEndAt("", 1, Error);
            lineEndAt("\n", 0, 0);
            lineEndAt("\n", 1, 1);
            lineEndAt("\n", 2, Error);
            lineEndAt("\n\n", 0, 0);
            lineEndAt("\n\n", 1, 1);
            lineEndAt("\n\n", 2, 2);
            lineEndAt("\n\n", 3, Error);
            lineEndAt("\n\n\n", 0, 0);
            lineEndAt("\n\n\n", 1, 1);
            lineEndAt("\n\n\n", 2, 2);
            lineEndAt("\n\n\n", 3, 3);
            lineEndAt("\n\n\n", 4, Error);
            lineEndAt("\n\n\n\n", 0, 0);
            lineEndAt("\n\n\n\n", 1, 1);
            lineEndAt("\n\n\n\n", 2, 2);
            lineEndAt("\n\n\n\n", 3, 3);
            lineEndAt("\n\n\n\n", 4, 4);
            lineEndAt("\n\n\n\n", 5, Error);

        });

        test("Line contents", 37, function () {

            lineEndAt("a", 0, 0);
            lineEndAt("a", 1, Error);
            lineEndAt("a", 2, Error);
            lineEndAt("a\n", 0, 0);
            lineEndAt("a\n", 1, 0);
            lineEndAt("a\n", 2, 2);
            lineEndAt("a\n", 3, Error);
            lineEndAt("aa\n", 0, 1);
            lineEndAt("aa\n", 1, 1);
            lineEndAt("aa\n", 2, 1);
            lineEndAt("aa\n", 3, 3);
            lineEndAt("aa\n", 4, Error);
            lineEndAt("a\na", 0, 0);
            lineEndAt("a\na", 1, 0);
            lineEndAt("a\na", 2, 2);
            lineEndAt("a\na", 3, Error);
            lineEndAt("a\nb\n", 0, 0);
            lineEndAt("a\nb\n", 1, 0);
            lineEndAt("a\nb\n", 2, 2);
            lineEndAt("a\nb\n", 3, 2);
            lineEndAt("a\nb\n", 4, 4);
            lineEndAt("a\nb\n", 5, Error);
            lineEndAt("a\nb\nc", 0, 0);
            lineEndAt("a\nb\nc", 1, 0);
            lineEndAt("a\nb\nc", 2, 2);
            lineEndAt("a\nb\nc", 3, 2);
            lineEndAt("a\nb\nc", 4, 4);
            lineEndAt("a\nb\nc", 5, Error);
            lineEndAt("aa\nbb\ncc", 0, 1);
            lineEndAt("aa\nbb\ncc", 1, 1);
            lineEndAt("aa\nbb\ncc", 2, 1);
            lineEndAt("aa\nbb\ncc", 3, 4);
            lineEndAt("aa\nbb\ncc", 4, 4);
            lineEndAt("aa\nbb\ncc", 5, 4);
            lineEndAt("aa\nbb\ncc", 6, 7);
            lineEndAt("aa\nbb\ncc", 7, 7);
            lineEndAt("aa\nbb\ncc", 8, Error);

        });
    }());

    (function () {
        module("getLineNumberAt");

        var result;

        function getLineNumberAt(str, index, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineNumberAt(str, index);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineNumberAt(str, index);
            }

            strictEqual(result, expected, str.withReadableLinebreaks() + " at index " + index + " returned " + result);
        }

        test("Line breaks", 14, function () {

            getLineNumberAt("", 0, 0);
            getLineNumberAt("\n", 0, 0);
            getLineNumberAt("\n", 1, 1);
            getLineNumberAt("\n", 2, Error);
            getLineNumberAt("\n", 3, Error);
            getLineNumberAt("\n\n", 0, 0);
            getLineNumberAt("\n\n", 1, 1);
            getLineNumberAt("\n\n", 2, 2);
            getLineNumberAt("\n\n", 3, Error);
            getLineNumberAt("\n\n\n", 0, 0);
            getLineNumberAt("\n\n\n", 1, 1);
            getLineNumberAt("\n\n\n", 2, 2);
            getLineNumberAt("\n\n\n", 3, 3);
            getLineNumberAt("\n\n\n", 4, Error);

        });

        test("Line contents", 36, function () {

            getLineNumberAt("a", 0, 0);
            getLineNumberAt("a", 1, Error);
            getLineNumberAt("a\n", 0, 0);
            getLineNumberAt("a\n", 1, 0);
            getLineNumberAt("a\n", 2, 1);
            getLineNumberAt("a\n", 3, Error);
            getLineNumberAt("aa\n", 0, 0);
            getLineNumberAt("aa\n", 1, 0);
            getLineNumberAt("aa\n", 2, 0);
            getLineNumberAt("aa\n", 3, 1);
            getLineNumberAt("aa\n", 4, Error);
            getLineNumberAt("a\na", 0, 0);
            getLineNumberAt("a\na", 1, 0);
            getLineNumberAt("a\na", 2, 1);
            getLineNumberAt("a\na", 3, Error);
            getLineNumberAt("a\nb\n", 0, 0);
            getLineNumberAt("a\nb\n", 1, 0);
            getLineNumberAt("a\nb\n", 2, 1);
            getLineNumberAt("a\nb\n", 3, 1);
            getLineNumberAt("a\nb\n", 4, 2);
            getLineNumberAt("a\nb\n", 5, Error);
            getLineNumberAt("a\nb\nc", 0, 0);
            getLineNumberAt("a\nb\nc", 1, 0);
            getLineNumberAt("a\nb\nc", 2, 1);
            getLineNumberAt("a\nb\nc", 3, 1);
            getLineNumberAt("a\nb\nc", 4, 2);
            getLineNumberAt("a\nb\nc", 5, Error);
            getLineNumberAt("aa\nbb\ncc", 0, 0);
            getLineNumberAt("aa\nbb\ncc", 1, 0);
            getLineNumberAt("aa\nbb\ncc", 2, 0);
            getLineNumberAt("aa\nbb\ncc", 3, 1);
            getLineNumberAt("aa\nbb\ncc", 4, 1);
            getLineNumberAt("aa\nbb\ncc", 5, 1);
            getLineNumberAt("aa\nbb\ncc", 6, 2);
            getLineNumberAt("aa\nbb\ncc", 7, 2);
            getLineNumberAt("aa\nbb\ncc", 8, Error);

        });
    }());

	(function () {
        module("getLineStart");

        var result;

        function lineStart(str, index, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineStart(str, index);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineStart(str, index);
            }

            strictEqual(result, expected, str.withReadableLinebreaks() + " at index " + index + " returned " + result);
        }

        test("Line breaks", 20, function () {

            lineStart("", 0, 0);
            lineStart("", 1, Error);
            lineStart("\n", 0, 0);
            lineStart("\n", 1, 1);
            lineStart("\n", 2, Error);
            lineStart("\n\n", 0, 0);
            lineStart("\n\n", 1, 1);
            lineStart("\n\n", 2, 2);
            lineStart("\n\n", 3, Error);
            lineStart("\n\n\n", 0, 0);
            lineStart("\n\n\n", 1, 1);
            lineStart("\n\n\n", 2, 2);
            lineStart("\n\n\n", 3, 3);
            lineStart("\n\n\n", 4, Error);
            lineStart("\n\n\n\n", 0, 0);
            lineStart("\n\n\n\n", 1, 1);
            lineStart("\n\n\n\n", 2, 2);
            lineStart("\n\n\n\n", 3, 3);
            lineStart("\n\n\n\n", 4, 4);
            lineStart("\n\n\n\n", 5, Error);

        });

        test("Line contents", 23, function () {

            lineStart("a", 0, 0);
            lineStart("a", 1, Error);
            lineStart("a\n", 0, 0);
            lineStart("a\n", 1, 2);
            lineStart("a\n", 2, Error);
            lineStart("aa\n", 0, 0);
            lineStart("aa\n", 1, 3);
            lineStart("aa\n", 2, Error);
            lineStart("a\na", 0, 0);
            lineStart("a\na", 1, 2);
            lineStart("a\na", 2, Error);
            lineStart("a\nb\n", 0, 0);
            lineStart("a\nb\n", 1, 2);
            lineStart("a\nb\n", 2, 4);
            lineStart("a\nb\n", 3, Error);
            lineStart("a\nb\nc", 0, 0);
            lineStart("a\nb\nc", 1, 2);
            lineStart("a\nb\nc", 2, 4);
            lineStart("a\nb\nc", 4, Error);
            lineStart("aa\nbb\ncc", 0, 0);
            lineStart("aa\nbb\ncc", 1, 3);
            lineStart("aa\nbb\ncc", 2, 6);
            lineStart("aa\nbb\ncc", 3, Error);

        });
    }());

    (function () {
        module("getLineEnd");

        var result;

        function lineEnd(str, lineNumber, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineEnd(str, lineNumber);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineEnd(str, lineNumber);
            }

            strictEqual(result, expected, str.withReadableLinebreaks()
							+ " at line number " + lineNumber + " returned " + result);
        }

        test("Line breaks", 20, function () {

            lineEnd("", 0, 0);
            lineEnd("", 1, Error);
            lineEnd("\n", 0, 0);
            lineEnd("\n", 1, 1);
            lineEnd("\n", 2, Error);
            lineEnd("\n\n", 0, 0);
            lineEnd("\n\n", 1, 1);
            lineEnd("\n\n", 2, 2);
            lineEnd("\n\n", 3, Error);
            lineEnd("\n\n\n", 0, 0);
            lineEnd("\n\n\n", 1, 1);
            lineEnd("\n\n\n", 2, 2);
            lineEnd("\n\n\n", 3, 3);
            lineEnd("\n\n\n", 4, Error);
            lineEnd("\n\n\n\n", 0, 0);
            lineEnd("\n\n\n\n", 1, 1);
            lineEnd("\n\n\n\n", 2, 2);
            lineEnd("\n\n\n\n", 3, 3);
            lineEnd("\n\n\n\n", 4, 4);
            lineEnd("\n\n\n\n", 5, Error);

        });

        test("Line contents", 24, function () {

            lineEnd("a", 0, 1);
            lineEnd("a", 1, Error);
            lineEnd("a", 2, Error);
            lineEnd("a\n", 0, 1);
            lineEnd("a\n", 1, 2);
            lineEnd("a\n", 2, Error);
            lineEnd("aa\n", 0, 2);
            lineEnd("aa\n", 1, 3);
            lineEnd("aa\n", 2, Error);
            lineEnd("a\na", 0, 1);
            lineEnd("a\na", 1, 3);
            lineEnd("a\na", 2, Error);
            lineEnd("a\nb\n", 0, 1);
            lineEnd("a\nb\n", 1, 3);
            lineEnd("a\nb\n", 2, 4);
            lineEnd("a\nb\n", 3, Error);
            lineEnd("a\nb\nc", 0, 1);
            lineEnd("a\nb\nc", 1, 3);
            lineEnd("a\nb\nc", 2, 5);
            lineEnd("a\nb\nc", 3, Error);
            lineEnd("aa\nbb\ncc", 0, 2);
            lineEnd("aa\nbb\ncc", 1, 5);
            lineEnd("aa\nbb\ncc", 2, 8);
            lineEnd("aa\nbb\ncc", 3, Error);

        });
    }());

    (function () {
        module("getLineAt");

        var result;

        function lineAt(str, index, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLineAt(str, index);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLineAt(str, index);
            }

            strictEqual(result, expected, str.withReadableLinebreaks()
							+ " at index " + index + " returned " + result.withReadableLinebreaks());
        }

        test("Line breaks", 19, function () {

            lineAt("", 0, "");
            lineAt("\n", 0, "");
            lineAt("\n", 1, "");
            lineAt("\n", 2, Error);
            lineAt("\n\n", 0, "");
            lineAt("\n\n", 1, "");
            lineAt("\n\n", 2, "");
            lineAt("\n\n", 3, Error);
            lineAt("\n\n\n", 0, "");
            lineAt("\n\n\n", 1, "");
            lineAt("\n\n\n", 2, "");
            lineAt("\n\n\n", 3, "");
            lineAt("\n\n\n", 4, Error);
            lineAt("\n\n\n\n", 0, "");
            lineAt("\n\n\n\n", 1, "");
            lineAt("\n\n\n\n", 2, "");
            lineAt("\n\n\n\n", 3, "");
            lineAt("\n\n\n\n", 4, "");
            lineAt("\n\n\n\n", 5, Error);

        });

        test("Line contents", 36, function () {

            lineAt("a", 0, "a");
            lineAt("a", 1, Error);
            lineAt("a\n", 0, "a");
            lineAt("a\n", 1, "a");
            lineAt("a\n", 2, "");
            lineAt("a\n", 3, Error);
            lineAt("aa\n", 0, "aa");
            lineAt("aa\n", 1, "aa");
            lineAt("aa\n", 2, "aa");
            lineAt("aa\n", 3, "");
            lineAt("aa\n", 4, Error);
            lineAt("a\nb", 0, "a");
            lineAt("a\nb", 1, "a");
            lineAt("a\nb", 2, "b");
            lineAt("a\nb", 3, Error);
            lineAt("a\nb\n", 0, "a");
            lineAt("a\nb\n", 1, "a");
            lineAt("a\nb\n", 2, "b");
            lineAt("a\nb\n", 3, "b");
            lineAt("a\nb\n", 4, "");
            lineAt("a\nb\n", 5, Error);
            lineAt("a\nb\nc", 0, "a");
            lineAt("a\nb\nc", 1, "a");
            lineAt("a\nb\nc", 2, "b");
            lineAt("a\nb\nc", 3, "b");
            lineAt("a\nb\nc", 4, "c");
            lineAt("a\nb\nc", 5, Error);
            lineAt("aa\nbb\ncc", 0, "aa");
            lineAt("aa\nbb\ncc", 1, "aa");
            lineAt("aa\nbb\ncc", 2, "aa");
            lineAt("aa\nbb\ncc", 3, "bb");
            lineAt("aa\nbb\ncc", 4, "bb");
            lineAt("aa\nbb\ncc", 5, "bb");
            lineAt("aa\nbb\ncc", 6, "cc");
            lineAt("aa\nbb\ncc", 7, "cc");
            lineAt("aa\nbb\ncc", 8, Error);

        });
    }());

    (function () {
        module("getLine");

        var result;

        function line(str, lineNumber, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.getLine(str, lineNumber);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.getLine(str, lineNumber);
            }

            strictEqual(result, expected, str.withReadableLinebreaks()
							+ " at line " + lineNumber + " returned " + result.withReadableLinebreaks());
        }

        test("Line breaks", 19, function () {

            line("", 0, "");
            line("\n", 0, "");
            line("\n", 1, "");
            line("\n", 2, Error);
            line("\n\n", 0, "");
            line("\n\n", 1, "");
            line("\n\n", 2, "");
            line("\n\n", 3, Error);
            line("\n\n\n", 0, "");
            line("\n\n\n", 1, "");
            line("\n\n\n", 2, "");
            line("\n\n\n", 3, "");
            line("\n\n\n", 4, Error);
            line("\n\n\n\n", 0, "");
            line("\n\n\n\n", 1, "");
            line("\n\n\n\n", 2, "");
            line("\n\n\n\n", 3, "");
            line("\n\n\n\n", 4, "");
            line("\n\n\n\n", 5, Error);

        });

        test("Line contents", 23, function () {

            line("a", 0, "a");
            line("a", 1, Error);
            line("a\n", 0, "a");
            line("a\n", 1, "");
            line("a\n", 2, Error);
            line("aa\n", 0, "aa");
            line("aa\n", 1, "");
            line("aa\n", 2, Error);
            line("a\nb", 0, "a");
            line("a\nb", 1, "b");
            line("a\nb", 2, Error);
            line("a\nb\n", 0, "a");
            line("a\nb\n", 1, "b");
            line("a\nb\n", 2, "");
            line("a\nb\n", 3, Error);
            line("a\nb\nc", 0, "a");
            line("a\nb\nc", 1, "b");
            line("a\nb\nc", 2, "c");
            line("a\nb\nc", 3, Error);
            line("aa\nbb\ncc", 0, "aa");
            line("aa\nbb\ncc", 1, "bb");
            line("aa\nbb\ncc", 2, "cc");
            line("aa\nbb\ncc", 3, Error);

        });
    }());

    (function () {
        module("replaceLine");

        var result;

        function replaceLine(str, lineNumber, replaceWith, expected) {

            if (expected === Error) {

                expected = errorRepresentationString;

                try {

                    result = EditDidWhat.replaceLine(str, lineNumber, replaceWith);

                } catch (e) {

                    result = errorRepresentationString;
                }
            }
            else {
                result = EditDidWhat.replaceLine(str, lineNumber, replaceWith);
            }

            strictEqual(result.withReadableLinebreaks(), expected.withReadableLinebreaks(), str.withReadableLinebreaks()
							+ " at lineNumber " + lineNumber + "/\"" + replaceWith
							+ "\" returned " + result.withReadableLinebreaks());
        }

        test("Line breaks", 35, function () {

            replaceLine("", 0, "", "");
            replaceLine("\n", 0, "", "\n");
            replaceLine("\n", 1, "", "\n");
            replaceLine("\n", 1, "a", "\na");
            replaceLine("\n", 2, "", Error);
            replaceLine("\n", 2, "a", Error);
            replaceLine("\n\n", 0, "", "\n\n");
            replaceLine("\n\n", 1, "", "\n\n");
            replaceLine("\n\n", 2, "", "\n\n");
            replaceLine("\n\n", 2, "a", "\n\na");
            replaceLine("\n\n", 2, "aa", "\n\naa");
            replaceLine("\n\n", 3, "", Error);
            replaceLine("\n\n\n", 0, "", "\n\n\n");
            replaceLine("\n\n\n", 1, "", "\n\n\n");
            replaceLine("\n\n\n", 2, "", "\n\n\n");
            replaceLine("\n\n\n", 3, "", "\n\n\n");
            replaceLine("\n\n\n", 3, "a", "\n\n\na");
            replaceLine("\n\n\n", 3, "aa", "\n\n\naa");
            replaceLine("\n\n\n", 4, "", Error);
            replaceLine("\n\n\n\n", 0, "", "\n\n\n\n");
            replaceLine("\n\n\n\n", 0, "a", "a\n\n\n\n");
            replaceLine("\n\n\n\n", 0, "aa", "aa\n\n\n\n");
            replaceLine("\n\n\n\n", 1, "", "\n\n\n\n");
            replaceLine("\n\n\n\n", 1, "a", "\na\n\n\n");
            replaceLine("\n\n\n\n", 1, "aa", "\naa\n\n\n");
            replaceLine("\n\n\n\n", 2, "", "\n\n\n\n");
            replaceLine("\n\n\n\n", 2, "a", "\n\na\n\n");
            replaceLine("\n\n\n\n", 2, "aa", "\n\naa\n\n");
            replaceLine("\n\n\n\n", 3, "", "\n\n\n\n");
            replaceLine("\n\n\n\n", 3, "a", "\n\n\na\n");
            replaceLine("\n\n\n\n", 3, "aa", "\n\n\naa\n");
            replaceLine("\n\n\n\n", 4, "", "\n\n\n\n");
            replaceLine("\n\n\n\n", 4, "a", "\n\n\n\na");
            replaceLine("\n\n\n\n", 4, "aa", "\n\n\n\naa");
            replaceLine("\n\n\n\n", 5, "", Error);

        });

        test("Line contents", 54, function () {

            replaceLine("a", 0, "", "");
            replaceLine("a", 0, "a", "a");
            replaceLine("a", 0, "b", "b");
            replaceLine("a", 0, "aa", "aa");
            replaceLine("a", 0, "bb", "bb");
            replaceLine("a", 1, "", Error);
            replaceLine("a", 1, "b", Error);
            replaceLine("a", 1, "bb", Error);
            replaceLine("a\n", 0, "", "\n");
            replaceLine("a\n", 0, "a", "a\n");
            replaceLine("a\n", 0, "b", "b\n");
            replaceLine("a\n", 0, "bb", "bb\n");
            replaceLine("a\n", 1, "", "a\n");
            replaceLine("a\n", 1, "a", "a\na");
            replaceLine("a\n", 1, "aa", "a\naa");
            replaceLine("a\n", 2, "", Error);
            replaceLine("a\n", 2, "a", Error);
            replaceLine("a\n", 2, "aa", Error);
            replaceLine("aa\n", 0, "aa", "aa\n");
            replaceLine("aa\n", 0, "b", "b\n");
            replaceLine("aa\n", 0, "bb", "bb\n");
            replaceLine("aa\n", 1, "aa", "aa\naa");
            replaceLine("aa\n", 1, "b", "aa\nb");
            replaceLine("aa\n", 2, "bb", Error);
            replaceLine("aa\n", 3, "", Error);
            replaceLine("aa\n", 3, "aa", Error);
            replaceLine("aa\n", 3, "b", Error);
            replaceLine("aa\n", 3, "bb", Error);
            replaceLine("a\nb", 0, "a", "a\nb");
            replaceLine("a\nb", 0, "c", "c\nb");
            replaceLine("a\nb", 0, "cc", "cc\nb");
            replaceLine("a\nb", 1, "c", "a\nc");
            replaceLine("a\nb", 1, "cc", "a\ncc");
            replaceLine("a\nb", 2, "", Error);
            replaceLine("a\nb", 2, "a", Error);
            replaceLine("a\nb", 2, "b", Error);
            replaceLine("a\nb", 2, "bb", Error);
            replaceLine("a\nb", 3, "", Error);
            replaceLine("a\nb", 3, "a", Error);
            replaceLine("a\nb", 3, "b", Error);
            replaceLine("a\nb", 3, "bb", Error);
            replaceLine("a\nb\n", 0, "c", "c\nb\n");
            replaceLine("a\nb\n", 1, "c", "a\nc\n");
            replaceLine("a\nb\n", 2, "c", "a\nb\nc");
            replaceLine("a\nb\n", 3, "c", Error);
            replaceLine("a\nb\nc", 0, "d", "d\nb\nc");
            replaceLine("a\nb\nc", 1, "d", "a\nd\nc");
            replaceLine("a\nb\nc", 2, "d", "a\nb\nd");
            replaceLine("a\nb\nc", 3, "d", Error);
            replaceLine("a\nb\nc", 4, "d", Error);
            replaceLine("aa\nbb\ncc", 0, "dd", "dd\nbb\ncc");
            replaceLine("aa\nbb\ncc", 1, "dd", "aa\ndd\ncc");
            replaceLine("aa\nbb\ncc", 2, "dd", "aa\nbb\ndd");
            replaceLine("aa\nbb\ncc", 3, "dd", Error);

        });
    }());
}());

