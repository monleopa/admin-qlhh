var APILink = "http://localhost:55244/api/"

var API = {
  base: APILink + "admin",
  login: APILink + "admin/login",
  listitem: APILink + "item",
  category: APILink + "item/category",
  supplier: APILink + "item/supplier",
  addCategory: APILink + "admin/category",
  salecode: APILink + "item/salecode",
  addSalecode: APILink + "admin/salecode",
  addItem: APILink + "admin/item",
  addStaff: APILink + "admin/staff",
  getStaff: APILink + "admin/staff",
  getOrder: APILink + "admin/order/",
  getOrdeDetail: APILink + "admin/orderdetail/",
  getShipper: APILink + "admin/shipper",
  processOrder: APILink + "admin/processorder",
  updateOrder: APILink + "admin/updateorder",
  filterItem: APILink + "admin/item/",
  cancelorder: APILink + "order/cancel"
}

export default API