import "./index.css";
import { h, Component } from "preact";

import Navbar from "../navbar";

export default class Router extends Component {
  constructor() {
    super();
    this.state = { url: window.location.hash };
  }

  componentDidMount() {
    window.addEventListener("hashchange", url => this.setState({ url: window.location.hash }));
  }

  render() {
    const { pageName, pageElement } = this.getPage(this.state.url);

    return (
      <div className="Layout">
        <div className="Header">
          <Navbar pageName={pageName} />
        </div>

        <div className="Content">{pageElement}</div>

        <div className="Footer">
          <a href="http://radiowave.in.ua/" target="_blank" rel="noopener noreferrer">
            radiowave.in.ua
          </a>
        </div>
      </div>
    );
  }

  getPage(url) {
    switch (url) {
      case "":
      case "#stations":
        return {
          pageName: "stations",
          pageElement: <h1>stations</h1>
        };

      case "#settings":
        return {
          pageName: "settings",
          pageElement: <h1>settings</h1>
        };

      case "#about":
        return {
          pageName: "about",
          pageElement: <h1>about</h1>
        };

      default:
        return {
          pageName: "404",
          pageElement: <h1>404</h1>
        };
    }
  }
}
