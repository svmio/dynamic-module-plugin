import path = require('path')

const matchRelativePath = /^\.\.?[/\\]/;

export function isAbsolutePath(str: string) {
  return path.posix.isAbsolute(str) || path.win32.isAbsolute(str);
}

export function isRelativePath(str: string) {
  return matchRelativePath.test(str);
}
