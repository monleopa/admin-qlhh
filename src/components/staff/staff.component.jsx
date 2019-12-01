import React, { Component } from 'react'
import StaffRow from '../staff-row/staff-row.compnent'

export default class Staff extends Component {
  constructor() {
    super()

    this.state = {
      isLoaded: false,

      Staffs: [],
      FirstName: "",
      LastName: "",
      Address: "",
      Mobile: "",
      Username: "",
      Password: "",
      StaffCode: "",
      StaffTypeID: 0,
      StaffID: "",
      isAdding: false,
      warnning: null,

      ListStaffTypes: [
        {
          staffTypeID: 0,
          staffTypeName: "None"
        },
        {
          staffTypeID: 1,
          staffTypeName: "Shipper"
        },
        {
          staffTypeID: 2,
          staffTypeName: "Not A Shipper"
        },
      ],

      ShowStaffTypeID: 0,
    }
  }

  showAdding = () => {
    this.setState({ isAdding: true })
  }

  cancelAdding = () => {
    this.setState({isAdding: false})
  }

  componentDidMount = () => {
    this.setState({ isLoaded: true })
  }

  deleteStaff = (staffCode) => {
    let newStaffs = [];
    this.state.Staffs.forEach(staff => {
      if (staff.staffCode != staffCode) {
        newStaffs.push(staff)
      }
    })

    console.log(newStaffs)

    this.setState({ Staffs: newStaffs })
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  addStaff = (e) => {
    e.preventDefault();
    let { Staffs } = this.state;
    const { warnning, FirstName, LastName, Username, Password, Mobile, Address, StaffTypeID, StaffCode, ListStaffTypes } = this.state

    let saveStaffType = null;

    ListStaffTypes.forEach(staffType => {
      if (staffType.staffTypeID == StaffTypeID) {
        saveStaffType = staffType;
      }
    })

    Staffs.push({
      staffCode: StaffCode,
      firstName: FirstName,
      lastName: LastName,
      username: Username,
      password: Password,
      mobile: Mobile,
      address: Address,
      staffType: saveStaffType,
      staffCode: StaffCode
    })

    this.setState({
      FirstName: "",
      LastName: "",
      Address: "",
      Mobile: "",
      Username: "",
      Password: "",
      StaffCode: "",
      StaffTypeID: 0,
      StaffID: "",
      isAdding: false,
      warnning: null,
    });
  }

  render() {
    const { isAdding, isLoaded } = this.state;

    if (!isLoaded) {
      return (
        <div className="container main">Loading</div>
      )
    }

    const displayStaffTypeList = this.state.ListStaffTypes.map(staffType => (
      <option key={staffType.staffTypeID} label={staffType.staffTypeName} >{staffType.staffTypeID}</option>
    ))

    if (isAdding) {
      const { warnning, FirstName, LastName, Username, Password, Mobile, Address, StaffTypeID, StaffCode } = this.state
      return (
        <div className="container main">
          <form onSubmit={this.addStaff}>
            <h5>Add Staff</h5>
            {warnning ? <p className="warn">{warnning}</p> : null}
            <div className="form-group">
              <label htmlFor="StaffCode">StaffCode:</label>
              <input
                type="text"
                className="form-control"
                id="StaffCode"
                name="StaffCode"
                onChange={this.handleChange}
                value={StaffCode}
                required />
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="FirstName">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="FirstName"
                  name="FirstName"
                  onChange={this.handleChange}
                  value={FirstName}
                  required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="LastName">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="LastName"
                  name="LastName"
                  onChange={this.handleChange}
                  value={LastName}
                  required />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="Username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Username"
                  name="Username"
                  onChange={this.handleChange}
                  value={Username}
                  required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Password">Password:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Password"
                  name="Password"
                  onChange={this.handleChange}
                  value={Password}
                  required />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="Mobile">Mobile:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Mobile"
                  name="Mobile"
                  onChange={this.handleChange}
                  value={Mobile}
                  required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Address">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Address"
                  name="Address"
                  onChange={this.handleChange}
                  value={Address}
                  required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="StaffTypeID">Staff Type:</label>
              <select className="form-control" id="StaffTypeID" name="StaffTypeID" onChange={this.handleChange} 
                value={StaffTypeID}>
                {displayStaffTypeList}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-add">Add</button>
            <button type="button" className="btn btn-danger btn-cancel" onClick={this.cancelAdding}>Cancel</button>
          
          </form>
        </div>
      )
    }

    const { Staffs } = this.state;

    const displayList = Staffs.map(staff => (<StaffRow key={staff.staffID} staff={staff} deleteStaff={this.deleteStaff} />))


    return (
      <div className="container main">
        <h4>STAFF MANAGEMENT</h4><br />

        <div className="row">
          <form className="input-group mb-3 col-sm-11" onSubmit={this.search}>
            <input type="text" className="form-control" name="search" placeholder="Search" onChange={this.handleChange} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">Go</button>
            </div>
          </form>
          <div className="input-group mb-3 col-sm-1">
            <button className="btn btn-primary add" onClick={this.showAdding}>+</button>
          </div>
        </div>
        <br />

        <div className="form-group">
          <label htmlFor="ShowStaffTypeID">Staff Type:</label>
          <select className="form-control" id="ShowStaffTypeID" name="ShowStaffTypeID" onChange={this.handleChange} >
            {displayStaffTypeList}
          </select>
        </div>

        <h5>List Item</h5>
        <table className="table table-category">
          <thead>
            <tr>
              <th>Staff Code</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Mobile</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayList}
          </tbody>
        </table>
      </div>
    )
  }
}
