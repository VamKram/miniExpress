import { Method, NextHandler, Request, Response } from "../typings/project";
import Layer from "./Layer";

export default class Route {
  stack: Layer[] = [];

  dispatch = (req: Request, res: Response, outNext: Function) => {
    let index = 0;
    const next = () => {
      if (index >= this.stack.length) return outNext();
      let layer = this.stack[index++];
      if (layer.method === req.method.toUpperCase()) {
        layer.handleRequest(req, res, next);
      } else {
        next();
      }
    };
    next();
  };

  get(handler: NextHandler) {
    let layer = new Layer("/", handler);
    layer.method = Method.GET;
    this.stack.push(layer);
  }

  post(handler: NextHandler) {
    let layer = new Layer("/", handler);
    layer.method = Method.POST;
    this.stack.push(layer);
  }
}