import type { LoaderDefinitionFunction } from "webpack";
import {
  JsxAttribute,
  PropertyAssignment,
  ScriptKind,
  SyntaxKind,
} from "ts-morph";
import { project } from "./project";

export interface LoaderOptions {
  /** An array of props to remove from React components. */
  props: string[];
  /** The kind of script to remove the React props from. For example, `ScriptKind.TSX`. */
  scriptKind?: ScriptKind;
  /** Whether to remove specified props from objects. */
  removeFromObjects?: boolean;
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

  let descendants: (JsxAttribute | PropertyAssignment)[] =
    sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);

  if (options.removeFromObjects) {
    const objectProps = sourceFile.getDescendantsOfKind(
      SyntaxKind.PropertyAssignment
    );
    descendants = descendants.concat(objectProps);
  }

  for (const descendant of descendants) {
    const descendantName = descendant
      .getNameNode()
      .getText()
      .replace(/['"]+/g, "");

    if (propsToRemove.includes(descendantName)) {
      descendant.remove();
    }
  }

  sourceFile.saveSync();

  const fs = project.getFileSystem();
  content = fs.readFileSync(this.resourcePath);
  fs.deleteSync(this.resourcePath);

  return content;
};

export default loader;
