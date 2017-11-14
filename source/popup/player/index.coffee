import './index.scss';

import Controls from './controls'
import List from './list'


export default class Player extends React.Component 
  render: ->
    <div>
      <Controls />

      <List />

      <div className="bottom">
        <a href="../options/index.html" target="_blank">options</a>
      </div>
    </div>
