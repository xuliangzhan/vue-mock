import Vue from 'vue'
import {
  VXETable,
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  Toolbar,
  Pager,
  Button
} from 'vxe-table'
import zhCNLocat from 'vxe-table/lib/locale/lang/zh-CN'

VXETable.setup({
  i18n: (key, value) => VXETable.t(zhCNLocat, key)
})

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TableHeader)
Vue.use(TableBody)
Vue.use(Toolbar)
Vue.use(Pager)
Vue.use(Button)
