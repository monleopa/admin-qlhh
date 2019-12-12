import React, { Component } from 'react'
import API from '../../API/define-api'
import Axios from 'axios'
import './order-detail.styles.scss'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class OrderDetail extends Component {
  constructor() {
    super();

    this.state = {
      order: {},
      listOrderDetail: [],
      totalProduct: 0,
      currentListOrderDetail: [],
      listDeliver: [],
      StaffID: null,
      Delivery: null,
    }
  }

  componentDidMount = () => {
    var me = this;
    var link = API.base + this.props.match.location.pathname;
    Axios.get(link).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          var data = res.data.data;
          this.setState({
            order: data,
            listOrderDetail: data.listOrderDetail,
          })

        } else {
          alert("error");
        }
      }
    });

    Axios.get(API.getShipper).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            listDeliver: res.data.data,
            StaffID: res.data.data[0].staffID
          })
        }
        else {
          alert("error");
        }
      }
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  processOrder = () => {
    var data = {
      StaffID: this.state.StaffID,
      OrderID: this.state.order.orderID,
      Delivery: this.state.Delivery,
    }

    Axios.post(API.processOrder, data).then(res => {
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

  handleChangeToDate = (e) => {
    this.setState({
      Delivery: e,
    })
  }

  render() {
    this.user = this.props.user;
    const { order, listOrderDetail } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <table className="table table-order">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Size</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {
                  (listOrderDetail.map(
                    item => (
                      <tr key={item.orderDetailID}>
                        <td>
                          <div>
                            <div
                              className='image'
                              style={{
                                backgroundImage: `url(${item.itemImage})`
                              }}
                            />
                            <div className="text-center"><b>{item.itemName}</b></div>
                          </div>
                        </td>
                        <td className="text-center">{item.size}</td>
                        <td>
                          <div className="d-flex">
                            <input className="center-vertical form-control quantity-size" name="quantity"
                              data={item.orderDetailID} value={item.quantity}
                              disabled />
                          </div>
                        </td>
                        <td className="price-number">{item.price}$</td>
                      </tr>
                    )
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="col-md-3 fix-order-container">
            {
              this.state.errorrStartOrder ?
                <div className="row error">
                  {this.state.errorrStartOrder}
                </div>
                : null
            }
            <div className="row total-size text-left">
              Total Products:
              <span className="price-number total-size total-amount"> {order.productAmount ? order.productAmount : 0} $</span>
            </div>
            <div className="row total-size text-left">
              Discount:
              <span className="price-number total-size total-amount">
                {
                  order.productAmount - this.state.order.totalAmount
                } $
              </span>
            </div>

            <hr />

            <div className="row">
              <b>Total Amount:</b>
              <span className="price-number total-size total-amount"><b> {this.state.order.totalAmount} $</b></span>
            </div>

            <div className="row">
              Choose Deliver:
              <select className="form-control" name="StaffID" onChange={this.handleChange}>
                {
                  this.state.listDeliver.length < 0 ? null :
                    this.state.listDeliver.map(
                      shipper =>
                        (<option key={shipper.staffID} label={shipper.firstName + " " + shipper.lastName}>{shipper.staffID}</option>)
                    )
                }
              </select>
            </div>

            <div className="row">
              Date delivery:
              <DatePicker
                selected={this.state.Delivery}
                name="FromDate"
                onChange={date => this.handleChangeToDate(date)}
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy"
                className="form-control fix-date"
              />
            </div>

            <div className="row"><button className="form-control btn btn-success" onClick={this.processOrder}>PROCESS</button></div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderDetail;