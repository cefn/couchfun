import fs from "fs";

import { transpileSource } from "../src/transpile";

function deleteFile(filePath: string, ignoreFileMissing = true) {
  try {
    fs.rmSync(filePath);
    return true;
  } catch (error) {
    if ((error as { code?: string }).code === "ENOENT" && ignoreFileMissing) {
      return false;
    }
    throw error;
  }
}

test("transpileSource() generates JS source from TS source", async () => {
  const projectPath = "./test/examples/words/views";
  const sourcePath = `${projectPath}/prefix/map.ts`;
  const tsconfigPath = `${projectPath}/tsconfig.json`;
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

      function eachPrefix(word, fn) {
          var spelling = word.id;
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
  } finally {
    deleteFile(transpiledPath);
  }
});
