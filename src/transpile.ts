import path from "path";
import * as rollup from "rollup";
import rollupPluginTypescript from "@rollup/plugin-typescript";

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
