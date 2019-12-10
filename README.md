# What can it solve?

In Node.js, when we call require("xxx"), it will find the module and run the top level code of this module. This tool will defer this behaviour(defer calling require("xxx")) until the next time we access to it. 

```javascript
const defer_require = ("./defer_require.js")
const str = defer_require("./str.js") // top level code in str.js will not be executed. 

function(){
  // when we first time access to str.module, str.js is required(require("./str.js") is called)
  // and therefore the top level code in str.js is executed
  // and str.module refer to the exported object. 
  str.module.printNum() 
}
```

If we are stuck in circular requirement problem, this deferment might be helpful since we usually write our code in class or function, not top level. 

Considering we have a script name `num.js` and `str.js`:

In `num.js`, we require the `str.js` file and we exports variable `num1`, `num2`, and `printStr` function which is use to print the string variables in `str.js`:
```javascript
const defer_require = require("./defer_require.js")
const str = defer_require("./str.js")
var num1 = 1
var num2 = 2
function printStr(){
  console.log(str.module.str1)
  console.log(str.module.str2)
}
module.exports = { num1, num2, printStr }
```

In `str.js`, we require the `num.js` file and we exports variable `str1`, `str2`, and `printNum` function which is use to print the integer variables in `num.js`:
```javascript
const defer_require = require("./defer_require.js")
const num = defer_require("./num.js")
var str1 = "str1 in str.js"
var str2 = "str2 in str.js"
function printNum(){
  console.log(`num1 in num.js: ${num.module.num1}`)
  console.log(`num2 in num.js: ${num.module.num2}`)
}
module.exports = { str1, str2, printNum }
```

If we use require(), either printNum or printStr will not work. 

# What can't it solve?

When you use defer_require in the top level code, and access it, this will be just similar to the require(), except now you can require all the module at the top of the file.

# Usage

```
const defer_require = require("./defer_require.js")
const num = defer_require("./num.js")
num.module.print()
```

After use defer_require to require the module, use A.module to access to it.

Using `A.module` is not elegant, if you know how to rewrite this feature and directly use `A`, please pull a request or post a issue. I will be very grateful. Thanks.
