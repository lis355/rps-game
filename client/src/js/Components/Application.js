const React = require("react");
const {findDOMNode} = require("react-dom");
const Player = require("./../Player");
const Chat = require("./Chat");
const VideoChat = require("./VideoChat");

const {
	Modal, ModalHeader, ModalBody, ModalFooter, Popover, PopoverHeader, PopoverBody
} = require("reactstrap");

module.exports = class Application extends React.Component {
	constructor(props) {
		super(props);

		this.player = new Player();
		this.player.onSetId = id => this.setState({id: id});
		this.player.onConnect = () => this.setState({connected: true});
		this.player.onDisconnect = () => this.setState({connected: false});
		this.player.onJoined = () => this.setState({joined: true});

		this.state = {
			page: "register",
			modal: false,
			rulesPopoverOpen: false,

			id: ""
		};

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.rulesPopoverOpenClose = this.rulesPopoverOpenClose.bind(this);

		this._connectToPlayerInput;

		setTimeout(this.showModal, 1000);
	}

	componentDidMount() {
		this.player.start();
	}

	componentWillUnmount() {
		this.player.stop();
	}

	connectToPlayer() {
		this.player.connectToPlayer(this._connectToPlayerInput.value);
	}

	leave() {
		this.player.leave();
		this.setState({joined: false});
	}

	showModal() {
		this.setState({modal: true});
	}

	hideModal() {
		this.setState({modal: false});
	}

	rulesPopoverOpenClose() {
		this.setState({
			rulesPopoverOpen: !this.state.rulesPopoverOpen
		});
	}

	_renderPages() {
		switch (this.state.page) {
			case "waitingConnection":
				return this._renderWaitingForConnection();
			case "register":
				return this._renderRegisterPage();
			case "game":
				return this._renderGame();
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
						<label className="col-sm-9 col-form-label"><b>QweRt</b></label>
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
			<Chat/>
		);
	}

	_renderModal() {
		return (
			<Modal isOpen={this.state.modal} toggle={this.hideModal} className={this.props.className}>
				<ModalHeader toggle={this.hideModal}>Modal title</ModalHeader>
				<ModalBody>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</ModalBody>
				<ModalFooter>
					<button type="button" className="btn btn-primary" onClick={this.hideModal}>Do Something</button>{' '}
					<button type="button" className="btn btn-primary" onClick={this.hideModal}>Cancel</button>
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
									<button id="rules-popover-button" type="button" onClick={this.rulesPopoverOpenClose} className="btn btn-outline-primary shadow-none">Rules</button>
									<Popover placement="bottom" isOpen={this.state.rulesPopoverOpen} target="rules-popover-button" toggle={this.rulesPopoverOpenClose}>
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
