/* global
EditDidWhat:false,
QUnit:false,
*/

(function() {
    var errorRepresentationString = "Error";

    function withReadableLinebreaks(str) {
        return str.replace(/\n/g, "\\n");
    };

    (function() {
        QUnit.module("Library init");

        QUnit.test("Object exists", function(assert) {
            assert.expect(2);

            assert.notStrictEqual(typeof (EditDidWhat), "undefined", "EditDidWhat is undefined.");
            assert.strictEqual(typeof (EditDidWhat), "object", "EditDidWhat is not an object.");
        });

        QUnit.test("Statuses", function(assert) {
            assert.expect(7);

            assert.strictEqual(typeof (EditDidWhat.StatusUnknown), "string", "EditDidWhat.StatusUnknown is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusInsert), "string", "EditDidWhat.StatusInsert is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusTruncate), "string", "EditDidWhat.StatusTruncate is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusReplace), "string", "EditDidWhat.StatusReplace is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusNoChange), "string", "EditDidWhat.StatusNoChange is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusAppended), "string", "EditDidWhat.StatusAppended is not a string.");
            assert.strictEqual(typeof (EditDidWhat.StatusSplice), "string", "EditDidWhat.StatusSplice is not a string.");
        });
    }());

    (function() {
        QUnit.module("detectChange");

        QUnit.test("StatusNoChange", function(assert) {
            assert.expect(4);

            var result;

            function bothNoChange(both) {
                result = EditDidWhat.detectChange(both, both);
                assert.strictEqual(result, EditDidWhat.StatusNoChange, both + " strings returned " + result);
            }

            bothNoChange("");
            bothNoChange("A");
            bothNoChange("ABC");
            bothNoChange("AAAAAAAAAAAAAAAAA");
        });

        QUnit.test("StatusAppended", function(assert) {
            assert.expect(5);

            var result;

            function appendSimple(before) {
                var after = before + "a";
                result = EditDidWhat.detectChange(before, after);
                assert.strictEqual(result, EditDidWhat.StatusAppended, before + "/" + after + " strings returned " + result);
            }

            appendSimple("");
            appendSimple("A");
            appendSimple("0");
            appendSimple("AAAAAAAA");
            appendSimple("ABC");
        });

        QUnit.test("StatusTruncate", function(assert) {
            assert.expect(4);

            var result;

            function truncateSimple(before) {
                var after;

                if (before.length >= 1) {
                    after = before.substr(0, before.length - 1);
                } else {
                    after = "";
                }

                result = EditDidWhat.detectChange(before, after);
                assert.strictEqual(result, EditDidWhat.StatusTruncate,
                                before + "/" + after + " strings returned " + result);
            }

            truncateSimple("A");
            truncateSimple("0");
            truncateSimple("AAAAAAAA");
            truncateSimple("ABC");
        });

        QUnit.test("StatusInsert", function(assert) {
            assert.expect(5);

            var result;

            function addSimple(before, after) {
                result = EditDidWhat.detectChange(before, after);
                assert.strictEqual(result, EditDidWhat.StatusInsert, before + "/" + after + " strings returned " + result);
            }

            addSimple("AA", "AbA");
            addSimple("00", "010");
            addSimple("AAAAAAAA", "AAAAAAAbA");
            addSimple("ABC", "AbBC");
            addSimple("ABC", "A\nBC");
        });

        QUnit.test("StatusReplace", function(assert) {
            assert.expect(4);

            var result;

            function addSimple(before, after) {
                result = EditDidWhat.detectChange(before, after);
                assert.strictEqual(result, EditDidWhat.StatusReplace, before + "/" + after + " strings returned " + result);
            }

            addSimple("AA", "AB");
            addSimple("00", "01");
            addSimple("AAABAAAA", "AAAAAAAA");
            addSimple("ABC", "ADC");
        });

        QUnit.test("StatusSplice", function(assert) {
            assert.expect(3);

            var result;

            function addSimple(before, after) {
                result = EditDidWhat.detectChange(before, after);
                assert.strictEqual(result, EditDidWhat.StatusSplice, before + "/" + after + " strings returned " + result);
            }

            addSimple("AAbAA", "AAAA");
            addSimple("ABCDEFG", "ABCFG");
            addSimple("ABCDEFG", "ABCxFG");
        });
    }());

    (function() {
        QUnit.module("findDifferenceIndex");

        QUnit.test("Simple", function(assert) {
            assert.expect(30);

            var result;

            function differenceIndex(before, after, expected) {
                result = EditDidWhat.findDifferenceIndex(before, after);
                assert.strictEqual(result, expected, before + "/" + after + " strings returned " + result);
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

    (function() {
        QUnit.module("findLastDifferenceIndex");

        QUnit.test("Simple", function(assert) {
            assert.expect(30);

            var result;

            function lastDifferenceIndex(before, after, expected) {
                result = EditDidWhat.findLastDifferenceIndex(before, after);
                assert.strictEqual(result, expected, before + "/" + after + " strings returned " + result);
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

    (function() {
        QUnit.module("reverse");

        QUnit.test("Simple", function(assert) {
            assert.expect(7);

            var result;

            function reverse(str, expected) {
                result = EditDidWhat.reverse(str);
                assert.strictEqual(result, expected, withReadableLinebreaks(str) + " strings returned " + result);
            }

            reverse("", "");
            reverse("a", "a");
            reverse("ab", "ba");
            reverse("abc", "cba");
            reverse("aba", "aba");
            reverse("a\nb\nc", "c\nb\na");
            reverse("a\nb\na", "a\nb\na");
        });
    }());

    (function() {
        QUnit.module("findLastDifferenceIndexAlignRight");

        QUnit.test("Simple", function(assert) {
            assert.expect(36);

            var result;

            function lastDifferenceIndexAlignRight(before, after, expected) {
                result = EditDidWhat.findLastDifferenceIndexAlignRight(before, after);
                assert.strictEqual(result, expected, before + "/" + after + " strings returned " + result);
            }

            lastDifferenceIndexAlignRight("", "", -1);
            lastDifferenceIndexAlignRight("", "A", 0);
            lastDifferenceIndexAlignRight("A", "", 0);
            lastDifferenceIndexAlignRight("AA", "AbC", 2);
            lastDifferenceIndexAlignRight("AbC", "AA", 2);
            lastDifferenceIndexAlignRight("AbC", "A", 2);
            lastDifferenceIndexAlignRight("AbC", "", 2);
            lastDifferenceIndexAlignRight("b", "Ab", 0);
            lastDifferenceIndexAlignRight("Ab", "b", 0);
            lastDifferenceIndexAlignRight("Ab", "", 1);
            lastDifferenceIndexAlignRight("AA", "AA", -1);
            lastDifferenceIndexAlignRight("AA", "Ab", 1);
            lastDifferenceIndexAlignRight("Ab", "AA", 1);
            lastDifferenceIndexAlignRight("Ab", "A", 1);
            lastDifferenceIndexAlignRight("00", "01", 1);
            lastDifferenceIndexAlignRight("01", "00", 1);
            lastDifferenceIndexAlignRight("01", "0", 1);
            lastDifferenceIndexAlignRight("AAAbAAAA", "AAAAAAAA", 3);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAbAAAA", 3);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAbAAA", 4);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAbAA", 5);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAbA", 6);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAb", 7);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAA", 4);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AA", 5);
            lastDifferenceIndexAlignRight("AAAAAAAA", "A", 6);
            lastDifferenceIndexAlignRight("AAAAAAAA", "", 7);
            lastDifferenceIndexAlignRight("AAAAbbbbAAAA", "AAAAAAAA", 7);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAAbbbbAAAA", 7);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAAbbbAAAAA", 6);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAAbbAAAAAA", 5);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAAbAAAAAAA", 4);
            lastDifferenceIndexAlignRight("AAAAAAAA", "AAAAAAAAAAAA", 3);
            lastDifferenceIndexAlignRight("AbC", "ADC", 1);
            lastDifferenceIndexAlignRight("ADC", "AbC", 1);
            lastDifferenceIndexAlignRight("ADC", "Ab", 2);
        });
    }());

    (function() {
        QUnit.module("getShortestLength");

        QUnit.test("Simple", function(assert) {
            assert.expect(15);

            var result;

            function shortestLength(a, b, expected) {
                result = EditDidWhat.getShortestLength(a, b);
                assert.strictEqual(result, expected, a + "/" + b + " strings returned " + result);
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

    (function() {
        QUnit.module("getLongestLength");

        QUnit.test("Simple", function(assert) {
            assert.expect(15);

            var result;

            function longestLength(a, b, expected) {
                result = EditDidWhat.getLongestLength(a, b);
                assert.strictEqual(result, expected, a + "/" + b + " strings returned " + result);
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

    (function() {
        QUnit.module("getCount");

        var result;

        function getCount(assert, a, b, expected) {
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

            assert.strictEqual(result, expected, a + "/" + b + " strings returned " + result);
        }

        QUnit.test("Error", function(assert) {
            assert.expect(8);

            getCount(assert, undefined, "a", Error);
            getCount(assert, null, "a", Error);
            getCount(assert, new Date(), "a", Error);
            getCount(assert, "", "", Error);
            getCount(assert, "a", "", Error);
            getCount(assert, "", undefined, Error);
            getCount(assert, "", null, Error);
            getCount(assert, "", new Date(), Error);
        });

        QUnit.test("String", function(assert) {
            assert.expect(11);

            getCount(assert, "", "b", 0);
            getCount(assert, "a", "b", 0);
            getCount(assert, "aa", "a", 2);
            getCount(assert, "aa", "b", 0);
            getCount(assert, "ab", "a", 1);
            getCount(assert, "ab", "b", 1);
            getCount(assert, "ab", "ab", 1);
            getCount(assert, "aba", "a", 2);
            getCount(assert, "aba", "b", 1);
            getCount(assert, "aba", "ab", 1);
            getCount(assert, "aba", "ba", 1);
        });

        QUnit.test("RegExp", function(assert) {
            assert.expect(11);

            getCount(assert, "", /./, 0);
            getCount(assert, "", /.+/, 0);
            getCount(assert, "a", /./, 1);
            getCount(assert, "a", /.+/, 1);
            getCount(assert, "aa", /./, 2);
            getCount(assert, "aa", /.+/, 1);
            getCount(assert, "aaa", /./, 3);
            getCount(assert, "aaa", /.+/, 1);
            getCount(assert, "aba", /./, 3);
            getCount(assert, "aba", /.+/, 1);
            getCount(assert, "aba", /(.)\1/, 0);
        });
    }());

    (function() {
        QUnit.module("getLineCount");

        var result;

        function getLineCount(assert, a, expected) {
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

            assert.strictEqual(result, expected, a + " string returned " + result);
        }

        QUnit.test("String", function(assert) {
            assert.expect(9);

            getLineCount(assert, "", 1);
            getLineCount(assert, "\n", 2);
            getLineCount(assert, "\n\n", 3);
            getLineCount(assert, "a", 1);
            getLineCount(assert, "a\n", 2);
            getLineCount(assert, "a\n\n", 3);
            getLineCount(assert, "a\na", 2);
            getLineCount(assert, "a\na\n", 3);
            getLineCount(assert, "a\na\na", 3);
        });
    }());

    (function() {
        QUnit.module("getLineStartAt");

        var result;

        function lineStartAt(assert, str, index, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str) + " at index " + index + " returned " + result);
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(20);

            lineStartAt(assert, "", 0, 0);
            lineStartAt(assert, "", 1, Error);
            lineStartAt(assert, "\n", 0, 0);
            lineStartAt(assert, "\n", 1, 1);
            lineStartAt(assert, "\n", 2, Error);
            lineStartAt(assert, "\n\n", 0, 0);
            lineStartAt(assert, "\n\n", 1, 1);
            lineStartAt(assert, "\n\n", 2, 2);
            lineStartAt(assert, "\n\n", 3, Error);
            lineStartAt(assert, "\n\n\n", 0, 0);
            lineStartAt(assert, "\n\n\n", 1, 1);
            lineStartAt(assert, "\n\n\n", 2, 2);
            lineStartAt(assert, "\n\n\n", 3, 3);
            lineStartAt(assert, "\n\n\n", 4, Error);
            lineStartAt(assert, "\n\n\n\n", 0, 0);
            lineStartAt(assert, "\n\n\n\n", 1, 1);
            lineStartAt(assert, "\n\n\n\n", 2, 2);
            lineStartAt(assert, "\n\n\n\n", 3, 3);
            lineStartAt(assert, "\n\n\n\n", 4, 4);
            lineStartAt(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(36);

            lineStartAt(assert, "a", 0, 0);
            lineStartAt(assert, "a", 1, Error);
            lineStartAt(assert, "a\n", 0, 0);
            lineStartAt(assert, "a\n", 1, 0);
            lineStartAt(assert, "a\n", 2, 2);
            lineStartAt(assert, "a\n", 3, Error);
            lineStartAt(assert, "aa\n", 0, 0);
            lineStartAt(assert, "aa\n", 1, 0);
            lineStartAt(assert, "aa\n", 2, 0);
            lineStartAt(assert, "aa\n", 3, 3);
            lineStartAt(assert, "aa\n", 4, Error);
            lineStartAt(assert, "a\na", 0, 0);
            lineStartAt(assert, "a\na", 1, 0);
            lineStartAt(assert, "a\na", 2, 2);
            lineStartAt(assert, "a\na", 3, Error);
            lineStartAt(assert, "a\nb\n", 0, 0);
            lineStartAt(assert, "a\nb\n", 1, 0);
            lineStartAt(assert, "a\nb\n", 2, 2);
            lineStartAt(assert, "a\nb\n", 3, 2);
            lineStartAt(assert, "a\nb\n", 4, 4);
            lineStartAt(assert, "a\nb\n", 5, Error);
            lineStartAt(assert, "a\nb\nc", 0, 0);
            lineStartAt(assert, "a\nb\nc", 1, 0);
            lineStartAt(assert, "a\nb\nc", 2, 2);
            lineStartAt(assert, "a\nb\nc", 3, 2);
            lineStartAt(assert, "a\nb\nc", 4, 4);
            lineStartAt(assert, "a\nb\nc", 5, Error);
            lineStartAt(assert, "aa\nbb\ncc", 0, 0);
            lineStartAt(assert, "aa\nbb\ncc", 1, 0);
            lineStartAt(assert, "aa\nbb\ncc", 2, 0);
            lineStartAt(assert, "aa\nbb\ncc", 3, 3);
            lineStartAt(assert, "aa\nbb\ncc", 4, 3);
            lineStartAt(assert, "aa\nbb\ncc", 5, 3);
            lineStartAt(assert, "aa\nbb\ncc", 6, 6);
            lineStartAt(assert, "aa\nbb\ncc", 7, 6);
            lineStartAt(assert, "aa\nbb\ncc", 8, Error);
        });
    }());

    (function() {
        QUnit.module("getLineEndAt");

        var result;

        function lineEndAt(assert, str, index, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str) + " at index " + index + " returned " + result);
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(20);

            lineEndAt(assert, "", 0, 0);
            lineEndAt(assert, "", 1, Error);
            lineEndAt(assert, "\n", 0, 0);
            lineEndAt(assert, "\n", 1, 1);
            lineEndAt(assert, "\n", 2, Error);
            lineEndAt(assert, "\n\n", 0, 0);
            lineEndAt(assert, "\n\n", 1, 1);
            lineEndAt(assert, "\n\n", 2, 2);
            lineEndAt(assert, "\n\n", 3, Error);
            lineEndAt(assert, "\n\n\n", 0, 0);
            lineEndAt(assert, "\n\n\n", 1, 1);
            lineEndAt(assert, "\n\n\n", 2, 2);
            lineEndAt(assert, "\n\n\n", 3, 3);
            lineEndAt(assert, "\n\n\n", 4, Error);
            lineEndAt(assert, "\n\n\n\n", 0, 0);
            lineEndAt(assert, "\n\n\n\n", 1, 1);
            lineEndAt(assert, "\n\n\n\n", 2, 2);
            lineEndAt(assert, "\n\n\n\n", 3, 3);
            lineEndAt(assert, "\n\n\n\n", 4, 4);
            lineEndAt(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(37);

            lineEndAt(assert, "a", 0, 0);
            lineEndAt(assert, "a", 1, Error);
            lineEndAt(assert, "a", 2, Error);
            lineEndAt(assert, "a\n", 0, 0);
            lineEndAt(assert, "a\n", 1, 0);
            lineEndAt(assert, "a\n", 2, 2);
            lineEndAt(assert, "a\n", 3, Error);
            lineEndAt(assert, "aa\n", 0, 1);
            lineEndAt(assert, "aa\n", 1, 1);
            lineEndAt(assert, "aa\n", 2, 1);
            lineEndAt(assert, "aa\n", 3, 3);
            lineEndAt(assert, "aa\n", 4, Error);
            lineEndAt(assert, "a\na", 0, 0);
            lineEndAt(assert, "a\na", 1, 0);
            lineEndAt(assert, "a\na", 2, 2);
            lineEndAt(assert, "a\na", 3, Error);
            lineEndAt(assert, "a\nb\n", 0, 0);
            lineEndAt(assert, "a\nb\n", 1, 0);
            lineEndAt(assert, "a\nb\n", 2, 2);
            lineEndAt(assert, "a\nb\n", 3, 2);
            lineEndAt(assert, "a\nb\n", 4, 4);
            lineEndAt(assert, "a\nb\n", 5, Error);
            lineEndAt(assert, "a\nb\nc", 0, 0);
            lineEndAt(assert, "a\nb\nc", 1, 0);
            lineEndAt(assert, "a\nb\nc", 2, 2);
            lineEndAt(assert, "a\nb\nc", 3, 2);
            lineEndAt(assert, "a\nb\nc", 4, 4);
            lineEndAt(assert, "a\nb\nc", 5, Error);
            lineEndAt(assert, "aa\nbb\ncc", 0, 1);
            lineEndAt(assert, "aa\nbb\ncc", 1, 1);
            lineEndAt(assert, "aa\nbb\ncc", 2, 1);
            lineEndAt(assert, "aa\nbb\ncc", 3, 4);
            lineEndAt(assert, "aa\nbb\ncc", 4, 4);
            lineEndAt(assert, "aa\nbb\ncc", 5, 4);
            lineEndAt(assert, "aa\nbb\ncc", 6, 7);
            lineEndAt(assert, "aa\nbb\ncc", 7, 7);
            lineEndAt(assert, "aa\nbb\ncc", 8, Error);
        });
    }());

    (function() {
        QUnit.module("getLineNumberAt");

        var result;

        function getLineNumberAt(assert, str, index, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str) + " at index " + index + " returned " + result);
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(14);

            getLineNumberAt(assert, "", 0, 0);
            getLineNumberAt(assert, "\n", 0, 0);
            getLineNumberAt(assert, "\n", 1, 1);
            getLineNumberAt(assert, "\n", 2, Error);
            getLineNumberAt(assert, "\n", 3, Error);
            getLineNumberAt(assert, "\n\n", 0, 0);
            getLineNumberAt(assert, "\n\n", 1, 1);
            getLineNumberAt(assert, "\n\n", 2, 2);
            getLineNumberAt(assert, "\n\n", 3, Error);
            getLineNumberAt(assert, "\n\n\n", 0, 0);
            getLineNumberAt(assert, "\n\n\n", 1, 1);
            getLineNumberAt(assert, "\n\n\n", 2, 2);
            getLineNumberAt(assert, "\n\n\n", 3, 3);
            getLineNumberAt(assert, "\n\n\n", 4, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(36);

            getLineNumberAt(assert, "a", 0, 0);
            getLineNumberAt(assert, "a", 1, Error);
            getLineNumberAt(assert, "a\n", 0, 0);
            getLineNumberAt(assert, "a\n", 1, 0);
            getLineNumberAt(assert, "a\n", 2, 1);
            getLineNumberAt(assert, "a\n", 3, Error);
            getLineNumberAt(assert, "aa\n", 0, 0);
            getLineNumberAt(assert, "aa\n", 1, 0);
            getLineNumberAt(assert, "aa\n", 2, 0);
            getLineNumberAt(assert, "aa\n", 3, 1);
            getLineNumberAt(assert, "aa\n", 4, Error);
            getLineNumberAt(assert, "a\na", 0, 0);
            getLineNumberAt(assert, "a\na", 1, 0);
            getLineNumberAt(assert, "a\na", 2, 1);
            getLineNumberAt(assert, "a\na", 3, Error);
            getLineNumberAt(assert, "a\nb\n", 0, 0);
            getLineNumberAt(assert, "a\nb\n", 1, 0);
            getLineNumberAt(assert, "a\nb\n", 2, 1);
            getLineNumberAt(assert, "a\nb\n", 3, 1);
            getLineNumberAt(assert, "a\nb\n", 4, 2);
            getLineNumberAt(assert, "a\nb\n", 5, Error);
            getLineNumberAt(assert, "a\nb\nc", 0, 0);
            getLineNumberAt(assert, "a\nb\nc", 1, 0);
            getLineNumberAt(assert, "a\nb\nc", 2, 1);
            getLineNumberAt(assert, "a\nb\nc", 3, 1);
            getLineNumberAt(assert, "a\nb\nc", 4, 2);
            getLineNumberAt(assert, "a\nb\nc", 5, Error);
            getLineNumberAt(assert, "aa\nbb\ncc", 0, 0);
            getLineNumberAt(assert, "aa\nbb\ncc", 1, 0);
            getLineNumberAt(assert, "aa\nbb\ncc", 2, 0);
            getLineNumberAt(assert, "aa\nbb\ncc", 3, 1);
            getLineNumberAt(assert, "aa\nbb\ncc", 4, 1);
            getLineNumberAt(assert, "aa\nbb\ncc", 5, 1);
            getLineNumberAt(assert, "aa\nbb\ncc", 6, 2);
            getLineNumberAt(assert, "aa\nbb\ncc", 7, 2);
            getLineNumberAt(assert, "aa\nbb\ncc", 8, Error);
        });
    }());

    (function() {
        QUnit.module("getLineStart");

        var result;

        function lineStart(assert, str, index, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str) + " at index " + index + " returned " + result);
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(20);

            lineStart(assert, "", 0, 0);
            lineStart(assert, "", 1, Error);
            lineStart(assert, "\n", 0, 0);
            lineStart(assert, "\n", 1, 1);
            lineStart(assert, "\n", 2, Error);
            lineStart(assert, "\n\n", 0, 0);
            lineStart(assert, "\n\n", 1, 1);
            lineStart(assert, "\n\n", 2, 2);
            lineStart(assert, "\n\n", 3, Error);
            lineStart(assert, "\n\n\n", 0, 0);
            lineStart(assert, "\n\n\n", 1, 1);
            lineStart(assert, "\n\n\n", 2, 2);
            lineStart(assert, "\n\n\n", 3, 3);
            lineStart(assert, "\n\n\n", 4, Error);
            lineStart(assert, "\n\n\n\n", 0, 0);
            lineStart(assert, "\n\n\n\n", 1, 1);
            lineStart(assert, "\n\n\n\n", 2, 2);
            lineStart(assert, "\n\n\n\n", 3, 3);
            lineStart(assert, "\n\n\n\n", 4, 4);
            lineStart(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(23);

            lineStart(assert, "a", 0, 0);
            lineStart(assert, "a", 1, Error);
            lineStart(assert, "a\n", 0, 0);
            lineStart(assert, "a\n", 1, 2);
            lineStart(assert, "a\n", 2, Error);
            lineStart(assert, "aa\n", 0, 0);
            lineStart(assert, "aa\n", 1, 3);
            lineStart(assert, "aa\n", 2, Error);
            lineStart(assert, "a\na", 0, 0);
            lineStart(assert, "a\na", 1, 2);
            lineStart(assert, "a\na", 2, Error);
            lineStart(assert, "a\nb\n", 0, 0);
            lineStart(assert, "a\nb\n", 1, 2);
            lineStart(assert, "a\nb\n", 2, 4);
            lineStart(assert, "a\nb\n", 3, Error);
            lineStart(assert, "a\nb\nc", 0, 0);
            lineStart(assert, "a\nb\nc", 1, 2);
            lineStart(assert, "a\nb\nc", 2, 4);
            lineStart(assert, "a\nb\nc", 4, Error);
            lineStart(assert, "aa\nbb\ncc", 0, 0);
            lineStart(assert, "aa\nbb\ncc", 1, 3);
            lineStart(assert, "aa\nbb\ncc", 2, 6);
            lineStart(assert, "aa\nbb\ncc", 3, Error);
        });
    }());

    (function() {
        QUnit.module("getLineEnd");

        var result;

        function lineEnd(assert, str, lineNumber, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str)
                            + " at line number " + lineNumber + " returned " + result);
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(20);

            lineEnd(assert, "", 0, 0);
            lineEnd(assert, "", 1, Error);
            lineEnd(assert, "\n", 0, 0);
            lineEnd(assert, "\n", 1, 1);
            lineEnd(assert, "\n", 2, Error);
            lineEnd(assert, "\n\n", 0, 0);
            lineEnd(assert, "\n\n", 1, 1);
            lineEnd(assert, "\n\n", 2, 2);
            lineEnd(assert, "\n\n", 3, Error);
            lineEnd(assert, "\n\n\n", 0, 0);
            lineEnd(assert, "\n\n\n", 1, 1);
            lineEnd(assert, "\n\n\n", 2, 2);
            lineEnd(assert, "\n\n\n", 3, 3);
            lineEnd(assert, "\n\n\n", 4, Error);
            lineEnd(assert, "\n\n\n\n", 0, 0);
            lineEnd(assert, "\n\n\n\n", 1, 1);
            lineEnd(assert, "\n\n\n\n", 2, 2);
            lineEnd(assert, "\n\n\n\n", 3, 3);
            lineEnd(assert, "\n\n\n\n", 4, 4);
            lineEnd(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(24);

            lineEnd(assert, "a", 0, 1);
            lineEnd(assert, "a", 1, Error);
            lineEnd(assert, "a", 2, Error);
            lineEnd(assert, "a\n", 0, 1);
            lineEnd(assert, "a\n", 1, 2);
            lineEnd(assert, "a\n", 2, Error);
            lineEnd(assert, "aa\n", 0, 2);
            lineEnd(assert, "aa\n", 1, 3);
            lineEnd(assert, "aa\n", 2, Error);
            lineEnd(assert, "a\na", 0, 1);
            lineEnd(assert, "a\na", 1, 3);
            lineEnd(assert, "a\na", 2, Error);
            lineEnd(assert, "a\nb\n", 0, 1);
            lineEnd(assert, "a\nb\n", 1, 3);
            lineEnd(assert, "a\nb\n", 2, 4);
            lineEnd(assert, "a\nb\n", 3, Error);
            lineEnd(assert, "a\nb\nc", 0, 1);
            lineEnd(assert, "a\nb\nc", 1, 3);
            lineEnd(assert, "a\nb\nc", 2, 5);
            lineEnd(assert, "a\nb\nc", 3, Error);
            lineEnd(assert, "aa\nbb\ncc", 0, 2);
            lineEnd(assert, "aa\nbb\ncc", 1, 5);
            lineEnd(assert, "aa\nbb\ncc", 2, 8);
            lineEnd(assert, "aa\nbb\ncc", 3, Error);
        });
    }());

    (function() {
        QUnit.module("getLineAt");

        var result;

        function lineAt(assert, str, index, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str)
                            + " at index " + index + " returned " + withReadableLinebreaks(result));
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(19);

            lineAt(assert, "", 0, "");
            lineAt(assert, "\n", 0, "");
            lineAt(assert, "\n", 1, "");
            lineAt(assert, "\n", 2, Error);
            lineAt(assert, "\n\n", 0, "");
            lineAt(assert, "\n\n", 1, "");
            lineAt(assert, "\n\n", 2, "");
            lineAt(assert, "\n\n", 3, Error);
            lineAt(assert, "\n\n\n", 0, "");
            lineAt(assert, "\n\n\n", 1, "");
            lineAt(assert, "\n\n\n", 2, "");
            lineAt(assert, "\n\n\n", 3, "");
            lineAt(assert, "\n\n\n", 4, Error);
            lineAt(assert, "\n\n\n\n", 0, "");
            lineAt(assert, "\n\n\n\n", 1, "");
            lineAt(assert, "\n\n\n\n", 2, "");
            lineAt(assert, "\n\n\n\n", 3, "");
            lineAt(assert, "\n\n\n\n", 4, "");
            lineAt(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(36);

            lineAt(assert, "a", 0, "a");
            lineAt(assert, "a", 1, Error);
            lineAt(assert, "a\n", 0, "a");
            lineAt(assert, "a\n", 1, "a");
            lineAt(assert, "a\n", 2, "");
            lineAt(assert, "a\n", 3, Error);
            lineAt(assert, "aa\n", 0, "aa");
            lineAt(assert, "aa\n", 1, "aa");
            lineAt(assert, "aa\n", 2, "aa");
            lineAt(assert, "aa\n", 3, "");
            lineAt(assert, "aa\n", 4, Error);
            lineAt(assert, "a\nb", 0, "a");
            lineAt(assert, "a\nb", 1, "a");
            lineAt(assert, "a\nb", 2, "b");
            lineAt(assert, "a\nb", 3, Error);
            lineAt(assert, "a\nb\n", 0, "a");
            lineAt(assert, "a\nb\n", 1, "a");
            lineAt(assert, "a\nb\n", 2, "b");
            lineAt(assert, "a\nb\n", 3, "b");
            lineAt(assert, "a\nb\n", 4, "");
            lineAt(assert, "a\nb\n", 5, Error);
            lineAt(assert, "a\nb\nc", 0, "a");
            lineAt(assert, "a\nb\nc", 1, "a");
            lineAt(assert, "a\nb\nc", 2, "b");
            lineAt(assert, "a\nb\nc", 3, "b");
            lineAt(assert, "a\nb\nc", 4, "c");
            lineAt(assert, "a\nb\nc", 5, Error);
            lineAt(assert, "aa\nbb\ncc", 0, "aa");
            lineAt(assert, "aa\nbb\ncc", 1, "aa");
            lineAt(assert, "aa\nbb\ncc", 2, "aa");
            lineAt(assert, "aa\nbb\ncc", 3, "bb");
            lineAt(assert, "aa\nbb\ncc", 4, "bb");
            lineAt(assert, "aa\nbb\ncc", 5, "bb");
            lineAt(assert, "aa\nbb\ncc", 6, "cc");
            lineAt(assert, "aa\nbb\ncc", 7, "cc");
            lineAt(assert, "aa\nbb\ncc", 8, Error);
        });
    }());

    (function() {
        QUnit.module("getLine");

        var result;

        function line(assert, str, lineNumber, expected) {
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

            assert.strictEqual(result, expected, withReadableLinebreaks(str)
                            + " at line " + lineNumber + " returned " + withReadableLinebreaks(result));
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(19);

            line(assert, "", 0, "");
            line(assert, "\n", 0, "");
            line(assert, "\n", 1, "");
            line(assert, "\n", 2, Error);
            line(assert, "\n\n", 0, "");
            line(assert, "\n\n", 1, "");
            line(assert, "\n\n", 2, "");
            line(assert, "\n\n", 3, Error);
            line(assert, "\n\n\n", 0, "");
            line(assert, "\n\n\n", 1, "");
            line(assert, "\n\n\n", 2, "");
            line(assert, "\n\n\n", 3, "");
            line(assert, "\n\n\n", 4, Error);
            line(assert, "\n\n\n\n", 0, "");
            line(assert, "\n\n\n\n", 1, "");
            line(assert, "\n\n\n\n", 2, "");
            line(assert, "\n\n\n\n", 3, "");
            line(assert, "\n\n\n\n", 4, "");
            line(assert, "\n\n\n\n", 5, Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(23);

            line(assert, "a", 0, "a");
            line(assert, "a", 1, Error);
            line(assert, "a\n", 0, "a");
            line(assert, "a\n", 1, "");
            line(assert, "a\n", 2, Error);
            line(assert, "aa\n", 0, "aa");
            line(assert, "aa\n", 1, "");
            line(assert, "aa\n", 2, Error);
            line(assert, "a\nb", 0, "a");
            line(assert, "a\nb", 1, "b");
            line(assert, "a\nb", 2, Error);
            line(assert, "a\nb\n", 0, "a");
            line(assert, "a\nb\n", 1, "b");
            line(assert, "a\nb\n", 2, "");
            line(assert, "a\nb\n", 3, Error);
            line(assert, "a\nb\nc", 0, "a");
            line(assert, "a\nb\nc", 1, "b");
            line(assert, "a\nb\nc", 2, "c");
            line(assert, "a\nb\nc", 3, Error);
            line(assert, "aa\nbb\ncc", 0, "aa");
            line(assert, "aa\nbb\ncc", 1, "bb");
            line(assert, "aa\nbb\ncc", 2, "cc");
            line(assert, "aa\nbb\ncc", 3, Error);
        });
    }());

    (function() {
        QUnit.module("replaceLine");

        var result;

        function replaceLine(assert, str, lineNumber, replaceWith, expected) {
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

            assert.strictEqual(withReadableLinebreaks(result), withReadableLinebreaks(expected), withReadableLinebreaks(str)
                            + " at lineNumber " + lineNumber + "/\"" + replaceWith
                            + "\" returned " + withReadableLinebreaks(result));
        }

        QUnit.test("Line breaks", function(assert) {
            assert.expect(35);

            replaceLine(assert, "", 0, "", "");
            replaceLine(assert, "\n", 0, "", "\n");
            replaceLine(assert, "\n", 1, "", "\n");
            replaceLine(assert, "\n", 1, "a", "\na");
            replaceLine(assert, "\n", 2, "", Error);
            replaceLine(assert, "\n", 2, "a", Error);
            replaceLine(assert, "\n\n", 0, "", "\n\n");
            replaceLine(assert, "\n\n", 1, "", "\n\n");
            replaceLine(assert, "\n\n", 2, "", "\n\n");
            replaceLine(assert, "\n\n", 2, "a", "\n\na");
            replaceLine(assert, "\n\n", 2, "aa", "\n\naa");
            replaceLine(assert, "\n\n", 3, "", Error);
            replaceLine(assert, "\n\n\n", 0, "", "\n\n\n");
            replaceLine(assert, "\n\n\n", 1, "", "\n\n\n");
            replaceLine(assert, "\n\n\n", 2, "", "\n\n\n");
            replaceLine(assert, "\n\n\n", 3, "", "\n\n\n");
            replaceLine(assert, "\n\n\n", 3, "a", "\n\n\na");
            replaceLine(assert, "\n\n\n", 3, "aa", "\n\n\naa");
            replaceLine(assert, "\n\n\n", 4, "", Error);
            replaceLine(assert, "\n\n\n\n", 0, "", "\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 0, "a", "a\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 0, "aa", "aa\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 1, "", "\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 1, "a", "\na\n\n\n");
            replaceLine(assert, "\n\n\n\n", 1, "aa", "\naa\n\n\n");
            replaceLine(assert, "\n\n\n\n", 2, "", "\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 2, "a", "\n\na\n\n");
            replaceLine(assert, "\n\n\n\n", 2, "aa", "\n\naa\n\n");
            replaceLine(assert, "\n\n\n\n", 3, "", "\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 3, "a", "\n\n\na\n");
            replaceLine(assert, "\n\n\n\n", 3, "aa", "\n\n\naa\n");
            replaceLine(assert, "\n\n\n\n", 4, "", "\n\n\n\n");
            replaceLine(assert, "\n\n\n\n", 4, "a", "\n\n\n\na");
            replaceLine(assert, "\n\n\n\n", 4, "aa", "\n\n\n\naa");
            replaceLine(assert, "\n\n\n\n", 5, "", Error);
        });

        QUnit.test("Line contents", function(assert) {
            assert.expect(54);

            replaceLine(assert, "a", 0, "", "");
            replaceLine(assert, "a", 0, "a", "a");
            replaceLine(assert, "a", 0, "b", "b");
            replaceLine(assert, "a", 0, "aa", "aa");
            replaceLine(assert, "a", 0, "bb", "bb");
            replaceLine(assert, "a", 1, "", Error);
            replaceLine(assert, "a", 1, "b", Error);
            replaceLine(assert, "a", 1, "bb", Error);
            replaceLine(assert, "a\n", 0, "", "\n");
            replaceLine(assert, "a\n", 0, "a", "a\n");
            replaceLine(assert, "a\n", 0, "b", "b\n");
            replaceLine(assert, "a\n", 0, "bb", "bb\n");
            replaceLine(assert, "a\n", 1, "", "a\n");
            replaceLine(assert, "a\n", 1, "a", "a\na");
            replaceLine(assert, "a\n", 1, "aa", "a\naa");
            replaceLine(assert, "a\n", 2, "", Error);
            replaceLine(assert, "a\n", 2, "a", Error);
            replaceLine(assert, "a\n", 2, "aa", Error);
            replaceLine(assert, "aa\n", 0, "aa", "aa\n");
            replaceLine(assert, "aa\n", 0, "b", "b\n");
            replaceLine(assert, "aa\n", 0, "bb", "bb\n");
            replaceLine(assert, "aa\n", 1, "aa", "aa\naa");
            replaceLine(assert, "aa\n", 1, "b", "aa\nb");
            replaceLine(assert, "aa\n", 2, "bb", Error);
            replaceLine(assert, "aa\n", 3, "", Error);
            replaceLine(assert, "aa\n", 3, "aa", Error);
            replaceLine(assert, "aa\n", 3, "b", Error);
            replaceLine(assert, "aa\n", 3, "bb", Error);
            replaceLine(assert, "a\nb", 0, "a", "a\nb");
            replaceLine(assert, "a\nb", 0, "c", "c\nb");
            replaceLine(assert, "a\nb", 0, "cc", "cc\nb");
            replaceLine(assert, "a\nb", 1, "c", "a\nc");
            replaceLine(assert, "a\nb", 1, "cc", "a\ncc");
            replaceLine(assert, "a\nb", 2, "", Error);
            replaceLine(assert, "a\nb", 2, "a", Error);
            replaceLine(assert, "a\nb", 2, "b", Error);
            replaceLine(assert, "a\nb", 2, "bb", Error);
            replaceLine(assert, "a\nb", 3, "", Error);
            replaceLine(assert, "a\nb", 3, "a", Error);
            replaceLine(assert, "a\nb", 3, "b", Error);
            replaceLine(assert, "a\nb", 3, "bb", Error);
            replaceLine(assert, "a\nb\n", 0, "c", "c\nb\n");
            replaceLine(assert, "a\nb\n", 1, "c", "a\nc\n");
            replaceLine(assert, "a\nb\n", 2, "c", "a\nb\nc");
            replaceLine(assert, "a\nb\n", 3, "c", Error);
            replaceLine(assert, "a\nb\nc", 0, "d", "d\nb\nc");
            replaceLine(assert, "a\nb\nc", 1, "d", "a\nd\nc");
            replaceLine(assert, "a\nb\nc", 2, "d", "a\nb\nd");
            replaceLine(assert, "a\nb\nc", 3, "d", Error);
            replaceLine(assert, "a\nb\nc", 4, "d", Error);
            replaceLine(assert, "aa\nbb\ncc", 0, "dd", "dd\nbb\ncc");
            replaceLine(assert, "aa\nbb\ncc", 1, "dd", "aa\ndd\ncc");
            replaceLine(assert, "aa\nbb\ncc", 2, "dd", "aa\nbb\ndd");
            replaceLine(assert, "aa\nbb\ncc", 3, "dd", Error);
        });
    }());
}());
