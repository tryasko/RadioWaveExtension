import "./index.css";
import { h, Component } from "preact";

export default class StationList extends Component {
  constructor() {
    super();

    this.state = {
      stations: JSON.parse(localStorage.stations)
    };
  }

  onSelect(stream, favorite) {
    const stations = this.state.stations.map(station =>
      Object.assign(station, { favorite: station.stream === stream ? favorite : station.favorite })
    );

    localStorage.setItem("stations", JSON.stringify(stations));
    this.setState({ stations });
  }

  render() {
    return (
      <div className="list">
        {this.state.stations.map(this.renderItem, this)}
        <div className="station-separator" />
      </div>
    );
  }

  renderItem({ name, group, stream, url, favorite }) {
    return (
      <label key={name + group} className="station">
        <input type="checkbox" checked={favorite} onChange={() => this.onSelect(stream, !favorite)} />
        <span className="station-group">{group}</span>
        <span className="station-name">{name}</span>
        <a className="station-link" target="_blank" href={url}>
          link
        </a>
      </label>
    );
  }
}
