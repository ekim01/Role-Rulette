import React, { Component } from "react";
import { restrictInputAlphanumeric } from "../Utilities/common";
import { PLAYERNAME_MAXLENGTH, ROOMCODE_LENGTH } from "../Utilities/constants";
import LoadingScreen from "../components/presentation/loadscreen";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from "../Banner.png";
import "../stylesheets/common.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomname: "",
      username: ""
    };
  }

  changeHandler = event => {
    let key = event.target.name;
    let val = event.target.value;

    this.setState({ [key]: val });
  };

  playernameHandler = event => {
    this.changeHandler(event);
  };

  roomnameHandler = event => {
    event.target.value = event.target.value.toUpperCase();
    this.changeHandler(event);
  };

  render() {
    return (
      <div>
        {this.props.loading && <LoadingScreen text="Loading..." />}
        <div class="text center">
          <img className="img-fluid mx-auto d-block rounded" src={Banner} alt="Role Roulette" />
        </div>
        <div className="container-fluid">
          <div className="col-lg-6 col-md-6 col-sm-8 col-xs-8" id="container-box">
            <h4 className="error-text">{this.props.errortext}</h4>
            <div className="form-group row">
              <label
                for="username"
                className="col-sm-4 col-form-label"
              >
                Enter a name:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control-plaintext"
                  className="border-black"
                  name="username"
                  placeholder="user"
                  maxLength={PLAYERNAME_MAXLENGTH}
                  size={PLAYERNAME_MAXLENGTH}
                  onChange={this.playernameHandler}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                for="roomname"
                className="col-sm-4 col-form-label"
              >
                Enter room code:
              </label>

              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control-plaintext"
                  className="border-black"
                  name="roomname"
                  placeholder="XXXX"
                  maxLength={ROOMCODE_LENGTH}
                  size={PLAYERNAME_MAXLENGTH}
                  onKeyPress={e => restrictInputAlphanumeric(e)}
                  style={{ textTransform: "uppercase" }}
                  onChange={this.roomnameHandler}
                />
              </div>
              <button
                id="join"
                type="submit"
                className="btn btn-lg btn-block"
                onClick={this.props.joinRoom.bind(
                  this,
                  this.state.roomname,
                  this.state.username
                )}
                disabled={this.props.loading}
              >
                Join Room
              </button>
              <button
                type="submit"
                className="btn btn-lg btn-block"
                onClick={this.props.createRoom.bind(this, this.state.username)}
                disabled={this.props.loading}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
