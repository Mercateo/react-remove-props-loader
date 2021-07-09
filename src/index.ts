import { LoaderDefinitionFunction } from "webpack";
import { SyntaxKind, ts } from "ts-morph";
import { project } from "./project";
import { tempFileName } from "./constants";

/**
 * Options supported by the loader.
 */
export interface LoaderOptions {
  /** An array of props to remove from React components. */
  props: string[];
  /** The kind of script to remove the React props from. For example, `ts.ScriptKind.TSX`. */
  scriptKind?: ts.ScriptKind;
}

/**
 * Webpack loader for removing specified attributes/props from React components.
 * @param this Context of the loader which can be used to get the options.
 * @param contents Contents of the file to be transformed.
 * @returns Transformed contents of the file
 */
const loader: LoaderDefinitionFunction<LoaderOptions> = function (
  this,
  contents
) {
  const options = this.getOptions();
  const propsToRemove = options.props || [];
  const scriptKind = options.scriptKind ?? ts.ScriptKind.JSX;
  const sourceFile = project.createSourceFile(tempFileName, contents, {
    scriptKind,
    overwrite: true,
  });

  const jsxAttributes = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxAttribute
  );
  for (const attribute of jsxAttributes) {
    if (propsToRemove.includes(attribute.getName())) {
      attribute.remove();
    }
  }
  sourceFile.saveSync();

  const fs = project.getFileSystem();
  contents = fs.readFileSync(tempFileName);
  fs.deleteSync(tempFileName);

  return contents;
};

export default loader;
