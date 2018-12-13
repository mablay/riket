/* eslint no-unused-vars: "off" */
/* eslint no-undef: "off" */

var $ = document.getElementById.bind(document)
var peer = new Peer()
var conn = null

// set local ID
peer.on('open', () => ($('local-id').innerHTML = peer.id))

// react to inbound connections
peer.on('connection', dataConnection => {
  console.log('inbound connection from', dataConnection.peer)
  $('remote-id').value = dataConnection.peer
  switchConnection(dataConnection)
})

function switchConnection (newConnection) {
  if (conn && typeof conn.close === 'function') {
    conn.close()
  }
  conn = newConnection
  conn.on('open', () => conn.send('hi!'))
  conn.on('data', data => ($('inbox').innerHTML = data))
}

function connect (id) {
  console.log('[connect] %s => %s', peer.id, id)
  switchConnection(peer.connect(id))
}

function clickConnect () {
  var id = $('remote-id').value
  connect(id)
}

function clickSend () {
  var payload = $('payload').value
  console.log('[clickSend] sending:', payload)
  if (conn) {
    conn.send(payload)
  }
}
