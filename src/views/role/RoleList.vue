<template>
  <div
    class="home"
    v-loading="loading">

    <el-button size="mini" @click="deleteListEvent()">删除选中</el-button>

    <elx-table
      :data="list"
      stripe
      border
      size="small"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <elx-table-column
        type="selection"
        width="55">
      </elx-table-column>
      <elx-table-column
        prop="id"
        label="ID"
        width="80">
      </elx-table-column>
      <elx-table-column
        prop="name"
        label="角色名称"
        show-overflow-tooltip>
      </elx-table-column>
      <elx-table-column
        prop="createDate"
        label="创建日期"
        :formatter="formatColumnDate">
      </elx-table-column>
      <elx-table-column
        prop="updateTime"
        label="最后更新时间"
        :formatter="formatColumnDate">
      </elx-table-column>
      <elx-table-column
        prop="describe"
        label="说明"
        show-overflow-tooltip>
      </elx-table-column>
      <elx-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteEvent(scope.row)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </elx-table-column>
    </elx-table>
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
      XEAjax.getJSON('/api/role/list').then(data => {
        this.list = data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    formatColumnDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteEvent (row) {
      MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        XEAjax.deleteJSON(`/api/role/delete/${row.id}`).then(data => {
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
    },
    deleteListEvent () {
      if (this.multipleSelection.length) {
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          XEAjax.postJSON('/api/role/save', { removeRecords: this.multipleSelection }).then(data => {
            Message({
              type: 'success',
              message: '删除成功!'
            })
            this.list = this.list.filter(item => !this.multipleSelection.includes(item))
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
