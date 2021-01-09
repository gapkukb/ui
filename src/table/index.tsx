import { Component,ReactNode, CSSProperties } from "react";
import {IBaseProps, Namespace } from "../helper";

const ns = new Namespace("table")

export type  ITableProps = Partial<{
  slot:ReactNode,
  style:CSSProperties,
  className:string
}> & IBaseProps

export class Table extends Component< ITableProps> {
  static defaultProps: ITableProps = {
    style:{},
    className:''
  }
  constructor(props: ITableProps) {
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

export default Table;