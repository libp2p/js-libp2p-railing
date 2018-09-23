'use strict'

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')
const mafmt = require('mafmt')
const EventEmitter = require('events').EventEmitter
const debug = require('debug')
const setImmediate = require('async/setImmediate')

const log = debug('libp2p:bootstrap')
log.error = debug('libp2p:bootstrap:error')

function isIPFS (addr) {
  try {
    return mafmt.IPFS.matches(addr)
  } catch (e) {
    return false
  }
}

class Bootstrap extends EventEmitter {
  constructor (options) {
    super()
    this._list = options.list
    this._peers = null
    this._interval = options.interval || 10000
    this._timer = null
  }

  start (callback) {
    if (this._timer) { return }

    this._peers = this._list.reduce((peers, candidate, cb) => {
      if (!isIPFS(candidate)) {
        log.error('Invalid multiaddr ' + candidate)
        return peers
      }

      const ma = multiaddr(candidate)
      const peerId = PeerId.createFromB58String(ma.getPeerId())

      const peerInfo = new PeerInfo(peerId)
      peerInfo.multiaddrs.add(ma)

      return peers.concat(peerInfo)
    }, [])

    this._timer = setInterval(() => {
      this._peers.forEach((peerInfo) => this.emit('peer', peerInfo))
    }, this._interval)

    setImmediate(() => callback())
  }

  stop (callback) {
    setImmediate(callback)

    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  }
}

exports = module.exports = Bootstrap
exports.tag = 'bootstrap'
