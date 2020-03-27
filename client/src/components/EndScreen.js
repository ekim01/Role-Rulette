import React, { Component } from 'react';
import { POLLING_TIME } from "../Utilities/constants";
import "../stylesheets/common.css";
import "../stylesheets/Role.css";

export default class EndScreen extends Component {
    constructor(props) {
      super(props);
      };


render() {
  
    return (
      <div>
        <h1 id="gameTitle" className="text-center"> Current Game: SpyFall</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-8 col-xs-10" id="container-box">
              <div id="roleContainer">
              <ul className="list-group">
               {this.props.players.map((player,i) => (
                 player.role?
                  <li className="list-group-item" key={i}>{`${player.name}s role was ${player.role.name}`}</li>
                 :<li className="list-group-item" key={i}>{player.name+'\tjoining...'}</li>
                ))}
              </ul>
               
              </div>
              <React.Fragment>
                  <button
                        type="submit"
                        className="btn btn-lg btn-block"
                        onClick={() => {this.props.setPage("Lobby")}}
                      >
                        Back to Lobby
                </button>
                </React.Fragment>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
