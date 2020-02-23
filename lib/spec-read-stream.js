const EventEmitter = require('events')

class SpecReadStream extends EventEmitter {
	constructor(specs) {
		super()

		this.specs = specs ? specs : []
	}

	add(n) {
		this.specs.push(n)
	}

	read(n) {
		if(this.specs.length == 0) return null

		var a = []
		var i = 0
		while(i < n) {
			var head = this.specs.shift()
			if(!head) {
				break
			}

			if(head[0] > n-i) {
				var count = n-i
				i += count
				a.push( [count, head[1]] )
				
				this.specs.unshift([head[0] - count, head[1]])
			} else {
				i += head[0]

				a.push(head)
			}
		}

		if(this.specs.length == 0) {
			this.emit('empty')
		}

		return a
	}
}

module.exports = SpecReadStream

