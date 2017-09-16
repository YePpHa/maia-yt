import * as React from 'react';

export interface IProps extends React.Props<Checkbox> {
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

export class Checkbox extends React.PureComponent<IProps, IState> {
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

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;

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
          ref="nativeCb"
          type="checkbox"
          checked={checkedInternal}
          disabled={disabledInternal}
          onChange={this.handleChange.bind(this)}
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
    if (this.refs.nativeCb) {
      (this.refs.nativeCb as HTMLInputElement).indeterminate = this.state.indeterminateInternal;
    }
  }
}