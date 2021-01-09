import React, { Component } from "react";
export default class App extends Component {
  state = {
    current: 1,
    size: 10,
    total: 90,
    arr: [1, 2, 3, 4],
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        // arr: [1, 2, 3, 4],
      });
    }, 1000);
  }
  render() {
    const { current, size, total } = this.state;
    return <div className="App"></div>;
  }
}
