import type { LoaderDefinitionFunction } from "webpack";
import { ScriptKind, SyntaxKind } from "ts-morph";
import { project } from "./project";

export interface LoaderOptions {
  /** An array of props to remove from React components. */
  props: string[];
  /** The kind of script to remove the React props from. For example, `ScriptKind.TSX`. */
  scriptKind?: ScriptKind;
}

const loader: LoaderDefinitionFunction<LoaderOptions> = function (
  this,
  content,
) {
  const options = this.getOptions();
  const propsToRemove = options.props;
  if (propsToRemove.length === 0) return content;
  const scriptKind = options.scriptKind ?? ScriptKind.JSX;
  const sourceFile = project.createSourceFile(this.resourcePath, content, {
    scriptKind,
    overwrite: true,
  });

  const jsxAttributes = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxAttribute,
  );
  for (const attribute of jsxAttributes) {
    if (propsToRemove.includes(attribute.getName())) {
      attribute.remove();
    }
  }
  sourceFile.saveSync();

  const fs = project.getFileSystem();
  content = fs.readFileSync(this.resourcePath);
  fs.deleteSync(this.resourcePath);

  return content;
};

export default loader;
