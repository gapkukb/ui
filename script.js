const fs = require("fs");
const path = require("path");
const readline = require("readline");

const base = path.join(process.cwd(), "src");

(function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(`请输入组件名称:`, (name) => {
    rl.close();
    let url = path.join(base, name);
    if (fs.existsSync(url)) {
      console.log(`组件名称已经存在，请重新输入`);
      return run();
    }
    create(url);
  });
})();

const compStr = (name) => {
  var prop = ` I${name}Props`;
  return `
import { Component,ReactNode, CSSProperties } from "react";
import {IBaseProps, Namespace } from "../helper";

const ns = new Namespace("${name.toLowerCase()}")

export type ${prop} = Partial<{
  slot:ReactNode,
  style:CSSProperties,
  className:string
}> & IBaseProps

export class ${name} extends Component<${prop}> {
  static defaultProps:${prop} = {
    style:{},
    className:''
  }
  constructor(props:${prop}) {
    super(props);
    this.method = this.method.bind(this)
  }
  method(){

  }
  componentDidMount(){

  }
  componentWillUnmount(){

  }
  render(){
    const {
      className,
      style
    } = this.props
    const classes = ns.cx(ns.m("name"),{},className)
    return (
      <div className={classes} style={style}>
        {}
      </div>
    )
  }
}

export default ${name};
`.trim();
};

const exp = (url) =>
  `
export * from "./${url}";
export { default } from "./${url}";
`.trim();

function create(url) {
  var filepath = path.basename(url);
  url = url
    .split(/(?=[A-Z]+)/)
    .join("-")
    .toLowerCase();
  var cnt = JSON.parse(fs.readFileSync("./src/config.json", "utf-8"));
  cnt.components[filepath] = filepath;
  var cnt = fs.writeFileSync("./src/config.json", JSON.stringify(cnt, null, 2));
  filepath = filepath[0].toUpperCase() + filepath.substring(1);
  fs.mkdirSync(url);
  fs.writeFileSync(path.join(url, "index.tsx"), compStr(filepath));
  fs.writeFileSync(path.join(url, "index.styl"), "");
  // fs.writeFileSync(path.join(url, "index.ts"), exp(filepath));
  fs.writeFileSync(path.join(url, "README.md"), "");
}
