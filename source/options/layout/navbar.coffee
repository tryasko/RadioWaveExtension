# import './navbar.css';

export default class Navbar extends React.Component
  render: ->
    <div className="Navbar">
      <div className="Navbar-separator" />

      <a className={@getItemClassName(@props.pageName, 'stations')} href="#stations">
        Stations
      </a>

      <div className="Navbar-separator" />

      <a className={@getItemClassName(@props.pageName, 'settings')} href="#settings">
        Settings
      </a>

      <div className="Navbar-separator" />

      <a className={@getItemClassName(@props.pageName, 'about')} href="#about">
        About
      </a>
      
      <div className="Navbar-separator" />
    </div>

  getItemClassName: (pageName, itemName)->
    pageName is itemName ? 'Navbar-item active' : 'Navbar-item';
