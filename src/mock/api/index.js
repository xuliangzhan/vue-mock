import XEUtils from 'xe-utils'
import { template, DELETE, GET } from 'xe-ajax-mock'

function removeByPathVariable (list, key) {
  return function (request, response, { pathVariable }) {
    let index = XEUtils.findIndexOf(list, item => item[key] !== pathVariable[key])
    response.body = XEUtils.remove(list, index)
    return response
  }
}

// role api
let ruleList = template(require('./role/list.json'))
DELETE('/api/role/delete/{id}', removeByPathVariable(ruleList, 'id'))
GET('/api/role/list', ruleList)
GET('/api/role/page/list/{pageSize}/{currentPage}', require('./role/page.json'))

// user api
let userList = template(require('./user/list.json'))
DELETE('/api/user/delete/{id}', removeByPathVariable(userList, 'id'))
GET('/api/user/list', userList)
GET('/api/user/page/list/{pageSize}/{currentPage}', require('./user/page.json'))
