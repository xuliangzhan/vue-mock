<template>
  <div
    class="home"
    v-loading="loading">
    <el-table
      :data="list"
      stripe
      border
      height="534"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="describe"
        label="说明"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRowEvent(scope.row)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
      XEAjax.getJSON('/api/role/list').then(data => {
        this.list = data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    deleteRowEvent (row) {
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
          this.list = this.list.filter(item => item !== row)
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
    }
  }
}
</script>
