import { Method } from "../typings/project";

export function isString(params: any): params is string {
  return Object.prototype.toString.call(params) === "[object String]";
}

export function isFunc(params: any): params is Function {
  return Object.prototype.toString.call(params) === "[object Function]";
}

export function isMatch(path1: string, path2: string): boolean {
  const p1 = path1.split("/");
  const p2 = path2.split("/");
  if (p1.length !== p2.length) return false;
  return p1.every((s: string, i: number) => {
    const current = p2[i];
    if (current === Method.UNKNOWN) return true;
    return s === current;
  });
}