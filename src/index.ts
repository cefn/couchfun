import path from "path";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import rollupStream from "@rollup/stream";
import { existsSync, writeFileSync, rmSync } from "fs";

const TS_CONFIG_OPTIONS = {
  target: "es5",
  strict: true,
  alwaysStrict: false,
  noImplicitUseStrict: true,
  sourceMap: false,
  downlevelIteration: false,
  allowSyntheticDefaultImports: false
} as const;

/**
 * Transpiles a view function in Typescript to a single string of ES5 Javascript.
 *
 * Expects a tsconfig.json file at the provided path.
 * Omit the tsconfigPath to expect a tsconfig.json in the source folder.
 * If no tsconfig.json is present there, an empty config will be created temporarily.
 *
 * Typescript requires a tsconfig.json file in the source folder or one of its ancestor folders.
 * All files in the scope of the tsconfig.json, (and any files they reference), will be transpiled.
 *
 * @param sourcePath path to Couchdb view function in typescript
 * @param tsconfigPath ancestral path to find or create tsconfig.json
 * @returns the transpiled ES5 source
 */
export async function transpileViewFunction(
  sourcePath: string,
  tsconfigPath?: string
): Promise<string> {
  const workingDir = process.cwd();
  const sourceDirRelative = path.dirname(sourcePath);
  const sourceFileAbsolute = path.resolve(workingDir, sourcePath);
  const sourceDirAbsolute = path.resolve(workingDir, sourceDirRelative);

  // force creation of tsconfig.json if not present
  const finalTsconfigPath =
    tsconfigPath ?? path.resolve(sourceDirAbsolute, "tsconfig.json");
  const makeTsconfig = !existsSync(finalTsconfigPath);
  if (makeTsconfig) {
    writeFileSync(finalTsconfigPath, "{}");
  }

  try {
    const stream = rollupStream({
      input: sourceFileAbsolute,
      output: {
        format: "es"
      },
      context: sourceDirAbsolute,
      treeshake: false,
      plugins: [
        rollupPluginTypescript({
          tsconfig: finalTsconfigPath,
          ...TS_CONFIG_OPTIONS
        })
      ]
    });

    let bundle = "";
    stream.on("data", (data) => (bundle += data));
    return await new Promise<string>((resolve) => {
      stream.on("end", () => resolve(bundle));
    });
  } finally {
    if (makeTsconfig) {
      rmSync(finalTsconfigPath);
    }
  }
}
