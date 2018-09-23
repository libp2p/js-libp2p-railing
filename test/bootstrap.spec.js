/* eslint-env mocha */
'use strict'

const Bootstrap = require('../src')
const peerList = require('./default-peers')
const partialValidPeerList = require('./some-invalid-peers')
const chai = require('chai')
const expect = chai.expect
chai.use(require('dirty-chai'))
const mafmt = require('mafmt')
const PeerInfo = require('peer-info')

describe('bootstrap', () => {
  it('find the other peers', (done) => {
    const interval = 100
    const b = new Bootstrap({ list: peerList, interval })

    b.start((err) => {
      expect(err).to.not.exist()

      const foundPeers = []

      b.on('peer', (peer) => {
        expect(PeerInfo.isPeerInfo(peer)).to.be.true()
        const peerList = peer.multiaddrs.toArray()
        expect(peerList.length).to.eq(1)
        expect(mafmt.IPFS.matches(peerList[0].toString()))
        foundPeers.push(peer)
      })

      // Inspect foundPeers between first and second interval
      setTimeout(() => {
        expect(foundPeers).to.have.length(peerList.length)
        b.stop(done)
      }, interval + (interval / 2))
    })
  })

  it('not fail on malformed peers in peer list', (done) => {
    const interval = 100
    const b = new Bootstrap({ list: partialValidPeerList, interval })

    b.start((err) => {
      expect(err).to.not.exist()

      const foundPeers = []

      b.on('peer', (peer) => {
        expect(PeerInfo.isPeerInfo(peer)).to.be.true()
        const peerList = peer.multiaddrs.toArray()
        expect(peerList.length).to.eq(1)
        expect(mafmt.IPFS.matches(peerList[0].toString()))
        foundPeers.push(peer)
      })

      // Inspect foundPeers between first and second interval
      setTimeout(() => {
        expect(foundPeers).to.have.length(1)
        b.stop(done)
      }, interval + (interval / 2))
    })
  })
})
