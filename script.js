/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 'off' */

var $ = document.getElementById.bind(document)
var peer = new Peer()
var conn = null

// set local ID
peer.on('open', () => {
  $('local-id').innerHTML = peer.id

  var qrcode = new QRCode($('qrcode'), {
    text: peer.id,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  })
})

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

function clickScan () {
  const video = document.getElementById('preview')
  const scanner = new Instascan.Scanner({ video })
  scanner.addListener('scan', function (content) {
    console.log(content)
  })
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0])
    } else {
      console.error('No cameras found.')
    }
  }).catch(function (e) {
    console.error(e)
  })
}
