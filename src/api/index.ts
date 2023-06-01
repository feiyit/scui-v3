const importModules = import.meta.glob("./model/**/*.ts", { eager: true })
const keys = Object.keys(importModules)
const modules = {}
for (const path of keys) {
  let k = path.replace(/(\.\/|\.ts)/g, "")
  if (k.indexOf("/") > -1) {
    k = k.split("/").pop()
  }
  modules[k] = importModules[path].default
}
export default modules
