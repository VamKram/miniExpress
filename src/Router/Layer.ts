import { Method, Request, Response } from "../typings/project";
import Route from "./Route";
import { isMatch } from "../utils/checker";

export default class Layer {
  route: Route = new Route;
  method: Method = Method.UNKNOWN;

  constructor(public path: string, public handler: Function) {
    this.path = path;
    this.handler = handler;
  }

  match(path: string) {
    return isMatch(this.path, path);
  }

  handleRequest(req: Request, res: Response, next: () => void) {
    this.handler(req, res, next);
  }
}