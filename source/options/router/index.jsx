import React, { Component } from 'react';

export default class Router extends Component {
  constructor() {
    super();

    this.state = {
      url: window.location.hash
    };
  }

  componentDidMount() {
    window.onhashchange = ()=> {
      this.setState({url: window.location.hash});
    }
  }

  render() {
    return (this.getPage(this.state.url));
  }

  getPage(url) {
    switch (url) {
      case "":
      case "#stations":
        return 'Stations!';

      case "#settings":
        return 'Settings!';

      case "#about":
        return 'About!';

      default:
        return '404!';
    }
  }
}
