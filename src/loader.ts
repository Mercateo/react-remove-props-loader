import { LoaderDefinitionFunction } from "webpack";
import { ScriptKind, SyntaxKind, ts } from "ts-morph";
import { project } from "./project";

export interface LoaderOptions {
  /** An array of props to remove from React components. */
  props: string[];
  /** The kind of script to remove the React props from. For example, `ScriptKind.TSX`. */
  scriptKind?: ScriptKind;
}

const loader: LoaderDefinitionFunction<LoaderOptions> = function (
  this,
  contents
) {
  const options = this.getOptions();
  const propsToRemove = options.props || [];
  const scriptKind = options.scriptKind ?? ScriptKind.JSX;
  const sourceFile = project.createSourceFile(this.resourcePath, contents, {
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
  contents = fs.readFileSync(this.resourcePath);
  fs.deleteSync(this.resourcePath);

  return contents;
};

export default loader;
