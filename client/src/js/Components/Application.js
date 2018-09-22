const React = require("react");
const {findDOMNode} = require("react-dom");
const Player = require("./../Player");
const Chat = require("./Chat");
const VideoChat = require("./VideoChat");

class Application extends React.Component {
	constructor(props) {
		super(props);

		this.player = new Player();
		this.player.onSetId = id => this.setState({id: id});
		this.player.onConnect = () => this.setState({connected: true});
		this.player.onDisconnect = () => this.setState({connected: false});
		this.player.onJoined = () => this.setState({joined: true});
		this.state = {id: ""};
	}

	componentDidMount() {
		this.player.start();
	}

	componentWillUnmount() {
		this.player.stop();
	}

	connectToPlayer() {
		this.player.connectToPlayer(findDOMNode(this.refs.connectToPlayerInput).value);
	}

	leave() {
		this.player.leave();
		this.setState({joined: false});
	}

	renderConnectionPage() {
		return (
			<div>Соединение с сервером...</div>
		);
	}

	renderLobbyPage() {
		return (
			<div>
				Ваш id {this.state.id}
				<div><input defaultValue={this.state.id} ref="connectToPlayerInput"/></div>
				<div>
					<button onClick={this.connectToPlayer.bind(this)}>Играть!</button>
				</div>
			</div>
		);
	}

	renderMainPage() {
		return (
			<div>
				<button onClick={this.leave.bind(this)}>Завершить</button>
				<Chat player={this.player} sendMessage={this.player.sendMessage.bind(this.player)}/>
				<VideoChat player={this.player}/>
			</div>
		);
	}

	render() {
		if (!this.state.connected
			/*|| !this.state.id*/)
			return this.renderConnectionPage();

		return /*!this.state.joined ? this.renderLobbyPage() :*/ this.renderMainPage();
	}
}

module.exports = Application;
