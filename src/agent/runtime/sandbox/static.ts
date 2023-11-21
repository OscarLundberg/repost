import { createContext, runInContext } from "vm";
import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { RequestConfig } from "../../../types";

function sandbox(code: string): RequestConfig {
  return JSON.parse(code);
}

export default sandbox;