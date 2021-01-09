import { Component,ReactNode, CSSProperties } from "react";
import {IBaseProps, Namespace } from "../helper";

const ns = new Namespace("image")

export type  IImageProps = Partial<{
  slot:ReactNode,
  style:CSSProperties,
  className:string
}> & IBaseProps

export class Image extends Component< IImageProps> {
  static defaultProps: IImageProps = {
    style:{},
    className:''
  }
  constructor(props: IImageProps) {
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

export default Image;