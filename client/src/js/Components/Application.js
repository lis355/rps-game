const React = require("react");
const Player = require("./../Player");
const Game = require("./Game");

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
		this._player.onConnect = () => this.setState({connected: true, app: states.CONNECTING});
		this._player.onDisconnect = () => this.setState({connected: false, app: states.CONNECTING});
		this._player.onError = this._showServerErrorMessage.bind(this);
		this._player.onSetId = () => this.setState({app: states.LOBBY});
		this._player.onJoined = () => this.setState({app: states.GAME});
		this._player.onLeaved = () => this.setState({app: states.LOBBY});

		this.state = {
			modal: null,
			rulesPopoverOpen: false,

			app: states.CONNECTING
		};

		// DEBUG
		//this.state.app = states.GAME;
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

	_showServerErrorMessage(error) {
		let message = error.text;
		switch (message) {
			case "sameId":
				message = "You are sending your's ID";
				break;
			case "alreadyInGame":
				message = "You are already in game";
				break;
			case "badOpponentId":
				message = "Bad opponent ID";
				break;
			default :
				message = "Server error";
				break;
		}

		this._showModal("Error", message);
	}

	_showModal(title, message) {
		this.setState({modal: {title: title, message: message}});
	}

	_hideModal() {
		this.setState({modal: null});

		this._player.reConnect();
	}

	_rulesPopoverOpenClose() {
		this.setState({rulesPopoverOpen: !this.state.rulesPopoverOpen});
	}

	_renderPages() {
		switch (this.state.app) {
			case states.CONNECTING:
				return this._renderWaitingForConnection();
			case states.LOBBY:
				return this._renderRegisterPage();
			case states.GAME:
				return this._renderGame();
			default:
				console.error("Strange state");
				break;
		}
	}

	_renderWaitingForConnection() {
		return (
			<div className="absolute-fill d-flex justify-content-center align-items-center">
				<h1>Waiting for server connection...</h1>
			</div>
		);
	}

	_renderRegisterPage() {
		return (
			<div className="absolute-fill d-flex justify-content-center">
				<div className="f-4"/>
				<div className="f-4 d-flex flex-column">
					<div className="card">
						<header className="card-header">
							<h4 className="card-title">Connect to player</h4>
							<span className="card-title">...or waiting for incoming connection</span>
						</header>
						<div className="card-body d-flex flex-column justify-content-center">
							<div className="f-1"/>
							<div className=" f-5 d-flex">
								<label className="f-4 col-form-label">Your ID</label>
								<label className="f-8 col-form-label"><b>{this._player.id}</b></label>
							</div>
							<div className="f-3 d-flex align-items-center">
								<label className="f-4 col-form-label">Opponent ID</label>
								<div className="f-5 col-form-label">
									<input type="text" className="form-control shadow-none" ref={e => e && (this._connectToPlayerInput = e)}/>
								</div>
								<div className="f-3 d-flex justify-content-center col-form-label">
									<button id="rules-popover-button" type="button" className="btn btn-outline-primary shadow-none" onClick={this.connectToPlayer.bind(this)}>Connect</button>
								</div>
							</div>
							<div className="f-1"/>
						</div>
					</div>
				</div>
				<div className="f-4"/>
			</div>
		);
	}

	_renderGame() {
		return <Game player={this._player}/>;
	}

	_renderModal() {
		let title = this.state.modal ? this.state.modal.title : "";
		let message = this.state.modal ? this.state.modal.message : "";

		return (
			<Modal isOpen={this.state.modal !== null} toggle={this._hideModal.bind(this)} className={this.props.className}>
				<ModalHeader toggle={this._hideModal.bind(this)}>{title}</ModalHeader>
				<ModalBody>
					{message}</ModalBody>
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

				<div className={"flex-grow-1 position-relative"}>
					{this._renderPages()}
				</div>

				<nav className="flex-shrink-0 navbar navbar-expand-lg navbar-light bg-light">
					<div className="container d-flex justify-content-center">
						<span className="navbar-text text-center"><i>{"Ivan Lartsov"}</i></span>
						<a href="https://github.com/lis355/rps-game" className="text-secondary m-1 mr-3 ml-3">
							<h3 className="m-0">
								<i className="fab fa-github"/>
							</h3>
						</a>
						<span className="navbar-text text-center"><i>{"Have a nice day :)"}</i></span>
					</div>
				</nav>

				{this._renderModal()}
			</div>
		);
	}
};
