import './list.scss';


export default class List extends React.Component
  constructor: ->
    super()
    @state = { stations: JSON.parse(localStorage["stations"]) }

  componentDidMount: ->
    document.querySelector('.station.active').scrollIntoView()

  onPlayStation: (stationName)->
    console.log 'play station ' + stationName

  render: ->
    <ul className="play_list">
      {@state.stations.map @renderGroup}
    </ul>

  renderGroup: ({group, list}, index)=>
    <div key={index}>
      {list.map @renderItem}
    </div>

  renderItem: ({name, favorite, active}, index)=>
    return null unless favorite

    if active
      <li key={index} className="station active">
        {name}
      </li>
    else
      <li key={index} className="station" onClick={=> @onPlayStation(name)}>
        {name}
      </li>
