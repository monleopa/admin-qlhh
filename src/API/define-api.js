var APILink = "http://localhost:55244/api/"

var API = {
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
}

export default API