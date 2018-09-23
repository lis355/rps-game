const React = require("react");
const Player = require("./../Player");
const Chat = require("./Chat");
const VideoChat = require("./VideoChat");

const {
	Modal, ModalHeader, ModalBody, ModalFooter, Popover, PopoverHeader, PopoverBody
} = require("reactstrap");

const states = {
	CONNECTING: 0,
	LOBBY: 1,
	GAME: 2
};

module.exports = class Application extends React.Component {
	constructor(props) {
		super(props);

		this._player = new Player();
		//this._player.onConnect = () => this.setState({connected: true, app: states.CONNECTING});
		this._player.onDisconnect = () => this.setState({connected: false, app: states.CONNECTING});
		//this._player.onSetId = () => this.setState({app: states.LOBBY});
		this._player.onBadOpponentId = this._showBadOpponentIdMessage.bind(this);
		this._player.onJoined = () => this.setState({app: states.GAME});
		this._player.onLeaved = () => this.setState({app: states.LOBBY});

		this.state = {
			modal: false,
			rulesPopoverOpen: false,

			app: states.CONNECTING
		};

		// DEBUG
		this.state.app = states.GAME;
	}

	componentDidMount() {
		this._player.start();
	}

	componentWillUnmount() {
		this._player.stop();
	}

	connectToPlayer() {
		this._player.connectToPlayer(this._connectToPlayerInput.value);
		this._connectToPlayerInput.value = "";
	}

	_leave() {
		this._player.leave();
	}

	_showBadOpponentIdMessage() {
		this._showModal("Error", "Bad opponent ID");
	}

	_showModal(title, message) {
		this.setState({modal: {title: title, message: message}});
	}

	_hideModal() {
		this.setState({modal: false});
	}

	_rulesPopoverOpenClose() {
		this.setState({rulesPopoverOpen: !this.state.rulesPopoverOpen});
	}

	_renderPages() {
		switch (this.state.app) {
			case states.CONNECTING: return this._renderWaitingForConnection();
			case states.LOBBY: return this._renderRegisterPage();
			case states.GAME: return this._renderGame();
			default: console.error("Strange state"); break;
		}
	}

	_renderWaitingForConnection() {
		return (
			<div className="m-auto">
				<h1>Waiting for server connection...</h1>
			</div>
		);
	}

	_renderRegisterPage() {
		return (
			<div className="card register-form align-self-start mt-5 ml-auto mr-auto">
				<header className="card-header">
					<h4 className="card-title">Connect to player</h4>
					<span className="card-title">...or waiting for incoming connection</span>
				</header>
				<div className="card-body">
					<div className="form-group row">
						<label className="col-sm-3 col-form-label">Your ID</label>
						<label className="col-sm-9 col-form-label"><b>{this._player.id}</b></label>
					</div>
					<div className="form-group row">
						<label className="col-sm-3 col-form-label">Opponent ID</label>
						<div className="col-sm-6 col-form-label">
							<input type="text" className="form-control shadow-none" ref={e => e && (this._connectToPlayerInput = e)}/>
						</div>
						<div className="col-sm-3 col-form-label">
							<button id="rules-popover-button" type="button" className="btn btn-outline-primary shadow-none" onClick={this.connectToPlayer.bind(this)}>Connect</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderGame() {
		return (
			<Chat player={this._player}/>
		);
	}

	_renderModal() {
		return (
			<Modal isOpen={(Boolean)(this.state.modal)} toggle={this._hideModal.bind(this)} className={this.props.className}>
				<ModalHeader toggle={this._hideModal.bind(this)}>{this.state.modal.title}</ModalHeader>
				<ModalBody>
					{this.state.modal.message}</ModalBody>
				<ModalFooter>
					<button type="button" className="btn btn-primary" onClick={this._hideModal.bind(this)}>OK</button>
				</ModalFooter>
			</Modal>
		);
	}

	render() {
		return (
			<div className={"d-flex h-100 flex-column"}>
				<nav className="flex-shrink-0 navbar navbar-expand-lg navbar-light bg-light">
					<div className={"container"}>
						<span className="navbar-brand">Rock Paper Scrissors Game</span>
						<div className="mr-0">
							<ul className="navbar-nav mr-auto">
								<li className="nav-item active">
									{(this.state.app === states.GAME) && <button type="button" onClick={this._leave.bind(this)} className="btn btn-outline-primary shadow-none m-1">Leave</button>}
									<button id="rules-popover-button" type="button" onClick={this._rulesPopoverOpenClose.bind(this)} className="btn btn-outline-primary shadow-none m-1">Rules</button>
									<Popover placement="bottom" isOpen={this.state.rulesPopoverOpen} target="rules-popover-button" toggle={this._rulesPopoverOpenClose.bind(this)}>
										<PopoverHeader>Rules</PopoverHeader>
										<PopoverBody>
											<img alt="Rules" src={require("./../../images/rules.png")}/>
										</PopoverBody>
									</Popover>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<hr/>

				<div className={"flex-grow-1 position-relative d-flex"}>
					{this._renderPages()}
				</div>

				<nav className="flex-shrink-0 navbar navbar-expand-lg navbar-light bg-light">
					<div className="container d-flex justify-content-center">
						<span className="navbar-text text-center"><i>{"Author Ivan Lartsov"}</i></span>
					</div>
				</nav>

				{this._renderModal()}
			</div>
		);
	}
};
