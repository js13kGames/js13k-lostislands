import ServerApp from './server/app'

Array.prototype.removeItem = function(item){
	return this.splice(this.indexOf(item), 1);
}

const App = new ServerApp();
module.exports = App.router.bind(App)
