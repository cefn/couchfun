import fs from "fs";

import { transpileSource } from "../src/transpile";

function deleteFile(filePath: string) {
  try {
    fs.rmSync(filePath);
    return true;
  } catch (error) {
    //throw, except for missing file
    if (error.code !== "ENOENT") {
      throw error;
    }
    return false;
  }
}

test("transpileSource() generates JS source from TS source", async () => {
  const sourcePath = "./test/lib/loader/examplesource/index/map/prefix.ts";
  const tsconfigPath = "./test/lib/loader/examplesource/index/tsconfig.json";
  const transpiledPath = sourcePath.replace(/\.ts$/, ".js");
  try {
    deleteFile(transpiledPath);
    await transpileSource(sourcePath, tsconfigPath);
    expect(
      fs.existsSync(transpiledPath),
      `${transpiledPath} not generated as expected`
    ).toBe(true);
    const transpiledSource = fs.readFileSync(transpiledPath, "utf-8");
    expect(transpiledSource).toMatchInlineSnapshot(`
      "function docIsWord(doc) {
          return doc.type === \\"word\\";
      }

      // Make this a callback - avoid array allocation
      function eachPrefix(spelling, fn) {
          var length = spelling.length;
          if (length > 0) {
              for (var last = 1; last <= length; last++) {
                  fn(spelling.substr(0, last));
              }
          }
      }

      function emitPrefixes(doc) {
          if (docIsWord(doc)) {
              eachPrefix(doc.id, emit);
          }
      }
      emitPrefixes;
      "
    `);
  } finally {
    deleteFile(transpiledPath);
  }
});
