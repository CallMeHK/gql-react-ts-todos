import * as React from "react";

export interface AppProps {  }
export interface AppState { age: number; }

export default class App extends React.Component<AppProps, AppState> {
  state = {
      age:29
  }

  render() {
    return (
      <h1>
        My age is {this.state.age}
      </h1>
    );
  }
}
 