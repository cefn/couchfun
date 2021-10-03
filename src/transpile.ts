import path from "path";
import * as rollup from "rollup";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import rollupStream from "@rollup/stream";

export async function transpileSource(
  sourcePath: string,
  tsconfigPath: string
): Promise<void> {
  const workingDir = process.cwd();
  const sourceDirRelative = path.dirname(sourcePath);
  const sourceFileAbsolute = path.resolve(workingDir, sourcePath);
  const sourceDirAbsolute = path.resolve(workingDir, sourceDirRelative);
  const input: rollup.InputOptions = {
    input: sourceFileAbsolute,
    context: sourceDirAbsolute,
    plugins: [
      rollupPluginTypescript({
        tsconfig: tsconfigPath,
        target: "es5",
        sourceMap: false,
        strict: true,
        alwaysStrict: false,
        noImplicitUseStrict: true,
        downlevelIteration: false,
        allowSyntheticDefaultImports: false
      })
    ],
    treeshake: false
  };
  const output: rollup.OutputOptions = {
    file: sourceFileAbsolute.replace(/\.ts$/, ".js"),
    format: "es"
  };
  const bundle = await rollup.rollup(input);
  await bundle.write(output);
}

export function transpileSourceToStream(
  sourcePath: string,
  tsconfigPath: string
): Promise<string> {
  const workingDir = process.cwd();
  const sourceDirRelative = path.dirname(sourcePath);
  const sourceFileAbsolute = path.resolve(workingDir, sourcePath);
  const sourceDirAbsolute = path.resolve(workingDir, sourceDirRelative);
  const stream = rollupStream({
    input: sourceFileAbsolute,
    output: {
      format: "es"
    },
    context: sourceDirAbsolute,
    plugins: [
      rollupPluginTypescript({
        tsconfig: tsconfigPath,
        target: "es5",
        sourceMap: false,
        strict: true,
        alwaysStrict: false,
        noImplicitUseStrict: true,
        downlevelIteration: false,
        allowSyntheticDefaultImports: false,
        outputToFilesystem: false
      })
    ],
    treeshake: false
  });
  let bundle = "";

  stream.on("data", (data) => (bundle += data));
  return new Promise<string>((resolve) => {
    stream.on("end", () => resolve(bundle));
  });
}
