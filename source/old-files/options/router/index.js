import React, { Component } from 'react';

import Layout from '../layout';

import About from '../about';
import Stations from '../stations';
import Settings from '../settings';
import Page404 from '../404';

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
    const {pageName, pageElement} = this.getPage(this.state.url);

    return (
      <Layout pageName={pageName}>
        {pageElement}
      </Layout>
    );
  }

  getPage(url) {
    switch (url) {
      case "":
      case "#stations":
        return {
          pageName: 'stations',
          pageElement: <Stations />
        };

      case "#settings":
        return {
          pageName: 'settings',
          pageElement: <Settings />
        };

      case "#about":
        return {
          pageName: 'about',
          pageElement: <About />
        };

      default:
        return {
          pageName: 'page404',
          pageElement: <Page404 />
        };
    }
  }
}
