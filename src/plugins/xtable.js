import Vue from 'vue'
// import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
// import 'vxe-table/lib/index.css'

import {
  VXETable,
  Table,
  Column,
  Header,
  Body,
  Icon,
  Loading,
  Toolbar,
  Export,
  Pager,
  Button,
  Checkbox
} from 'vxe-table'
import zhCNLocat from 'vxe-table/lib/locale/lang/zh-CN'

VXETable.setup({
  i18n: (key, value) => VXETable.t(zhCNLocat, key)
})

Vue.use(Table)
Vue.use(Column)
Vue.use(Header)
Vue.use(Body)
Vue.use(Icon)
Vue.use(Loading)
Vue.use(Toolbar)
Vue.use(Export)
Vue.use(Pager)
Vue.use(Button)
Vue.use(Checkbox)

// Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
