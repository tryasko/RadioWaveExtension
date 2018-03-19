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
        <div className="list-group">
          {this.renderGropHeader()}
          {this.state.stations.map(this.renderItem, this)}
        </div>
      </div>
    );
  }

  renderGropHeader() {
    return (
      <div className="list-group-header">
        <div className="list-group-header-name">Group Name</div>

        <div className="list-group-header-arrow" onClick={() => {}}>
          <img className="list-group-header-arrow-image" alt={"alt"} src={"src"} />
        </div>
      </div>
    );
  }

  renderItem({ name, group, favorite }) {
    return (
      <label key={name + group} className="station">
        <input type="checkbox" checked={favorite} onChange={() => {}} />
        <span className="station-group">{group}</span>
        <span className="station-name">{name}</span>
      </label>
    );
  }
}
