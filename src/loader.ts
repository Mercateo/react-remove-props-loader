import type { LoaderDefinitionFunction } from "webpack";
import { ScriptKind } from "ts-morph";
import { project } from "./project";
import { removeJsxAttributes } from "./functions/remove-jsx-attributes";
import { removeObjectProperties } from "./functions/remove-object-properties";

export interface LoaderOptions {
  /** An array of props to remove from React components. */
  props: string[];
  /** The kind of script to remove the React props from. For example, `ScriptKind.TSX`. */
  scriptKind?: ScriptKind;
}

const loader: LoaderDefinitionFunction<LoaderOptions> = function (
  this,
  content
) {
  const options = this.getOptions();
  const propsToRemove = options.props;
  if (propsToRemove.length === 0) return content;
  const scriptKind = options.scriptKind ?? ScriptKind.JSX;
  const sourceFile = project.createSourceFile(this.resourcePath, content, {
    scriptKind,
    overwrite: true,
  });

  removeJsxAttributes(sourceFile, propsToRemove);
  removeObjectProperties(sourceFile, propsToRemove);
  sourceFile.saveSync();

  const fs = project.getFileSystem();
  content = fs.readFileSync(this.resourcePath);
  fs.deleteSync(this.resourcePath);

  return content;
};

export default loader;
