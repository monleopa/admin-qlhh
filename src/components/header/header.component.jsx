import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './header.styles.scss'

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          <div className="logo bg-dark">
            NDANH
          </div>
        </Link>


        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/staff"><b>STAFF</b></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/"><b>ITEM</b></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/category"><b>CATEGORY</b></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/order"><b>ORDER</b></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/discount"><b>DISCOUNT</b></Link>
            </li>
          </ul>
          <span className="fix-signin btn-sign-in">
            <button className="btn btn-dark" onClick={this.onSignIn}>LOG OUT</button>
          </span>
        </div>
      </nav>
    )
  }
}
