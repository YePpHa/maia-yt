import { h, Component } from 'preact';

export interface IProps {
  value: string,
  disabled: boolean,
  onChange?: (value: string) => void
}

export interface IState {
  valueInternal: string,
  disabledInternal: boolean
}

export class Select extends Component<IProps, IState> {
  static defaultProps: IProps = {
    value: "",
    disabled: false
  }

  state: IState = {
    valueInternal: this.props.value,
    disabledInternal: this.props.disabled
  }

  handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const value = target.value;

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
        onChange={(e: Event) => this.handleChange(e)}
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