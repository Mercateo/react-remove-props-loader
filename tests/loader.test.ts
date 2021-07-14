import loader, { LoaderOptions, ScriptKind } from "../src";

describe("react-remove-props-loader", () => {
  const mockLoaderThis = (options: LoaderOptions): any => ({
    getOptions: () => options,
    resourcePath: "test/file.ts",
  });
  const code = `const TestComponent = () => (
    <div test-attribute="test-value" test-attribute-2={testVar} test-attribute-not-removed="test-value">Some JSX Element</div>
  );`;

  it("should remove specified attributes", () => {
    const options: LoaderOptions = {
      props: ["test-attribute", "test-attribute-2"],
    };
    const loaderThis: any = mockLoaderThis(options);

    const transpiledCode = loader.bind(loaderThis)(code);
    const expectedCode = code.replace(
      ` test-attribute="test-value" test-attribute-2={testVar}`,
      "",
    );
    expect(transpiledCode).toBe(expectedCode);
  });

  it("should return content as is when no props in options", () => {
    const options: LoaderOptions = {
      props: [],
      scriptKind: ScriptKind.JSX,
    };
    const loaderThis: any = mockLoaderThis(options);

    const transpiledCode = loader.bind(loaderThis)(code);
    expect(transpiledCode).toBe(code);
  });
});
