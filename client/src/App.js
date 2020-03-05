import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Home from './components/Home'
import Lobby from './components/Lobby'
import Role from './components/role'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/lobby" component={Lobby} />
        <Route exact path="/role" component={Role} />
      </Switch>
    </Router>
  );
}

export default App;
