import { RequestConfig } from "../../types";
import { isset } from "../../helpers";
function none(req: RequestConfig) {
  return true;
}

function basic(req: RequestConfig, { auth, headers = {} }: RequestConfig) {
  return [
    () => isset(auth?.username) && auth?.username === req.auth?.username,
    () => isset(auth?.password) && auth?.password === req.auth?.password,
    ...Object.entries(headers).map(([k, v]) => (() => req.headers?.[k] === v))
  ].every(condition => condition() === true);
}


export default {
  basic,
  none
}