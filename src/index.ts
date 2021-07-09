import { LoaderContext } from "webpack";

export type LoaderOptions = {
  props: string[];
};

function loader(this: LoaderContext<LoaderOptions>, contents: string) {
  const options = this.getOptions();
  
}

export default loader;
