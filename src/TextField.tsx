import * as React from "react";

export interface ITextFieldProps  {
  valueChanged?: (value: string) => void
  title?: string
  value?: string
  hintText?: string
  blurCheck?: boolean
  style?: React.CSSProperties,
  disabled?: boolean
  errorMessage?: string
  mandatory?: boolean
  multiline?: boolean
  suffix?: JSX.Element
};

interface ITextFieldState {
  value?: string
};



class TextField extends React.Component<ITextFieldProps, ITextFieldState> {

  static defaultProps: ITextFieldProps;

  constructor(props: ITextFieldProps) {
    super(props);
    if (this.props.blurCheck){
      this.state = {value: props.value}
    }
  }

  _valueChanged(value: string){
    if (this.props.blurCheck === false){
      this.props.valueChanged(value);
    }
    else {
      this.setState({value});
    }

  }
  _getInputWrapperStyle() {
    let borerColor = "#e0e0e0";
    if (this.props.errorMessage) {
      borerColor = "#f44336";
    }
    let defaultStyle: React.CSSProperties = {
      borderRadius: "4px",
      display: "flex",
      flex: 1,
      paddingLeft: "10px",
      backgroundColor: "#ffffff",
      border: `solid 1px ${borerColor}`,
      alignItems: "center"
    }

    return defaultStyle;
  }
  _getInputStyle() {
    let defaultStyle: React.CSSProperties = {
      border: "none",
      borderRadius: "4px",
      height: "40px",
      display: "flex",
      flex: 1,
      color: "#666",
      fontSize: "14px",
      outline: "none",
    }

    if (this.props.disabled) {
      defaultStyle.color = "#999";
    }

    return defaultStyle;
  }
  _getTextAreaStyle() {
    let defaultStyle: React.CSSProperties = {
      border: "none",
      borderRadius: "4px",
      minHeight: "40px",
      display: "flex",
      flex: 1,
      color: "#666",
      fontSize: "14px",
      paddingTop: "10px",
      outline: "none",
    }

    return defaultStyle;
  }
  _getStyle() {
    let defaultStyle: React.CSSProperties = {

    }

    return Object.assign({}, defaultStyle, this.props.style);
  }
  _getErrorStyle() {
    let defaultStyle: React.CSSProperties = {
      color: "#f44336",
      marginTop: "6px",
      fontSize: "12px",
      position: "absolute"
    }

    return defaultStyle;
  }
  _getError() {
    if (this.props.errorMessage) {
      return (
        <div style={this._getErrorStyle()} >{this.props.errorMessage}</div>
      )
    }

    return null;
  }
  _onFocus(input: HTMLInputElement | HTMLTextAreaElement) {
    if (this.props.errorMessage) {
      return;
    }
    let wrapper = this.refs["wrapper"] as HTMLSpanElement;
    wrapper.style.borderColor = "#2196f3";
  }
  _onBlur(input: HTMLInputElement | HTMLTextAreaElement) {
    let value = input.value;
    if (this.props.blurCheck) {
      this.props.valueChanged(value);
    }
    if (this.props.errorMessage) {
      return;
    }
    let wrapper = this.refs["wrapper"] as HTMLSpanElement;
    wrapper.style.borderColor = "#e0e0e0";



  }
  _getInputArea() {
    let value;
    if (this.props.blurCheck === false) {
      value = this.props.value;
    }
    else {
      value = this.state.value;
    }
    let validValue = value === null ? "" : value;

    if (this.props.multiline) {
      return (
        <textarea
          style={this._getTextAreaStyle()}
          placeholder={this.props.hintText}
          value={validValue}
          onFocus={(ev) => this._onFocus(ev.currentTarget)}
          onBlur={(ev) => this._onBlur(ev.currentTarget)}
          onChange={(event) => this._valueChanged(event.currentTarget.value)} />
      );
    }
    else {
      return (
        <input
          type="input"
          style={this._getInputStyle()}
          value={validValue}
          disabled={this.props.disabled}
          placeholder={this.props.hintText}
          onFocus={(ev) => this._onFocus(ev.currentTarget)}
          onBlur={(ev) => this._onBlur(ev.currentTarget)}
          onChange={(input) => this._valueChanged(input.currentTarget.value)} />
      )
    }
  }
  componentWillReceiveProps(nextProps: ITextFieldProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value});
    }
  }
  public render(): JSX.Element {
    return (
      <span>
        <span ref="wrapper" style={this._getInputWrapperStyle()}>
          {this._getInputArea()}
          {this.props.suffix}
        </span>
        {this._getError()}
      </span>
    );
  }
}


TextField.defaultProps = {
  multiline: false,
  blurCheck: true
};

export default TextField;