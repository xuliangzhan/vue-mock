<template>
  <div
    class="home"
    v-loading="loading">
    <el-table
      :data="list"
      stripe
      border
      height="400"
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
    </el-table>
  </div>
</template>

<script>
import XEAjax from 'xe-ajax'

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
    }
  }
}
</script>
