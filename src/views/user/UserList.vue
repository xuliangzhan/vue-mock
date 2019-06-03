<template>
  <div class="home">

    <vxe-table-toolbar>
      <template v-slot:buttons>
        <vxe-button @click="deleteListEvent()">删除选中</vxe-button>
      </template>
    </vxe-table-toolbar>

    <vxe-table
      :data="list"
      stripe
      border
      highlight-hover-row
      @select-change="handleSelectionChange">
      <vxe-table-column
        type="selection"
        width="55">
      </vxe-table-column>
      <vxe-table-column
        prop="id"
        label="ID"
        width="80">
      </vxe-table-column>
      <vxe-table-column
        prop="name"
        label="姓名"
        show-overflow>
      </vxe-table-column>
      <vxe-table-column
        prop="age"
        label="年龄">
      </vxe-table-column>
      <vxe-table-column
        prop="email"
        label="邮箱">
      </vxe-table-column>
      <vxe-table-column
        prop="createDate"
        label="创建日期"
        :formatter="formatColumnDate">
      </vxe-table-column>
      <vxe-table-column
        prop="updateTime"
        label="最后更新时间"
        :formatter="formatColumnDate">
      </vxe-table-column>
      <vxe-table-column
        prop="describe"
        label="备注"
        show-overflow>
      </vxe-table-column>
      <vxe-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <button @click.native.prevent="deleteEvent(scope.row)">删除</button>
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
      list: [],
      multipleSelection: []
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
    formatColumnDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue)
    },
    handleSelectionChange ({ selection }) {
      this.multipleSelection = selection
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
      if (this.multipleSelection.length) {
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          XEAjax.postJSON('/api/user/save', { removeRecords: this.multipleSelection }).then(data => {
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
