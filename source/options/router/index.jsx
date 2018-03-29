import "./index.css";
import { h, Component } from "preact";

import Stations from "../stations";

export default class Router extends Component {
  constructor() {
    super();

    this.state = {
      url: window.location.hash
    };
  }

  componentDidMount() {
    window.addEventListener("hashchange", url => this.setState({ url: window.location.hash }));
  }

  render() {
    const { pageElement } = this.getPage(this.state.url);

    return (
      <div className="Layout">
        <div className="Header" />

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
          pageElement: <Stations />
        };

      default:
        return {
          pageName: "404",
          pageElement: <h1>404</h1>
        };
    }
  }
}
