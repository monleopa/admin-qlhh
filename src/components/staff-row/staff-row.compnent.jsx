import React, { Component } from 'react'

export default class StaffRow extends Component {
  deleteStaff = () => {
    this.props.deleteStaff(this.props.staff.staffCode)
  }

  render() {
    const { staff } = this.props;
    return (
      <tr>
        <td>{staff.staffCode}</td>
        <td>{staff.firstName + " " + staff.lastName}</td>
        <td>{staff.username}</td>
        <td>{staff.mobile}</td>
        <td>{staff.staffTypeName}</td>
        <td>
          <span className="fix-size"><i className="far fa-edit btn-edit"></i></span>
          <span className="fix-size"><i className="fas fa-trash-alt btn-delete" onClick={this.deleteStaff}></i></span>
        </td>
      </tr>
    )
  }
}
