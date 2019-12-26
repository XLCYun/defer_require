const path = require("path")

/**
 * get the directory where the caller in.
 */
function getCallerDirectory() {
  var originalFunc = Error.prepareStackTrace

  var callerfile
  try {
    var err = new Error()
    var currentfile

    Error.prepareStackTrace = function(err, stack) {
      return stack
    }

    currentfile = err.stack.shift().getFileName()
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()
      if (currentfile !== callerfile) break
    }
  } catch (e) {
    throw new Error("Cannot get the directory where the caller is.")
  } finally {
    Error.prepareStackTrace = originalFunc
  }

  return path.dirname(callerfile)
}

class tmpClass {
  constructor(path, callDir) {
    if (typeof path !== "string") throw new TypeError("Invalid module path.")
    if (typeof callDir !== "string") throw new TypeError("Invalid caller directory")
    this.path = path.trim()
    this.callDir = callDir.trim()
    this.accessed = false
  }

  get module() {
    delete this.module

    let relativePath = this.path.length > 0 && this.path[0] === "."
    let targetModule = relativePath ? require(path.resolve(this.callDir, this.path)) : require(this.path)

    Object.defineProperty(this, "module", {
      value: targetModule
    })
    return targetModule
  }
}

function DRequire(path) {
  let callDir = getCallerDirectory()
  let tmp = new tmpClass(path, callDir)
  return tmp
}

module.exports = DRequire
