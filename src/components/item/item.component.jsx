import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../API/define-api'
import './item.styles.scss';
import ItemDetail from '../item-detail/item-detail.component';

export default class Item extends Component {
  constructor() {
    super()

    this.state = {
      Items: [],
      search: "",
      isLoaded: false,
      isAdding: false,
      isAddingDetail: false,
      ItemName: "",
      ItemCode: "",
      ItemImage: "",
      CategoryID: 0,
      ItemPrice: 0,
      SupplierID: 0,
      CategoriesList: [
        {
          categoryID: 1,
          categoryName: "Shirt"
        },
        {
          categoryID: 2,
          categoryName: "Pants"
        },
        {
          categoryID: 3,
          categoryName: "Dress"
        },
        {
          categoryID: 4,
          categoryName: "Coat"
        },
      ],
      SuppliersList: [
        {
          supplierID: 0,
          supplierName: "None"
        },
        {
          supplierID: 1,
          supplierName: "Vic"
        },
        {
          supplierID: 2,
          supplierName: "Supreme"
        },
        {
          supplierID: 3,
          supplierName: "H&M"
        },
        {
          supplierID: 4,
          supplierName: "Canifa"
        },
      ],
      ItemDetails: [],
      Size: "",
      Quantity: "",
      ShowCategory: 0,
      warnning: null,
    }
  }

