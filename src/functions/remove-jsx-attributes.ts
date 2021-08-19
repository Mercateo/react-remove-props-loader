import { SourceFile, SyntaxKind } from "ts-morph";

export const removeJsxAttributes = (
  sourceFile: SourceFile,
  attributesToRemove: string[]
): SourceFile => {
  const jsxAttributes = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxAttribute
  );

  for (const attribute of jsxAttributes) {
    if (attributesToRemove.includes(attribute.getName())) {
      attribute.remove();
    }
  }

  return sourceFile;
};
