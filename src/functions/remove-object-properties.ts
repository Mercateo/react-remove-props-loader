import { SourceFile, SyntaxKind } from "ts-morph";

export const removeObjectProperties = (
  sourceFile: SourceFile,
  objectPropsToRemove: string[]
): SourceFile => {
  const objectProps = sourceFile.getDescendantsOfKind(
    SyntaxKind.PropertyAssignment
  );

  for (const property of objectProps) {
    const propertyName = property.getName().replace(/['"]+/g, "");
    if (objectPropsToRemove.includes(propertyName)) {
      property.remove();
    }
  }

  return sourceFile;
};
