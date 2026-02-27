import { useState } from 'react'
import './App.css'
import {joinRoom} from 'trystero'

const trysteroConfig = {appId: 'webrtc-multiplayer'};

export default function App(roomId: string) {
  const room = joinRoom(trysteroConfig, roomId);
  const [sendColor, getColor] = room.makeAction('color');
  const [myColor, setMyColor] = useState('#c0ffee');
  const [peerColors, setPeerColors] = useState({});

  // whenever new peers join the room, send my color to them:
  room.onPeerJoin(peer => sendColor(myColor, peer));

  // listen for peers sending their colors and update the state accordingly:
  getColor((color, peer) =>
    setPeerColors(peerColors => ({...peerColors, [peer]: color}))
  )

  const updateColor = (e: { target: { value: any; }; }) => {
    const {value} = e.target;

    // when updating my own color, broadcast it to all peers:
    sendColor(value);
    setMyColor(value);
  }

  return (
    <>
      <h2>My color:</h2>
      <input type="color" value={myColor} onChange={updateColor} />

      <h2>Peer colors:</h2>
      <ul>
        {Object.entries(peerColors).map(([peerId, color]) => (
          <li key={peerId} style={{backgroundColor: color}}>
            {peerId}: {color}
          </li>
        ))}
      </ul>
    </>
  )
}
