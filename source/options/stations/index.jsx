import "./index.css";
import { h, Component } from "preact";

export default class StationList extends Component {
  constructor() {
    super();

    this.state = {
      stations: JSON.parse(localStorage.stations || "[]")
    };
  }

  render() {
    return (
      <div className="list">
        {this.state.stations.map(this.renderItem, this)}
        <div className="station-separator" />
      </div>
    );
  }

  renderItem({ name, group, url, favorite }) {
    return (
      <label key={name + group} className="station">
        <input type="checkbox" checked={favorite} onChange={() => {}} />
        <span className="station-group">{group}</span>
        <span className="station-name">{name}</span>
        <a className="station-link" target="_blank" href={url}>
          link
        </a>
      </label>
    );
  }
}
