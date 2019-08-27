/**
 * @module libp2p-bootstrap
 */
'use strict'

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')
const mafmt = require('mafmt')
const EventEmitter = require('events').EventEmitter
const debug = require('debug')

const log = debug('libp2p:bootstrap')
log.error = debug('libp2p:bootstrap:error')

/**
 * @class
 * @memberof module:libp2p-bootstrap
 */
class Bootstrap extends EventEmitter {
  /**
   * Emits 'peer' events on a regular interval for each peer in the provided list
   *
   * @constructs
   * @param {Object} options
   * @param {Array<string>} options.list - the list of peer addresses in multi-address format
   * @param {number} [options.interval] - the interval between emitting addresses (in milli-seconds)
   *
   */
  constructor (options) {
    super()
    this._list = options.list
    this._interval = options.interval || 10000
    this._timer = null
  }

  /**
   * Start emitting events.
   */
  start () {
    if (this._timer) {
      return
    }

    this._timer = setInterval(() => this._discoverBootstrapPeers(), this._interval)

    this._discoverBootstrapPeers()
  }

  /**
   * Emit each address in the list as a PeerInfo.
   * @ignore
   */
  _discoverBootstrapPeers () {
    this._list.forEach(async (candidate) => {
      if (!mafmt.IPFS.matches(candidate)) {
        return log.error('Invalid multiaddr')
      }

      const ma = multiaddr(candidate)

      const peerId = PeerId.createFromB58String(ma.getPeerId())

      try {
        const peerInfo = await PeerInfo.create(peerId)
        peerInfo.multiaddrs.add(ma)
        this.emit('peer', peerInfo)
      } catch (err) {
        log.error('Invalid bootstrap peer id', err)
      }
    })
  }

  /**
   * Stop emitting events.
   */
  stop () {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  }
}
exports = module.exports = Bootstrap
/** Tag
 * @type string
*/
exports.tag = 'bootstrap'
