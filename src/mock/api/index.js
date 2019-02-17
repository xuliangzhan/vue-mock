import { GET } from 'xe-ajax-mock'

// role api
GET('/api/role/list', require('./role/list.json'))
GET('/api/role/page/list/{pageSize}/{currentPage}', require('./role/page.json'))

// user api
GET('/api/user/list', require('./user/list.json'))
GET('/api/user/page/list/{pageSize}/{currentPage}', require('./user/page.json'))
