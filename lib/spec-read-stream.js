const EventEmitter = require('events')

class SpecStream extends EventEmitter {
	constructor(opts) {
		super()

		if(opts) {
			this.specs = opts.specs ? opts.specs : []
			this.infinite = opts.infinite
			this.defaultValue = opts.defaultValue
		} else {
			this.specs = []
		}
	}

	add(n) {
		this.specs.push(n)
	}

	read(n) {
		if(this.specs.length == 0) {
			if(this.infinite)
				return [[n, this.defaultValue]]
			else
				return null
		}

		var a = []
		var i = 0
		while(i < n) {
			var head = this.specs.shift()
			if(!head) {
				if(this.infinite) {
					if(n-i > 0) {
						a.push([n-i, this.defaultValue])
					}
				}
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

module.exports = SpecStream

