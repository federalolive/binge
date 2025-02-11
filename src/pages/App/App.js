import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import './App.css';
import NavBar from '../../components/NavBar/NavBar';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import authService from '../../services/authService';
import Landing from '../Landing/Landing'
import AddMovie from '../AddMovie/AddMovie'
import * as movieAPI from '../../services/movies-api'

class App extends Component {
  state = {
    movies: [],
    user: authService.getUser()
  }

  handleLogout = () => {
    authService.logout();
    this.setState({ user: null });
  }

  handleSignupOrLogin = () => {
    this.setState({user: authService.getUser()});
  }

  handleAddMovie = async newMovieData => {
    const newMovie = await movieAPI.create(newMovieData);
    newMovie.addedBy = {name: this.state.user.name, _id: this.state.user._id}
    this.setState(state => ({
      movies: [...state.movies, newMovie]
    }), () => this.props.history.push('/movies'));
  }

  render () {
    return (
      <>
        <NavBar 
          user={this.state.user}
          handleLogout={this.handleLogout}
        />
        <Route exact path='/' render={() =>
          <Landing />
        }/>
        <Route exact path='/signup' render={({ history }) => 
          <Signup
            history={history}
            handleSignupOrLogin={this.handleSignupOrLogin}
          />
        }/>
        <Route exact path='/login' render={({ history }) => 
          <Login
            history={history}
            handleSignupOrLogin={this.handleSignupOrLogin}
          />
        }/>
        <Route
          exact path='/movies/add'
          render={() =>
          authService.getUser() ?
          <AddMovie
            handleAddMovie = {this.handleAddMovie}
            user= {this.state.user}
          />
          :
          <Redirect to='/login' />
          }

        />
      </>
    );
  }
}

export default App;
