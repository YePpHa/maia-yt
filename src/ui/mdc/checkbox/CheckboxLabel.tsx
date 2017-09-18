import * as React from 'react';

export interface IProps extends React.Props<CheckboxLabel> {
  children: React.ReactChildren,
  id?: string,
  for?: string
}

export default class CheckboxLabel extends React.PureComponent<IProps> {
  render() {
    const { id, children, for: controlId } = this.props;

    return (
      <label className="mdc-checkbox-label" id={id} htmlFor={controlId}>
        {children}
      </label>
    );
  }
}