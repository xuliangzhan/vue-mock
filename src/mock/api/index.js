import { template, DELETE, POST, GET } from 'xe-ajax-mock'
import MockUtil from './util'

class RoleVO {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.describe = data.describe
    this.createTime = data.createTime
    this.updateTime = data.updateTime
  }
}
const roleList = template(require('./role/list.json'))
DELETE('/api/role/delete/{id}', MockUtil.deleteByPathVariable(roleList, RoleVO, 'id'))
POST('/api/role/add', MockUtil.insertByBody(roleList, RoleVO, 'id'))
POST('/api/role/update', MockUtil.updateByBody(roleList, RoleVO, 'id'))
POST('/api/role/save', MockUtil.saveListByBody(roleList, RoleVO, 'id'))
GET('/api/role/list', MockUtil.findDescSortList(roleList, RoleVO, ['updateTime'], 10))
GET('/api/role/page/list/{pageSize}/{currentPage}', MockUtil.findDescSortPageList(roleList, RoleVO, ['updateTime']))

class UserVO {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.password = data.password
    this.sex = data.sex
    this.role = data.role
    this.region = data.region
    this.email = data.email
    this.age = data.age
    this.flag = data.flag
    this.describe = data.describe
    this.describe2 = data.describe2
    this.describe3 = data.describe3
    this.createTime = data.createTime
    this.updateTime = data.updateTime
  }
}
const userList = template(require('./user/list.json'))
DELETE('/api/user/delete/{id}', MockUtil.deleteByPathVariable(userList, UserVO, 'id'))
POST('/api/user/add', MockUtil.insertByBody(userList, UserVO, 'id'))
POST('/api/user/update', MockUtil.updateByBody(userList, UserVO, 'id'))
POST('/api/user/save', MockUtil.saveListByBody(userList, UserVO, 'id'))
GET('/api/user/list', MockUtil.findDescSortList(userList, UserVO, ['updateTime'], 10))
GET('/api/user/page/list/{pageSize}/{currentPage}', MockUtil.findDescSortPageList(userList, UserVO, ['updateTime']))
