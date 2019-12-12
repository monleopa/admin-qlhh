import React, { Component } from 'react';
import './App.css';
import Header from './components/header/header.component';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Axios from "axios";
import Login from './components/login/login.component';
import { withCookies } from "react-cookie";
import API from "./API/define-api";
import Item from "./components/item/item.component";
import Category from './components/category/category.component';
import Discount from './components/discount/discount.component';
import Staff from './components/staff/staff.component';
import Order from './components/order/order.component';
import OrderDetail from './components/order-detail/order-detail.component';

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null
    }
  }

  componentDidMount = () => {
    const { cookies } = this.props;
    const user = cookies.cookies.user;

    if (user) {
      Axios.post(API.checklogin, JSON.parse(user)).then(res => {
        if (res.status === 200) {
          if (res.data.data) {
            this.setState({
              user: JSON.parse(user)
            });
          } else {
            console.log(res.data.data)
          }
        }
      });
    }
  }

  login = async (user) => {
    if (user) {
      return await Axios.post(API.login, user).then(res => {
        if (res.status === 200) {
          if (res.data.success) {
            this.props.cookies.set('user', user);
            this.setState({
              user
            });
            return true;
          } else {
            console.log(res.data.data);
            return false;
          }
        }

        else return false;
      });
    }

    else return false;
  }

  render() {
    const { user } = {
      user: {
        username: 'admin',
        password: '123456',
      }
    }

    if (!user) {
      return (
        <div className="container">
          <Login login={this.login} />
        </div>
      )
    }
    else {
      return (
        <BrowserRouter>
          <div className="App">
            <Header />

            <Switch>
              <Route
                path="/staff"
                render={(props) => <Staff />}
              />
              <Route
                path="/category"
                render={(props) => <Category />}
              />
              <Route
                path="/discount"
                render={(props) => <Discount />}
              />
              <Route
                path="/order"
                render={(props) => <Order />}
              />
              <Route
                path="/orderdetail"
                render={(props) => <OrderDetail match={props}/>}
              />
              <Route
                path="/"
                render={(props) => <Item />}
              />

            </Switch>
          </div>
        </BrowserRouter>
      )
    }

  };
}

export default withCookies(App);
