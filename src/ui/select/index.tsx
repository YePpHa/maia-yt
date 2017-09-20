import * as React from 'react';

export interface IProps extends React.Props<Select> {
  children: JSX.Element[],
  value: string,
  disabled: boolean,
  onChange?: (value: string) => void
}

export interface IState {
  valueInternal: string,
  disabledInternal: boolean
}

export class Select extends React.PureComponent<IProps, IState> {
  static defaultProps: IProps = {
    children: [],
    value: "",
    disabled: false
  }

  state: IState = {
    valueInternal: this.props.value,
    disabledInternal: this.props.disabled
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    this.setState({
      valueInternal: value
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render(): JSX.Element {
    const { children } = this.props;
    const { valueInternal, disabledInternal } = this.state;

    return (
      <select
        value={valueInternal}
        disabled={disabledInternal}
        onChange={this.handleChange.bind(this)}
      >{children}</select>
    );
  }

  componentWillReceiveProps(props: IProps) {
    if (props.value !== this.props.value) {
      this.setState({
        valueInternal: props.value
      });
    }
    if (props.disabled !== this.props.disabled) {
      this.setState({
        disabledInternal: props.disabled
      });
    }
  }
}