import { Response } from "../typings/project";
import { ServerResponse } from "http";

export function responseFormatter(res: ServerResponse) {

  const newRes = res as Response;

  function end(content: string) {
    newRes.setHeader("Content-Length", content.length);
    newRes.status();
    newRes.end(content);
    return newRes;
  }

  const enhance = {
    status(code?: number) {
      newRes.statusCode = code || newRes.statusCode;
      return newRes;
    },
    send: (content: string) => {
      newRes.setHeader("Content-Type", "text/html");
      return end(content);
    },
    json: (content: Object) => {
      try {
        content = JSON.stringify(content);
      } catch (err) {
        throw err;
      }
      newRes.setHeader("Content-Type", "application/json");
      return end(content as string);
    },
    redirect: (url: string) => {
      newRes.setHeader("Location", url);
      newRes.status(301);
      newRes.end();
      return newRes;
    }
  }

  for (let enhanceKey in enhance) {
    let k = enhanceKey as keyof typeof enhance;
    (newRes as any)[k] = enhance[k];
  }

  return newRes;
}

