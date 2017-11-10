import Layout from '../layout';

import About from '../about';
import Stations from '../stations';
import Settings from '../settings';
import Page404 from '../404';

export default class Router extends React.Component
  constructor: ->
    super()
    @state = { url: window.location.hash }

  componentDidMount: -> 
    window.addEventListener("hashchange", @setURL)

  componentWillUnmount: ->
    window.removeEventListener("hashchange", @setURL)

  setURL: (url)=>
    @setState({ url: window.location.hash })

  render: ->
    {pageName, pageElement} = @getPage(@state.url)

    <Layout pageName={pageName}>
      {pageElement}
    </Layout>

  getPage: (url)->
    switch url
      when "", "#stations"
        {
          pageName: 'stations',
          pageElement: <Stations />
        }

      when "#settings"
        {
          pageName: 'settings',
          pageElement: <Settings />
        }

      when "#about"
        {
          pageName: 'about',
          pageElement: <About />
        }

      else
        {
          pageName: '404',
          pageElement: <Page404 />
        }
