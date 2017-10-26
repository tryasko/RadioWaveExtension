import React, { Component } from 'react';

import Navbar from './navbar';

import './index.css';

export default class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <div className="Header">
         <Navbar pageName={this.props.pageName} />
        </div>

        <div className="Content">
          {this.props.children}
        </div>
        
        <div className="Footer">
          <a href="http://radiowave.in.ua/" target="_blank" rel="noopener noreferrer">radiowave.in.ua</a>
        </div>
      </div>
    );
  }
}
