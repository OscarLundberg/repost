import { createContext, runInContext } from "vm";
import axios from "axios";
import lodash from "lodash";
import { RequestConfig } from "../../../types";

function sandbox(code: string, event: RequestConfig): RequestConfig {
  const libraries = {
    axios,
    lodash
  }
  const contextObject = {
    $$RESULT: <RequestConfig>{},
    event,
    require(str: string) {
      const lib = libraries?.[str];
      if (!lib) {
        throw `Cannot find module ${str}`;
      }
      return lib;
    },
    repost(config: RequestConfig) {
      this.$$RESULT = config;
    }
  }

  let ctx = createContext(contextObject);
  try {
    runInContext(code, ctx)
  } catch (err) {
    console.log(err);
  };
  return ctx.$$RESULT;
}

export default sandbox;