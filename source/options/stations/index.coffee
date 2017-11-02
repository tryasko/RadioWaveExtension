import List from './list';
import data from './data';

export default class Stations extends React.Component
  render: ->
    <List stations={data} />