import './list.scss';


export default class List extends React.Component
  constructor: ->
    super()
    @state = { stations: JSON.parse(localStorage["stations"]) }

  onCollapseGroup: (groupName)->
    stations = @state.stations.map ({group, collapsed, list}) ->
      if groupName is group
        {group, collapsed: not collapsed, list}
      else
        {group, collapsed, list}

    @setStations(stations)

  onSelectStation: (groupName, stationName)->
    stations = @state.stations.map ({group, collapsed, list}) ->
      if groupName is group
        item.favorite = not item.favorite for item in list when item.name is stationName
        {group, collapsed, list}
      else
        {group, collapsed, list}

    @setStations(stations)

  setStations: (stations)->
    @setState({stations})
    localStorage.setItem('stations', JSON.stringify(stations))

  render: ->
    <div className="list">
      {@state.stations.map(@renderGroup)}
    </div>

  renderGroup: ({group, collapsed, list}, index)=>
    <div key={index} className="list-group">
      {@renderHeader(group, collapsed)}
      {if collapsed then null else list.map((station) => @renderItem(group, station))}
    </div>

  renderHeader: (group, collapsed)=>
    <div className="list-group-header">
      <div className="list-group-header-name">
        {group}
      </div>

      <div className="list-group-header-arrow" onClick={=> @onCollapseGroup(group)}>
        <img 
          className="list-group-header-arrow-image" 
          alt={if collapsed then 'down' else 'up'} 
          src={if collapsed then './img/down-arrow.svg' else './img/up-arrow.svg'}
        />
      </div>
    </div>

  renderItem: (group, {name, favorite})=>
    <label key={name} className="station">
      <input type="checkbox" checked={favorite} onClick={=> @onSelectStation(group, name)} />
      <span className="station-name">{name}</span>
    </label>
