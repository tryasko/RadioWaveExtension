//import "./index.scss";
import { h, Component } from "preact";

export default class Navbsr extends Component {
  render() {
    const pageName = this.props.pageName;

    return (
      <div className="Navbar">
        <div className="Navbar-separator" />

        <a className={this.getItemClassName(pageName, "stations")} href="#stations">
          Stations
        </a>

        <div className="Navbar-separator" />

        <a className={this.getItemClassName(pageName, "settings")} href="#settings">
          Settings
        </a>

        <div className="Navbar-separator" />

        <a className={this.getItemClassName(pageName, "about")} href="#about">
          About
        </a>

        <div className="Navbar-separator" />
      </div>
    );
  }

  getItemClassName(pageName, itemName) {
    return pageName === itemName ? "Navbar-item active" : "Navbar-item";
  }
}
