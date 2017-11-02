
export default class Router extends React.Component
  constructor: ->
    super()
    @state = { url: window.location.hash }

  componentDidMount: -> 
    window.addEventListener("hashchange", => @setState({ url: window.location.hash }))

  render: ->
    @getPage(@state.url)

  getPage: (url)->
    switch url
      when "", "#stations"
        "Stations!"

      when "#settings"
        "Settings!"

      when "#about"
        "About!"

      else
        "404!"
