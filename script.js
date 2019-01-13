/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 'off' */

var $ = document.getElementById.bind(document)
var peer = new Peer({
  host: 'riket-operator.herokuapp.com',
  port: 443,
  secure: true
})
var conn = null
let scanner = null

const views = {
  init: $('view-init'),
  messenger: $('view-messenger'),
  connection: $('view-connection'),
  scanner: $('view-scanner')
}

$('payload').addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    event.preventDefault()
    clickSend()
    $('payload').value = ''
  }
})

// --- PeerJS ---//

// set local ID
peer.on('open', () => {
  $('local-id').innerHTML = peer.id
  console.log('[PeerJS] OPEN | id:', peer.id)
  viewConnection()

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
  conn.on('open', () => conn.send('connected to ' + conn.peer))
  conn.on('data', data => {
    console.log('[WebRTC] received type', typeof data)
    $('inbox').innerHTML = data
  })
  viewMessenger()
}

// --- CHANGE VIEW --- //

function changeView (view) {
  if (!(view in views)) throw new Error('Invalid view', view)
  Object.keys(views).forEach(view => (views[view].style.display = 'none'))
  views[view].style.display = 'block'
}

function viewInit () { changeView('init') }
function viewMessenger () { changeView('messenger') }
function viewConnection () { changeView('connection') }
function viewScanner () { changeView('scanner') }

// --- ACTIONS ---//

function clickConnect () {
  var id = $('remote-id').value
  switchConnection(peer.connect(id))
}

function clickSend () {
  var payload = $('payload').value
  console.log('[clickSend] sending:', payload)
  if (conn) {
    conn.send(payload)
  }
}

function clickScan () {
  viewScanner()
  const video = document.getElementById('preview')
  scanner = new Instascan.Scanner({
    video,
    mirror: true
  })
  scanner.addListener('scan', function (id) {
    scanner.stop()
    switchConnection(peer.connect(id))
  })
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[cameras.length - 1])
    } else {
      console.error('No cameras found.')
    }
  }).catch(function (e) {
    console.error(e)
  })
}

function clickCancelScan () {
  if (!scanner) return
  console.log(scanner)
  scanner.stop()
  viewConnection()
}

function clickSwitchCamera () {
  const cameras = Instascan.Camera.getCameras()
  console.log('cameras', cameras)
}

function changeUpload (files) {
  const file = files[0]
  if (!file) {
    return console.log('no files selected')
  }
  const chunkSize = 1024 * 16
  let offset = 0
  const fileReader = new FileReader()
  const readSlice = o => {
    console.log('readSlice ', o)
    const slice = file.slice(offset, o + chunkSize)
    fileReader.readAsArrayBuffer(slice)
  }
  fileReader.addEventListener('error', error => console.error('Error reading file:', error))
  fileReader.addEventListener('abort', event => console.log('File reading aborted:', event))
  fileReader.addEventListener('load', e => {
    console.log('FileRead.onload ', e)
    conn.send(e.target.result)
    offset += e.target.result.byteLength
    if (offset < file.size) {
      readSlice(offset)
    }
  })
  readSlice(0)
  console.log('[Upload] file', file)
}
