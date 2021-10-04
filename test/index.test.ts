import { transpileViewFunction } from "../src";

test("transpileSource() generates JS source from TS map function", async () => {
  const sourcePath = "./test/examples/words/views/prefix/map.ts";
  const transpiledSource = await transpileViewFunction(sourcePath);
  expect(transpiledSource).toMatchInlineSnapshot(`
    "function docIsWord(doc) {
        return doc.type === \\"word\\";
    }

    /** Callback fn once with every prefix of text. */
    function eachPrefix(text, fn) {
        var length = text.length;
        if (length > 0) {
            for (var last = 1; last <= length; last++) {
                fn(text.substr(0, last));
            }
        }
    }

    function emitPrefixes(doc) {
        if (docIsWord(doc)) {
            eachPrefix(doc._id, emit);
        }
    }
    emitPrefixes;
    "
  `);
});

test("transpileSource() generates reference to built-in reduce function", async () => {
  const sourcePath = "./test/examples/nobel/views/cloud/reduce.ts";
  const transpiledSource = await transpileViewFunction(sourcePath);
  expect(transpiledSource).toMatchInlineSnapshot(`
    "_count;
    "
  `);
});
