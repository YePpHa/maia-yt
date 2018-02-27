import { h, Component } from 'preact';

export interface IProps {
  label: string,
  checked: boolean,
  disabled: boolean,
  indeterminate: boolean,
  onChange?: (checked: boolean) => void
}

export interface IState {
  checkedInternal: boolean,
  disabledInternal: boolean,
  indeterminateInternal: boolean
}

export class Checkbox extends Component<IProps, IState> {
  private _input: HTMLInputElement|undefined = undefined;

  static defaultProps: IProps = {
    label: "",
    checked: false,
    disabled: false,
    indeterminate: false
  }

  state: IState = {
    checkedInternal: this.props.checked,
    disabledInternal: this.props.disabled,
    indeterminateInternal: this.props.indeterminate
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.setState({
      checkedInternal: checked,
      indeterminateInternal: false
    });

    if (this.props.onChange) {
      this.props.onChange(checked);
    }
  }

  render(): JSX.Element {
    const { label } = this.props;
    const { checkedInternal, disabledInternal, indeterminateInternal } = this.state;

    return (
      <label>
        <input
          ref={(input: HTMLInputElement) => { this._input = input }}
          type="checkbox"
          checked={checkedInternal}
          disabled={disabledInternal}
          onChange={(e: Event) => this.handleChange(e)}
        />
        { label }
      </label>
    );
  }

  componentWillReceiveProps(props: IProps) {
    if (props.checked !== this.props.checked) {
      this.setState({
        checkedInternal: props.checked,
        indeterminateInternal: false
      });
    }
    if (props.indeterminate !== this.props.indeterminate) {
      this.setState({
        indeterminateInternal: props.indeterminate
      });
    }
    if (props.disabled !== this.props.disabled) {
      this.setState({
        disabledInternal: props.disabled
      });
    }
  }

  componentDidUpdate() {
    if (this._input) {
      this._input.indeterminate = this.state.indeterminateInternal;
    }
  }
}