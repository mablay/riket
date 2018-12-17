## Deployment

Mind you, this repository is NOT the [PeerJS Server](https://github.com/peers/peerjs-server).
RIKET is a simple front end that uses a PeerJS Server for peer discovery.

You want to deploy RIKET, fork the repository and enable GitHub pages. Done.

### Why dedicated PeerJS Sever?

It would not have been necessary to setup a dedicated peer discovery server. Yet, using the camera for QR code scanning requires RIKET to be served via SSL.
And serving it via HTTPS does not bode well with any non SSL capable WebRTC endpoint.

AFAIK, PeerJS does not provide an SSL capable peer discovery server, so we run our own. Since this service more or less only maps IPs to IDs, there is not much load involved and it can be operated on a free HEROKU instance.

If you want to run your own: Here's the one click deploy [PeerJS Server button](https://elements.heroku.com/buttons/peers/peerjs-server).
