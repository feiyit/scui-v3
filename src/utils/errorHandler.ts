/**
 * 全局代码错误捕捉
 * 比如 null.length 就会被捕捉到
 */
export function handleGlobalError(err: Error, vm: any, info: string) {
  console.log(`Error: ${err.toString()}\nInfo: ${info}`)
  const errorMap = {
    InternalError: "Javascript引擎内部错误",
    ReferenceError: "未找到对象",
    TypeError: "使用了错误的类型或对象",
    RangeError: "使用内置对象时，参数超范围",
    SyntaxError: "语法错误",
    EvalError: "错误的使用了Eval",
    URIError: "URI错误"
  }
  const errorName = errorMap[err.name] || "未知错误"

  console.warn(`[FytSoa error]: ${err}`)
  console.error(err)
  //throw error;

  vm.$nextTick(() => {
    vm.$notify.error({
      title: errorName,
      message: err
    })
  })
}
