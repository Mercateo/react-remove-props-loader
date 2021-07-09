import { LoaderContext } from "webpack";

export type LoaderOptions = {
  props: string[];
};

function loader(this: LoaderContext<LoaderOptions>, contents: string) {
  const options = this.getOptions();
	const props = options.props || []

	props.forEach(prop => {
		contents = contents.replace(new RegExp(`${prop}=("|{).*?("|})(?=\\s|>)`, "g"), "")
	})

	return contents
}

export default loader;
