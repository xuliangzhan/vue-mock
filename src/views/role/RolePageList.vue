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
    </el-table>

    <el-pagination
      class="my-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageVO.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageVO.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageVO.totalResult">
    </el-pagination>
  </div>
</template>

<script>
import XEAjax from 'xe-ajax'

export default {
  data () {
    return {
      loading: false,
      list: [],
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  },
  created () {
    this.findList()
  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
    findList () {
      this.loading = true
      XEAjax.getJSON(`/api/role/page/list/${this.pageVO.pageSize}/${this.pageVO.currentPage}`).then(({ page, result }) => {
        this.pageVO.totalResult = page.totalResult
        this.list = result
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
