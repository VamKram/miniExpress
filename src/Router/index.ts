import { NextHandler, Request, Response } from "../typings/project";
import Layer from "./Layer";
import Route from "./Route";
import { isMatch } from "../utils/checker";

export default class Router {
  public stack: Layer[] = [];
  middleware: { path: string, handler: NextHandler }[] = [];


  handle(req: Request, res: Response, handler: NextHandler) {
    let index = 0;
    let { pathname } = req;
    let next = () => {
      while (this.middleware.length) {
        const { path, handler }
        = this.middleware.shift() as { path: string, handler: NextHandler };
        if (isMatch(path, pathname)) {
          handler(req, res, next);
        }
      }
      if (index >= this.stack.length) return handler(req, res, () => {
      });
      let layer = this.stack[index++];
      if (layer.match(pathname)) {
        layer.handleRequest(req, res, next);
      } else {
        next();
      }
    };
    next();
  }

  route(path: string) {
    // 创建处理函数
    const route = new Route();
    // 匹配path 分配处理函数
    const layer = new Layer(path, route.dispatch);
    layer.route = route;
    this.stack.push(layer);
    return route;
  }

  get(path: string, handler: NextHandler = () => {
  }): void {
    const currentRoute = this.route(path);
    currentRoute.get(handler);
  }

  post(path: string, handler: NextHandler = () => {
  }): void {
    const currentRoute = this.route(path);
    currentRoute.post(handler);
  }

  use(path: string, handler: NextHandler = () => {
  }): void {
    this.middleware.push({path, handler});
  }
}