import stations from './stations'

localStorage.setItem('groups', JSON.stringify(stations.groups))
localStorage.setItem('stations', JSON.stringify(stations.stations))
