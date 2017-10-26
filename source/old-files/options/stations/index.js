import React, { Component } from 'react';

import List from './list';
import data from './data';

export default class Stations extends Component {
  render() {
    return (
      <List stations={data} />
    );
  }
}
