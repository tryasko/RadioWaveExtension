import React, { Component } from 'react';
import './list.css';
import upArrow from './img/up-arrow.svg';
import downArrow from './img/down-arrow.svg';

export default class List extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onCollapseGroup(groupName) {
    this.setState({[groupName]: !this.state[groupName]});
  }

  render() {
    return (
      <div className="list">
        {this.props.stations.map(this.renderGroup, this)}
      </div>
    );
  }

  renderGroup({group, list}, index) {
    const groupState = this.state[group];

    return (
      <div key={index} className="list-group">
        {this.renderHeader(group, groupState)}
        {!groupState && list.map(this.renderItem, this)}
      </div>
    );
  }

  renderHeader(groupName, groupState) {
    return (
      <div className="list-group-header">
        <div className="list-group-header-name">{groupName}</div>
        <div className="list-group-header-arrow" onClick={()=> this.onCollapseGroup(groupName)}>
          <img className="list-group-header-arrow-image" alt={groupState} src={groupState ? downArrow : upArrow}/>
        </div>
      </div>
    );
  }

  renderItem({name}) {
    return (
      <label key={name} className="station">
        <input type="checkbox"/>
        <span className="station-name">{name}</span>
      </label>
    );
  }
}
