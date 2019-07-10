<template>
  <div class="home">

    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button @click="deleteListEvent()">删除选中</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      stripe
      border
      highlight-hover-row
      ref="xTable"
      :data="list">
      <vxe-table-column
        type="selection"
        width="55">
      </vxe-table-column>
      <vxe-table-column
        field="id"
        title="ID"
        width="80">
      </vxe-table-column>
      <vxe-table-column
        field="name"
        title="姓名"
        show-overflow>
      </vxe-table-column>
      <vxe-table-column
        field="age"
        title="年龄">
      </vxe-table-column>
      <vxe-table-column
        field="email"
        title="邮箱">
      </vxe-table-column>
      <vxe-table-column
        field="createTime"
        title="创建日期"
        :formatter="formatColumnDate">
      </vxe-table-column>
      <vxe-table-column
        field="updateTime"
        title="最后更新时间"
        :formatter="formatColumnDate">
      </vxe-table-column>
      <vxe-table-column
        field="describe"
        title="备注"
        show-overflow>
      </vxe-table-column>
      <vxe-table-column
        fixed="right"
        title="操作"
        width="120">
        <template slot-scope="scope">
          <vxe-button @click="deleteEvent(scope.row)">删除</vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import XEAjax from 'xe-ajax'
import { MessageBox, Message } from 'element-ui'

export default {
  data () {
    return {
      loading: false,
      list: []
    }
  },
  created () {
    this.findList()
  },
  methods: {
    findList () {
      this.loading = true
      XEAjax.getJSON('/api/user/list').then(data => {
        this.list = data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    formatColumnDate ({ row, column, cellValue }) {
      return XEUtils.toDateString(cellValue)
    },
    deleteEvent (row) {
      MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        XEAjax.deleteJSON(`/api/user/delete/${row.id}`).then(data => {
          Message({
            type: 'success',
            message: '删除成功!'
          })
          this.loading = false
          this.findList()
        }).catch(e => {
          this.loading = false
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteListEvent () {
      let selection = this.$refs.xTable.getSelectRecords()
      if (selection.length) {
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          XEAjax.postJSON('/api/user/save', { removeRecords: selection }).then(data => {
            Message({
              type: 'success',
              message: '删除成功!'
            })
            this.findList()
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        Message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    }
  }
}
</script>
