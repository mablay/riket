# RIKET
Simple, fast and secure data transfer from and to your mobile.

Send data without installing an App and without using an intermediate data relay server inspecting your transmission.

This web app makes use of [WebRTC](https://webrtc.org/) a P2P web standard (read more [here](https://www.html5rocks.com/en/tutorials/webrtc/basics/)). Please note, a server is involved for peer discovery, but not for relaying data. Exception: The P2P connection fails due to firewall or NAT issues, then STUN / TURN servers will provide a fallback solution. RIKET defaults to a STUN fallback server provided by Google if no direct peer connection could be established.

## Upcoming Features

#### Full Privacy
Application level encrypted data communication. Since that's the out of the box part, I keep it for later. PR accepted ;-)

#### Reconnect
Once two devices are paired, the memoize their identities and reconnect automatically.
After auto-connecting, they each validate their peer signature to ensure authenticity.

## Dependencies
RIKET would not have been possible without:

* [peerjs](https://github.com/peers/peerjs) - WebRTC convenience library
* [instascan](https://github.com/schmich/instascan) - QR code scanner
* [qrcodejs](https://github.com/davidshimjs/qrcodejs) - QR code generator
