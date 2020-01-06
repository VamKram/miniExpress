import { AppBase, NextHandler, Request, Response } from "./typings/project";
import * as http from "http";
import { Server } from "net";
import { requestFormatter } from "./formatter/requestFormatter";
import { responseFormatter } from "./formatter/responseFormatter";
import Router from "./Router";
import { isFunc } from "./utils/checker";

abstract class App implements AppBase {
  router: Router = new Router();

  constructor(private protocol: any) {
    this.protocol = protocol;
  }

  abstract get(path: string, handler: NextHandler): void;
  abstract get(handler: NextHandler): void;

  abstract post(path: string, handler: NextHandler): void;
  abstract post(handler: NextHandler): void;

  abstract use(handler: NextHandler): void;
  abstract use(path: string, handler: NextHandler): void;

  listen(...params: Parameters<Server["listen"]>) {
    const server = (this.protocol as typeof http).createServer((streamReq, streamRes) => {
      const req: Request = requestFormatter(streamReq);
      const res = responseFormatter(streamRes);
      this.router.handle(req, res, (req: Request, res: Response) => {
        res.end(`Cannot find ${req.url}`);
      });
    });
    server.listen(...params);
  }
}

export default class Application extends App {
  get(path: string, handler: NextHandler): void;
  get(handler: NextHandler): void;
  get(path: string | NextHandler, handler: NextHandler = () => {
  }): void {
    if (isFunc(path)) {
      handler = path;
      path = "*";
    }
    this.router.get(path, handler);
  }

  post(path: string, handler: NextHandler): void;
  post(handler: NextHandler): void;
  post(path: string | NextHandler, handler: NextHandler = () => {
  }): void {
    if (isFunc(path)) {
      handler = path;
      path = "*";
    }
    this.router.post(path, handler);
  }

  use(handler: NextHandler): void;
  use(path: string, handler: NextHandler): void;
  use(path: NextHandler | string, handler: NextHandler = () => {
  }): void {
    if (isFunc(path)) {
      handler = path;
      path = "*";
    }
    this.router.use(path, handler);
  }
}

const app = new Application(http);
app.get("/", (req: Request, res: Response, next: any) => {
  console.log("I'm in 111", 111);
  next();
});

app.get("/", (req: Request, res: Response, next) => {
  console.log("I'm in 202", 2);
  res.end("Hello World");
});

app.listen(3121, () => {
  console.log(3121);
});
