import * as React from 'react';
import { Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import { Checkbox as MaterialCheckbox } from '@material/checkbox';

export interface IProps extends React.Props<Checkbox> {
  id?: string,
  labelId?: string,
  checked: boolean,
  disabled: boolean,
  indeterminate: boolean,
  onChange: Function
}

export interface IState {
  classes: ImmutableSet<string>,
  rippleCss: ImmutableMap<string, string>,
  checkedInternal: boolean,
  disabledInternal: boolean,
  indeterminateInternal: boolean
}

export default class Checkbox extends React.PureComponent<IProps, IState> {
  static defaultProps: IProps = {
    checked: false,
    disabled: false,
    indeterminate: false,
    onChange: () => {}
  }

  state: IState = {
    classes: ImmutableSet(),
    rippleCss: ImmutableMap(),
    checkedInternal: this.props.checked,
    disabledInternal: this.props.disabled,
    indeterminateInternal: this.props.indeterminate
  }

  render() {
    return (
      <div className="mdc-checkbox__mixedmark"></div>
    );
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(props: IProps) {
    if (props.checked !== this.props.checked) {
      this.setState({ checkedInternal: props.checked, indeterminateInternal: false });
    }
    if (props.indeterminate !== this.props.indeterminate) {
      this.setState({ indeterminateInternal: props.indeterminate });
    }
    if (props.disabled !== this.props.disabled) {
      this.setState({ disabledInternal: props.disabled });
    }
  }

  componentDidUpdate() {

  }
}