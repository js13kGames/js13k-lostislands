/**
 * User session class
 * @param {Socket} socket

  status:
	0: standby
	1: ingame
 */
class User {
	constructor(socket){
		this.id = socket.id;
		this.socket = socket;
		this.info = {
			id: this.id,
      name: 'player',
      hair: 0,
      skin: 0,
			status: 0,
			game: null
    };
	}

	updateInfo(info){
		//console.log('updating info', this.id,  info)
    if(info.name) this.info.name = info.name
    if(info.hair > -1) this.info.hair = info.hair
    if(info.skin > -1) this.info.skin = info.skin
		if(info.status) this.info.status = info.status

		this.updateUser()
  }

	updateUser(){
		this.socket.nsp.to(this.socket.id).emit('updateInfo', this.info)
	}
}

export default User;
