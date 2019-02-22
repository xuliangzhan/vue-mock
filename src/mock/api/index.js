import XEUtils from 'xe-utils'
import { template, DELETE, POST, GET } from 'xe-ajax-mock'

var idIndex = 10000

function sortList (list) {
  return XEUtils.sortBy(list, 'updateTime').reverse()
}

// 删除单条
function removeByPathVariable (list, itemKey) {
  return function (request, response, { pathVariable }) {
    let rest = []
    if (pathVariable) {
      rest = XEUtils.remove(list, item => item[itemKey] === pathVariable[itemKey])
    }
    response.body = rest
    return response
  }
}

// 批量删除
function removeListByBody (list, itemKey) {
  return function (request, response) {
    let rest = []
    if (request.body) {
      let removeRecords = request.body.removeRecords
      rest = XEUtils.remove(list, item => removeRecords.some(row => row[itemKey] === item[itemKey]))
    }
    response.body = rest
    return response
  }
}

// 批量更新
function updateListByBody (list, itemKey) {
  return function (request, response) {
    let rest = []
    if (request.body) {
      let updateRecords = request.body.updateRecords
      updateRecords.forEach(data => {
        let item = list.find(item => item[itemKey] === data[itemKey])
        if (item) {
          XEUtils.destructuring(item, data, { updateTime: Date.now() })
          rest.push(item)
        }
      })
    }
    response.body = rest
    return response
  }
}

// 批量保存
function saveListByBody (list, itemKey) {
  return function (request, response) {
    let updateRest = []
    let removeRest = []
    if (request.body) {
      let updateTime = Date.now()
      let updateRecords = request.body.updateRecords
      let removeRecords = request.body.removeRecords
      let insertRecords = request.body.insertRecords
      removeRest = XEUtils.remove(list, item => removeRecords.some(row => row[itemKey] === item[itemKey]))
      updateRecords.forEach(data => {
        let item = list.find(item => item[itemKey] === data[itemKey])
        if (item) {
          XEUtils.destructuring(item, data, { updateTime })
          updateRest.push(item)
        }
      })
      insertRecords.forEach(data => {
        list.push(Object.assign({}, data, { [itemKey]: idIndex++, updateTime, createDate: updateTime }))
      })
    }
    response.body = { updateRest, removeRest }
    return response
  }
}

// 处理分页
function getPageList (list, propSize, propCurrent) {
  return function (request, response, { pathVariable }) {
    let pageSize = 10
    let currentPage = 1
    let totalResult = list.length
    let rest = []
    if (pathVariable) {
      pageSize = XEUtils.toNumber(pathVariable[propSize])
      currentPage = XEUtils.toNumber(pathVariable[propCurrent])
      rest = sortList(list).slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
    response.body = {
      page: { pageSize, currentPage, totalResult },
      result: rest
    }
    return response
  }
}

// role api
let ruleList = template(require('./role/list.json'))
DELETE('/api/role/delete/{id}', removeByPathVariable(ruleList, 'id'))
POST('/api/role/delete', removeListByBody(ruleList, 'id'))
POST('/api/role/update', updateListByBody(ruleList, 'id'))
POST('/api/role/save', saveListByBody(ruleList, 'id'))
GET('/api/role/list', request => sortList(ruleList).slice(0, 10))
GET('/api/role/page/list/{pageSize}/{currentPage}', getPageList(ruleList, 'pageSize', 'currentPage'))

// user api
let userList = template(require('./user/list.json'))
DELETE('/api/user/delete/{id}', removeByPathVariable(userList, 'id'))
POST('/api/user/delete', removeListByBody(userList, 'id'))
POST('/api/user/update', updateListByBody(userList, 'id'))
POST('/api/user/save', saveListByBody(userList, 'id'))
GET('/api/user/list', request => sortList(userList).slice(0, 10))
GET('/api/user/page/list/{pageSize}/{currentPage}', getPageList(userList, 'pageSize', 'currentPage'))
