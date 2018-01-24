import './list.scss';


export default class List extends React.Component
  constructor: ->
    super()
    @state = { stations: JSON.parse(localStorage["stations"]) }

  componentDidMount: ->
    document.querySelector('.station.active').scrollIntoView()

  onPlayStation: (groupName, stationName)=>
    stations = @state.stations.map (station)->
      if station.name is stationName and station.group is groupName
        station.active = yes
      else
        station.active = no
      station

    @setState({"stations": stations})
    localStorage.setItem("stations", JSON.stringify(stations))

  render: ->
    <ul className="play_list">
      {
        @state.stations
          .filter ({favorite})-> favorite
          .map @renderItem
      }
    </ul>

  renderItem: ({name, group, active}, index)=>
    if active
      <li key={index} className="station active">
        {name}
      </li>
    else
      <li key={index} className="station" onClick={=> @onPlayStation(group, name)}>
        {name}
      </li>
