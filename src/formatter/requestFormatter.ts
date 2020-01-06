import { IncomingMessage } from "http";
import { Request } from "../typings/project";

const url = require("url");

export function requestFormatter(req: IncomingMessage) {
  const parsedUrl = url.parse(
    `${req.headers.host}${req.url}`,
    true
  );
  const keys = Object.keys(parsedUrl);
  const newReq = { ...req } as unknown as Request;
  keys.forEach(key => ((newReq as any)[key] = parsedUrl[key]));
  return newReq;
}

