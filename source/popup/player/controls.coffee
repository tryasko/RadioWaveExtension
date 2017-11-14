import './controls.scss';


export default class Controls extends React.Component 
  render: ->
    <div className="controls">
      <div className="cnt_play"></div>
      <div className="cnt_volume">
        <div className="volume_wrapper">
          <div className="volume_bar"></div>
        </div>
      </div>
    </div>
