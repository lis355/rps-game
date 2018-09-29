# rps-game
React / Socket IO / WebRTC rock-paper-scrissors game with text and video chat

<p align="center"><img src="https://user-images.githubusercontent.com/2791094/45978922-2842ff80-c056-11e8-806a-ff3cab204749.png"
width=600 height=355></p>
<p align="center">https://rps-videochat.herokuapp.com/</p>

* Frontend: React JS, WebRTC for video and audio calls, Bootstrap
* Backend: Node JS
* Socket IO for communication 

App realize app with simply game, client-server communication via library Socket IO, text chat, video and audio calls

## Build

There are 2 directories: client and server, you need to build them separately

### Client
```
cd client
npm install
npm run build
```

Then you can run script *start-client.bat* or use npm script, it uses http-server

```
"client": "cd dist && http-server --host=localhost --port=9001"
```

### Server

```
cd server
npm install
npm run start
```

You can use script *start-server.bat*
