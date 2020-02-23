const { expect } = require('chai')

const chai = require("chai")
chai.use(require("chai-events"))
const should = chai.should()

const SpecReadStream = require('../lib/spec-read-stream')

describe('spec-stream', () => {
	describe('#read', () => {
		it('should return null if empty', () => {
			var st = new SpecReadStream()
			expect(st.read(10)).to.be.null
		})

		it('should return single array if it is exact', () => {
			var st = new SpecReadStream([[10, 'abc']])

			expect(st.read(10)).to.eql([[10, 'abc']])

			expect(st.read(10)).to.be.null
		})

		it('should return array with single array chunk if head of specs is larger than requested items', () => {
			var st = new SpecReadStream([[15, 'abc']])

			expect(st.read(10)).to.eql([[10, 'abc']])

			expect(st.read(10)).to.eql([[5, 'abc']])

			expect(st.read(10)).to.be.null
		})

		it('should return array with multiple array chunks if first specs are smaller than requested items', () => {
			var st = new SpecReadStream([
				[5, 'abc'],
				[3, 'def'],
				[2, 'ghi'],
			])

			expect(st.read(10)).to.eql([[5, 'abc'], [3, 'def'], [2, 'ghi']])

			expect(st.read(10)).to.be.null
		})

		it('should return array with multiple array chunks if first specs are smaller than requested items', () => {
			var st = new SpecReadStream([
				[5, 'abc'],
				[3, 'def'],
				[1, 'ghi'],
			])

			expect(st.read(10)).to.eql([[5, 'abc'], [3, 'def'], [1, 'ghi']])

			expect(st.read(10)).to.be.null
		})
	})

	describe('#add', () => {
		it('should add spec to specs', () => {
			var st = new SpecReadStream()
			expect(st.read(10)).to.be.null

			st.add([10, 'abc'])
			expect(st.read(10)).to.eql([[10, 'abc']])

			expect(st.read(10)).to.be.null
		})
	})

	describe('#on', () => {
		it('should emit event empty', () => {
			var st = new SpecReadStream()

			st.should.emit('empty')

			st.add([10, 'abc'])
			expect(st.read(10)).to.eql([[10, 'abc']])

			return st
		})
	})
})
