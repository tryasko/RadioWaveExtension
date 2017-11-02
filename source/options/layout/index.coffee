# import './index.css';

import Navbar from './navbar';

export default class Layout extends React.Component
  render: ->
    <div className="Layout">
      <div className="Header">
        <Navbar pageName={@props.pageName} />
      </div>

      <div className="Content">
        {@props.children}
      </div>
      
      <div className="Footer">
        <a href="http://radiowave.in.ua/" target="_blank" rel="noopener noreferrer">radiowave.in.ua</a>
      </div>
    </div>
