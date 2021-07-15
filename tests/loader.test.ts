import { LoaderContext } from "webpack";
import loader, { LoaderOptions, ScriptKind } from "../src";

describe("react-remove-props-loader", () => {
  const mockLoaderThis = (options: LoaderOptions) =>
    ({
      getOptions: () => options,
      resourcePath: "test/file",
    } as LoaderContext<LoaderOptions>);

  it("should remove specified attributes", () => {
    const code = `const TestComponent = () => (
      <div test-attribute="test-value" test-attribute-2={testVar} test-attribute-not-removed="test-value">Some JSX Element</div>
    );`;
    const options: LoaderOptions = {
      props: ["test-attribute", "test-attribute-2"],
    };
    const loaderThis = mockLoaderThis(options);

    const transpiledCode = loader.bind(loaderThis)(code);
    const expectedCode = code.replace(
      ` test-attribute="test-value" test-attribute-2={testVar}`,
      "",
    );
    expect(transpiledCode).toBe(expectedCode);
  });

  it("should return content as is when no props in options", () => {
    const code = `const TestComponent = () => (
      <div test-attribute="test-value">Some JSX Element</div>
    );`;
    const options: LoaderOptions = {
      props: [],
    };
    const loaderThis = mockLoaderThis(options);

    const transpiledCode = loader.bind(loaderThis)(code);
    expect(transpiledCode).toBe(code);
  });

  it("should transpile code based on the specified script kind", () => {
    const code = `const TestComponent: FC = () => (
      <div test-attribute="test-value">Some JSX Element</div>
    );`;
    const options: LoaderOptions = {
      props: ["test-attribute"],
      scriptKind: ScriptKind.TSX,
    };
    const loaderThis = mockLoaderThis(options);

    const transpiledCode = loader.bind(loaderThis)(code);
    const expectedCode = code.replace(` test-attribute="test-value"`, "");
    expect(transpiledCode).toBe(expectedCode);
  });
});
