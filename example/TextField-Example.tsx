import {TextField} from "../index";

import * as React from "react";

interface ITextFieldExampleState {
  value: string
}

class TextFieldExample extends React.Component <{}, ITextFieldExampleState> {
  constructor(props: any) {
    super(props);
    this.state = {value: ""};
  }
  _valueChanged(value: string) {
    this.setState({value})
  }
  public render(): JSX.Element {
    return (
      <div>
        <TextField valueChanged={(value) => this._valueChanged(value)} />
        <div>
          {this.state.value}
        </div>
      </div>
    )
  }
}

export default TextFieldExample;
