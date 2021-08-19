import { SourceFile, SyntaxKind } from "ts-morph";

export const removeObjectProperties = (
  sourceFile: SourceFile,
  objectPropsToRemove: string[]
): SourceFile => {
  const objectProps = sourceFile.getDescendantsOfKind(
    SyntaxKind.PropertyAssignment
  );

  for (const property of objectProps) {
    if (objectPropsToRemove.includes(property.getName())) {
      property.remove();
    }
  }

  return sourceFile;
};
