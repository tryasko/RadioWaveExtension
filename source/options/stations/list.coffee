import './list.scss';


export default class List extends React.Component
  constructor: ->
    super()
    @state = {}

  onCollapseGroup: (groupName)->
    groupState = {}
    groupState[groupName] = not @state[groupName]

    @setState(groupState)

  render: ->
    <div className="list">
      {@props.stations.map(@renderGroup)}
    </div>

  renderGroup: ({group, list}, index)=>
    groupState = @state[group];

    <div key={index} className="list-group">
      {@renderHeader(group, groupState)}

      {not groupState && list.map(@renderItem)}
    </div>

  renderHeader: (groupName, groupState)=>
    <div className="list-group-header">
      <div className="list-group-header-name">
        {groupName}
      </div>
      <div className="list-group-header-arrow" onClick={=> @onCollapseGroup(groupName)}>
        <img 
          className="list-group-header-arrow-image" 
          alt={groupState} 
          src={if groupState then './img/down-arrow.svg' else './img/up-arrow.svg'}
        />
      </div>
    </div>

  renderItem: ({name})=>
    <label key={name} className="station">
      <input type="checkbox"/>
      <span className="station-name">{name}</span>
    </label>