  componentDidMount = () => {
    Axios.get(API.listitem).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            Items: res.data.data
          })
        }
      }
    });
    this.setState({
      isLoaded: true
    })

    Axios.get(API.category).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            CategoriesList: res.data.data,
            CategoryID: res.data.data[0].categoryID,
            CategoryName: res.data.data[0].categoryName
          })
        }
      } else {
        this.setState({
          isLoaded: true
        })
      }

    })

    Axios.get(API.supplier).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          this.setState({
            SuppliersList: res.data.data,
            SupplierID: res.data.data[0].supplierID
          })
        }
      } else {
        this.setState({
          isLoaded: true
        })
      }

    })
  }

  showAdding = () => {
    this.setState({ isAdding: true })
  }

  cancelAdding = () => {
    this.setState({ isAdding: false })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    var value = e.target.value;
    if (e.target.name == "CategoryID") {
      var a = this.state.CategoriesList.filter(function (e) {
        return e.categoryID == value
      });

      this.setState({
        CategoryName: a[0].categoryName,
      })
    }
    if (e.target.name == "SupplierID") {
      var a = this.state.SuppliersList.filter(function (e) {
        return e.supplierID == value
      });

      this.setState({
        SupplierName: a[0].supplierName,
      })
    }
  }

  deleteDetail = (Size) => {
    let newListItemDetails = [];

    this.state.ItemDetails.forEach(detail => {
      if (detail.Size != Size)
        newListItemDetails.push(detail);
    })

    console.log(newListItemDetails);

    this.setState({
      ItemDetails: newListItemDetails
    })
  }

  newDetail = () => {
    const { ItemDetails, Size, Quantity } = this.state;
    let check = false;
    let quanNum = parseInt(Quantity);

    if (!quanNum) {
      alert('Quantity must be a number');
      return;
    }

    if (!Size) {
      alert('Size not null');
      return;
    }

    let newItemDetail = ItemDetails.map(detail => {
      if (detail.Size == Size) {
        check = true;
        return {
          Size,
          Quantity: detail.Quantity + quanNum
        }
      }

      else return detail;
    })

    if (!check)
      newItemDetail.push({ Size, Quantity: quanNum })

    this.setState({
      ItemDetails: newItemDetail,
      Size: "",
      Quantity: ""
    })
  }

  cancelAddingDetail = () => {
    this.setState({ isAddingDetail: false })
  }

  addItem = (e) => {
    e.preventDefault();
    let { Items, ItemCode, SupplierName, ItemDetails, ItemName, ItemPrice, ItemImage, CategoryID, SupplierID, CategoryName, Description } = this.state;

    var data = {
      ItemName: ItemName,
      ItemCode: ItemCode,
      Price: ItemPrice,
      ItemImage: ItemImage,
      CategoryID: CategoryID,
      SupplierID: SupplierID,
      ListItemDetail: ItemDetails,
      Description: Description,
    }

    console.log(data);


    if (ItemDetails.length == 0) {
      this.setState({ warnning: "You must add at least one item detail" })
      return;
    }

    Axios.post(API.addItem, data).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          Items.push({
            itemID: res.data.data,
            itemCode: ItemCode,
            itemName: ItemName,
            itemDetails: ItemDetails,
            price: ItemPrice,
            categoryID: CategoryID,
            supplierID: SupplierID,
            itemImage: ItemImage,
            categoryName: CategoryName,
            supplierName: SupplierName
          });

          var supplierIDnew = this.state.SuppliersList[0].supplierID;
          var categoryIDnew = this.state.CategoriesList[0].categoryID;

          this.setState({
            isAdding: false,
            ItemName: "",
            ItemCode: "",
            ItemImage: "",
            CategoryID: categoryIDnew,
            ItemPrice: 0,
            SupplierID: supplierIDnew,
            ItemDetails: [],
            warnning: null
          })
        }
      }
    });
  }

  render() {
    const { Items, isLoaded, isAdding, CategoriesList, SuppliersList, ItemDetails, warnning } = this.state

    const displayListCategories = CategoriesList.map(cat => (
      <option key={cat.categoryID} label={cat.categoryName} >{cat.categoryID}</option>
    ))

    const displayListSuppliers = SuppliersList.map(sup => (
      <option key={sup.supplierID} label={sup.supplierName} >{sup.supplierID}</option>
    ))

    if (!isLoaded) {
      return <p>Loading...</p>
    }

    if (isAdding) {

      const displayListItemDetails = ItemDetails.map(detail => (
        <ItemDetail key={detail.Size} detail={detail} deleteDetail={this.deleteDetail} />
      ))

      return (
        <div className="container main dialog-item">
          <form onSubmit={this.addItem}>
            <h5>Add item</h5>
            {warnning ? <p className="warn">{warnning}</p> : null}
            <div className="form-group">
              <label htmlFor="ItemName">Item Name:</label>
              <input
                type="text"
                className="form-control"
                id="ItemName"
                name="ItemName"
                onChange={this.handleChange}
                value={this.state.ItemName}
                required />
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="ItemCode">Item Code:</label>
                <input
                  type="text"
                  className="form-control"
                  id="ItemCode"
                  name="ItemCode"
                  onChange={this.handleChange}
                  value={this.state.ItemCode}
                  required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="ItemPrice">Item Price:</label>
                <input
                  type="text"
                  className="form-control"
                  id="ItemPrice"
                  name="ItemPrice"
                  onChange={this.handleChange}
                  value={this.state.ItemPrice}
                  required />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="CategoryID">Category:</label>
                <select
                  className="form-control"
                  id="CategoryID"
                  name="CategoryID"
                  onChange={this.handleChange}
                  value={this.state.CategoryID}
                >
                  {displayListCategories}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="SupplierID">Branch:</label>
                <select
                  className="form-control"
                  id="SupplierID"
                  name="SupplierID"
                  onChange={this.handleChange}
                  value={this.state.SupplierID}
                >
                  {displayListSuppliers}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="ItemImage">Item Image:</label>
              <input type="text" className="form-control" id="ItemImage" name="ItemImage" onChange={this.handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="ItemImage">Description:</label>
              <input type="text" className="form-control" id="Description" name="Description" onChange={this.handleChange} />
            </div>
            <p>Detail</p>
            <div className="row">
              <div className="form-group col-md-5">
                <input
                  type="text"
                  className="form-control"
                  id="Size" name="Size"
                  placeholder="Detail Size"
                  value={this.state.Size}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group col-md-5">
                <input
                  type="text"
                  className="form-control"
                  id="Quantity"
                  name="Quantity"
                  placeholder="Detail Quantity"
                  value={this.state.Quantity}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary add-detail" onClick={this.newDetail}>+</button>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {displayListItemDetails}
              </tbody>
            </table>
            <button type="submit" className="btn btn-primary btn-add">Add</button>
            <button type="button" className="btn btn-danger btn-cancel" onClick={this.cancelAdding}>Cancel</button>
          </form>
        </div>
      )
    }

    const displayList = Items.map(item => (
      <tr key={item.itemID}>
        <td><div
          className='image'
          style={{
            backgroundImage: `url(${item.itemImage})`
          }}
        />
        </td>
        <td><span className="center-vertical">{item.itemCode}</span></td>
        <td><span className="center-vertical">{item.itemName}</span></td>
        <td><span className="center-vertical">{item.price}$</span></td>
        <td><span className="center-vertical">{item.categoryName}</span></td>
        <td><span className="center-vertical">{item.supplierName}</span></td>
        <td>
          <span className="center-vertical">
            <span className="fix-size"><i className="far fa-edit btn-edit"></i></span>
            <span className="fix-size"><i className="fas fa-trash-alt btn-delete"></i></span>
          </span>
        </td>
      </tr>
    ))

    return (
      <div className="container main">
        <h4>ITEM MANAGEMENT</h4>

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

        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="form-group">
              <label htmlFor="ShowCategory">Category:</label>
              <select className="form-control" id="ShowCategory" name="ShowCategory" onChange={this.handleChange} >
                {displayListCategories}
              </select>
            </div>
            <div className="form-group margin-left-20">
              <label htmlFor="showBranch">Branch:</label>
              <select className="form-control" id="showBranch" name="showBranch" onChange={this.handleChange} >
                {displayListSuppliers}
              </select>
            </div>
          </div>
        </div>
        <h5>List Item</h5>
        <table className="table table-item">
          <thead>
            <tr>
              <th className="row-img">Image</th>
              <th>Code</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Category</th>
              <th className="row-supplier">Supplier</th>
              <th className="row-other"></th>
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
