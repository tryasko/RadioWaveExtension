import './list.scss';


export default class List extends React.Component
  constructor: ->
    super()
    @state = { 
      groups: JSON.parse(localStorage["groups"]) 
      stations: JSON.parse(localStorage["stations"]) 
    }

  onCollapseGroup: (groupName)=>
    groups = @state.groups.map (group)->
      if group.name is groupName
        group.collapsed = not group.collapsed
      group

    @setData("groups", groups)

  onSelectStation: (stationName, groupName)=>
    stations = @state.stations.map (station)=>
      if station.name is stationName and station.group is groupName
        station.favorite = not station.favorite
      station

    @setData("stations", stations)

  setData: (key, data)=>
    @setState({key: data})
    localStorage.setItem(key, JSON.stringify(data))

  render: ->
    <div className="list">
      {@state.groups.map(@renderGroup)}
    </div>

  renderGroup: ({name, collapsed}, index)=>
    <div key={index} className="list-group">
      {@renderHeader(name, collapsed)}
      {if collapsed then null else @renderList(name)}
    </div>

  renderHeader: (name, collapsed)=>
    <div className="list-group-header">
      <div className="list-group-header-name">
        {name}
      </div>

      <div className="list-group-header-arrow" onClick={=> @onCollapseGroup(name)}>
        <img 
          className="list-group-header-arrow-image" 
          alt={if collapsed then 'down' else 'up'} 
          src={if collapsed then './img/down-arrow.svg' else './img/up-arrow.svg'}
        />
      </div>
    </div>

  renderList: (groupName)=>
    @state.stations
      .filter (station)-> station.group is groupName
      .map @renderItem

  renderItem: ({name, group, favorite})=>
    <label key={name+group} className="station">
      <input type="checkbox" checked={favorite} onChange={=> @onSelectStation(name, group)} />
      <span className="station-name">{name}</span>
    </label>
