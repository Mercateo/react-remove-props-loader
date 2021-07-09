import { LoaderContext } from "webpack";
import { SyntaxKind, ts } from "ts-morph";
import { project } from "./project";
import { tempFileName } from "./constants";

export interface LoaderOptions {
  props: string[];
  scriptKind?: ts.ScriptKind;
}

function loader(this: LoaderContext<LoaderOptions>, contents: string): string {
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
}

export default loader;
