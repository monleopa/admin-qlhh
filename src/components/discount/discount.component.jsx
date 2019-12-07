import React, { Component, useState } from 'react'
import DateTimePicker from "react-datetime-picker";
import './discount.styles.scss';
import Axios from 'axios';
import API from '../../API/define-api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Discount extends Component {
  constructor() {
    super()

    this.state = {
      Discounts: [],
      isLoaded: false,
      isAdding: false,
      search: "",
      SaleCodeString: "",
      SaleCodeType: 1,
      SaleCodeValue: 0,
      SaleCodeDescription: "",
      FromDate: "",
      ToDate: ""
    }
  }

  componentDidMount = () => {
    this.setState({ isLoaded: true });
    Axios.get(API.salecode).then(res => {
      this.setState({
        isLoaded: false
      })
      if (res.status === 200) {
        if (res.data.success) {
          console.log(res.data)
          this.setState({
            Discounts: res.data.data
          })
        }
      }
    })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleChangeFromDate = (e) => {
    console.log(e);
    this.setState({
      FromDate: e,
    })
  }

  handleChangeToDate = (e) => {
    this.setState({
      ToDate: e,
    })
  }

  showAdding = () => {
    this.setState({ isAdding: true })
  }

  cancelAdding = () => {
    this.setState({ isAdding: false })
  }

  addDiscount = (e) => {
    e.preventDefault();
    var data = {
      SaleCodeString: this.state.SaleCodeString,
      SaleCodeType: this.state.SaleCodeType,
      SaleCodeValue: this.state.SaleCodeValue,
      SaleCodeDescription: this.state.SaleCodeDescription,
      FromDate: this.state.FromDate,
      ToDate: this.state.ToDate,
    }

    console.log(data);

    Axios.post(API.addSalecode, data).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          var newSaleCode = {
            saleCodeString: this.state.SaleCodeString,
            saleCodeType: this.state.SaleCodeType,
            saleCodeValue: this.state.SaleCodeValue,
            saleCodeDescription: this.state.SaleCodeDescription,
            fromDate: this.state.FromDate,
            toDate: this.state.ToDate,
            saleCodeID: res.data.data
          }
        }
        var arr = this.state.Discounts;
        arr.push(newSaleCode)
        this.setState({
          Discounts: arr,
          isAdding: false,
        })
      }
    });
  }

  search = (e) => {
    e.preventDefault();
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

  render() {
    const { isAdding, Discounts, isLoaded } = this.state;
    const displayList = Discounts.map(discount => (
      <tr key={discount.saleCodeID}>
        <td>{discount.saleCodeString}</td>
        <td>{discount.saleCodeType == 1 ? "Discount Percent" : "Discount Cash"}</td>
        <td>{discount.saleCodeValue}{discount.saleCodeType == 1 ? "%" : "$"}</td>
        <td>{discount.saleCodeDescription}</td>
        <td>{this.converDate(discount.fromDate)}</td>
        <td>{this.converDate(discount.toDate)}</td>
        <td>
          <span className="fix-size"><i className="far fa-edit btn-edit"></i></span>
          <span className="fix-size"><i className="fas fa-trash-alt btn-delete"></i></span>
        </td>
      </tr>
    ))

    return (
      <div className="container main">
        <h4>DISCOUNT MANAGE</h4>
        <div className="row">
          <form className="input-group mb-3 col-sm-11" onSubmit={this.search}>
            <input type="text" className="form-control" name="search" placeholder="Search" onChange={this.handleChange} />
            <div className="input-group-append">
              <button className="btn btn-primary z-index-0" type="submit">Go</button>
            </div>
          </form>
          <div className="input-group mb-3 col-sm-1">
            <button className="btn btn-primary add" onClick={this.showAdding}>+</button>
          </div>
        </div>
        <br />
        <h5>List Discounts</h5>
        <table className="table table-category">
          <thead>
            <tr>
              <th>Discount Code</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Description</th>
              <th>From Date</th>
              <th>To Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayList}
          </tbody>
        </table>
        {
          isAdding ? (
            <div>
              <div className="abs-class"></div>
              <div className="dialog-discount">
                <form onSubmit={this.addDiscount}>
                  <h5>Add discount</h5>
                  <div className="form-group">
                    <label htmlFor="SaleCodeString">Sale Code String:</label>
                    <input type="text" className="form-control" id="SaleCodeString" name="SaleCodeString" onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="SaleCodeType">Sale Code Type:</label>
                    <select className="form-control" id="SaleCodeType" name="SaleCodeType" onChange={this.handleChange} >
                      <option label="Discount Percent">1</option>
                      <option label="Discount Cash">2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="SaleCodeValue">Sale Code Value:</label>
                    <input type="text" className="form-control" id="SaleCodeValue" name="SaleCodeValue" onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="SaleCodeDescription">Sale Code Description:</label>
                    <input type="text" className="form-control" id="SaleCodeDescription" name="SaleCodeDescription" onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="label-date" htmlFor="FromDate">Expiry From Date:</label>
                    <DatePicker
                      selected={this.state.FromDate}
                      name="FromDate"
                      onChange={date => this.handleChangeFromDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="form-control fix-date"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-date" htmlFor="ToDate">Expiry To Date:</label>
                    <DatePicker
                      selected={this.state.ToDate}
                      name="FromDate"
                      onChange={date => this.handleChangeToDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="form-control fix-date"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-add">Add</button>
                  <button className="btn btn-danger btn-cancel" onClick={this.cancelAdding}>Cancel</button>
                </form>
              </div>
            </div>
          ) : null
        }
      </div>
    )
  }
}
