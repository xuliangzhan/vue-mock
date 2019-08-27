import Vue from 'vue'
// import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import VXETablePluginCharts from 'vxe-table-plugin-charts'
import 'vxe-table-plugin-element/dist/style.css'
import 'vxe-table-plugin-charts/dist/style.css'
// import 'vxe-table/lib/index.css'

import {
  VXETable,
  Table,
  Column,
  Header,
  Body,
  Icon,
  Menu,
  Loading,
  Toolbar,
  Export,
  Pager,
  Button,
  Modal,
  Keyboard,
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
Vue.use(Menu)
Vue.use(Loading)
Vue.use(Toolbar)
Vue.use(Export)
Vue.use(Pager)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Modal)
Vue.use(Keyboard)

// Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
VXETable.use(VXETablePluginCharts)
