import stations from './stations'

localStorage.setItem('stations', JSON.stringify(stations))

console.log 'Hello BACKGROUND!'
