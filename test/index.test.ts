import { transpileViewFunction } from "../src";

test("transpileSource() generates JS source from TS map function", async () => {
  const sourcePath = "./test/examples/words/views/prefix/map.ts";
  const transpiledSource = await transpileViewFunction(sourcePath);
  expect(transpiledSource).toMatchInlineSnapshot(`
    "function docIsWord(doc) {
        return doc.type === \\"word\\";
    }

    function eachPrefix(word, fn) {
        var spelling = word._id;
        var length = spelling.length;
        if (length > 0) {
            for (var last = 1; last <= length; last++) {
                fn(spelling.substr(0, last));
            }
        }
    }

    function emitPrefixes(doc) {
        if (docIsWord(doc)) {
            eachPrefix(doc, emit);
        }
    }
    emitPrefixes;
    "
  `);
});

test("transpileSource() generates reference to built-in reduce function", async () => {
  const sourcePath = "./test/examples/words/views/prefix/reduce.ts";
  const transpiledSource = await transpileViewFunction(sourcePath);
  expect(transpiledSource).toMatchInlineSnapshot(`
    "_sum;
    "
  `);
});
