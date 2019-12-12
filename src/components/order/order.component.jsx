import React, { Component } from 'react'
import './order.styles.scss'
import '../../API/common.js'
import Axios from 'axios'
import API from '../../API/define-api'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Order extends Component {
  constructor() {
    super()

    this.state = {
      Orders: [],
      key: "",
      type: 0,
      ListSatusTypes: [
        {
          type: 0,
          name: "All",
        },
        {
          type: 1,
          name: "Ordered",
        },
        {
          type: 2,
          name: "Processing",
        },
        {
          type: 3,
          name: "Delivery",
        },
        {
          type: 4,
          name: "Done",
        },
        {
          type: 5,
          name: "Canceled",
        },
      ],
      OrderID: null,
    }
  }

  componentDidMount = () => {
    var link = API.getOrder + "/0/null"
    Axios.get(link).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            Orders: res.data.data,
          })
        }
      }
    });
  }

  handleChange = (e) => {
    var label = e.target.name;
    var value = e.target.value;
    this.setState({ [e.target.name]: e.target.value })

    if(label == "type") {
      this.changeType(value);
    } 
  }

  changeType = (value) => {
    var key = this.state.key ? this.state.key : "null";

    var link = API.getOrder + value + "/" + key;
    Axios.get(link).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            Orders: res.data.data,
          })
        }
      }
    });
  }

  changeKey = () => {
    var link = API.getOrder + this.state.type + "/" + this.state.key;
    Axios.get(link).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            Orders: res.data.data,
          })
        }
      }
    });
  }

  search = (e) => {
    e.preventDefault();
    if(!this.state.key) {
      return;
    } else {
      this.changeKey();
    }
  }

  converDate = (date) => {
    var d = new Date(date);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  converStatus = (type) => {
    var status = this.state.ListSatusTypes.filter(function (e, i) {
      return e.type == type
    })

    return status[0].name;
  }

  showReason = (id, e) => {
    this.setState({
      showCancel: true,
      OrderID: id
    })
  }

  viewDetail = (id, e) => {
    window.location.href = "/orderdetail/" + id;
  }

  shipNow = (id, status, e) => {
    var data = {
      OrderID: id,
      Status: status,
    }

    Axios.post(API.updateOrder, data).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          window.location.href = "/order"
        } else {
          alert("Error orrcur");
        }
      } else {
        alert("Error orrcur");
      }
    })
  }

  hideReason = () => {
    this.setState({
      showCancel: false,
    })
  }

  cancelOrder = (e) => {
    e.preventDefault();
    var data = {
      OrderID: this.state.OrderID,
      ReasonCancel: this.state.Reason
    }
    var link = API.cancelorder;
    var me = this;
    Axios.post(link, data).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          var arraOrder = me.state.Orders;
          for (var i = 0; i < arraOrder.length; i++) {
            if (arraOrder[i].orderID === data.OrderID) {
              arraOrder[i].status = 5;
              arraOrder[i].statusName = "Canceled";
              arraOrder[i].reasonCancel = data.ReasonCancel;
            }
          }
          me.setState({
            Orders: arraOrder,
            showCancel: false,
          })
        } else {
          alert("error occurr");
        }
      } else {
        alert("error internet");
      }
    })
  }

  render() {

    const displayStatus = this.state.ListSatusTypes.map(staffType => (
      <option key={staffType.type} label={staffType.name} >{staffType.type}</option>
    ))

    const displayList = this.state.Orders.map(order => (
      <tr key={order.orderID}>
        <td>{order.orderCode}</td>
        <td>{this.converDate(order.orderDate)}</td>
        <td>{order.totalAmount} $</td>
        <td>{order.receiveName}</td>
        <td>{order.receiveMobile}</td>
        <td className={this.converStatus(order.status)}>{this.converStatus(order.status)}</td>
        <td>
          {
            order.status != 5 && order.status != 4  ?
              (
                <div className="float-right">
                  {
                    order.status == 2 ?
                    <span className="ship-order" title="delivery"
                    onClick={this.shipNow.bind(null, order.orderID, 3)}>
                    <i className="fas fa-shipping-fast success"></i>
                    </span> 
                    :
                    null
                  }
                  {
                    order.status == 3 ?
                    <span className="done-order" title="done"
                    onClick={this.shipNow.bind(null, order.orderID, 4)}>
                    <i className="fas fa-clipboard-check"></i>
                    </span> 
                    :
                    null
                  }
                  <span className="view-order" title="process" onClick={this.viewDetail.bind(null, order.orderID)}><i className="fas fa-receipt"></i></span>
                  <span className="cancel-order" title="cancel order"
                    onClick={this.showReason.bind(null, order.orderID)}>
                    <i className="fas fa-window-close"></i>
                  </span>
                </div>
              )
              :
              null
          }
        </td>
      </tr>
    ))

    return (
      <div className="container main">
        <h4>ORDER MANAGEMENT</h4>

        <div className="row">
          <form className="input-group mb-3 col-sm-11" onSubmit={this.search}>
            <input type="text" className="form-control" name="key" placeholder="Search" onChange={this.handleChange} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">Go</button>
            </div>
          </form>
        </div>

        <div className="form-group">
          <label htmlFor="Status">Status:</label>
          <select className="form-control" id="Status" name="type" onChange={this.handleChange}>
            {displayStatus}
          </select>
        </div>

        <h5>List Order</h5>

        <table className="table table-order">
          <thead>
            <tr>
              <th>Order Code</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Receiver Name</th>
              <th>Receiver Mobile</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayList}
          </tbody>
        </table>
        
        {
          !this.state.showCancel ? null :
            <div className="">
              <div className="abs-class"></div>
              <div className="reason-cancel">
                <form onSubmit={this.cancelOrder}>
                  <div className="row">
                    <div className="label"><h4>Reason Cancel:</h4></div>
                    <textarea className="form-control text-area" name="Reason" rows="3"
                      onChange={this.handleChange} required></textarea>
                  </div>
                  <div className="row on-right">
                    <button type="submit" className="btn btn-primary btn-cancel-order">Cancel Order</button>
                    <button type="button" className="btn btn-danger" onClick={this.hideReason}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
        }
      </div>
    )
  }
}