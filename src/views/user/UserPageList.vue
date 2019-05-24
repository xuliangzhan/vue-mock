<template>
  <div class="home">

    <button @click="insertEvent()">新增</button>
    <button @click="pendingRemoveEvent()">标记/取消删除</button>
    <button @click="deleteListEvent()">删除选中</button>
    <button @click="saveEvent()">保存</button>
    <button @click="$refs.xTable.exportCsv({filename: 'user.csv'})">导出数据</button>

    <vxe-table
      ref="xTable"
      class="user-table"
      stripe
      border
      height="444"
      size="small"
      highlight-hover-row
      :loading="loading"
      :data="list"
      :row-class-name="tableRowClassName"
      :edit-config="{trigger: 'click', mode: 'row'}"
      :edit-rules="validRules"
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
        show-overflow
        :edit-render="{name: 'ElInput', attrs: {placeholder: '请输入姓名！'}}">
      </vxe-table-column>
      <vxe-table-column
        prop="age"
        label="年龄"
        align="center"
        :edit-render="{name: 'ElInputNumber', attrs: {placeholder: '请输入年龄！'}}">
      </vxe-table-column>
      <vxe-table-column
        prop="email"
        label="邮箱"
        :edit-render="{name: 'ElInput', attrs: {placeholder: '请输入邮箱！'}}">
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
        show-overflow
        :edit-render="{name: 'ElInput'}">
      </vxe-table-column>
    </vxe-table>

    <vxe-pagination
      class="my-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageVO.currentPage"
      :page-sizes="[5, 10, 15, 20, 50, 100, 200, 500, 1000, 2000, 5000]"
      :page-size="pageVO.pageSize"
      :total="pageVO.totalResult">
    </vxe-pagination>
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
      multipleSelection: [],
      pendingRemoveList: [],
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      validRules: {
        name: [
          { required: true, message: '请写姓名！', trigger: 'change' },
          { max: 30, message: '最多30个字符！', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请写年龄！', trigger: 'change' },
          { type: 'number', min: 18, max: 35, message: '年龄必须在18-35之间！', trigger: 'change' }
        ],
        email: [
          { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '邮箱格式错误！', trigger: 'change' }
        ],
        describe: [
          { max: 200, message: '最多100个字符！', trigger: 'change' }
        ]
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
      this.pendingRemoveList = []
      XEAjax.getJSON(`/api/user/page/list/${this.pageVO.pageSize}/${this.pageVO.currentPage}`).then(({ page, result }) => {
        this.pageVO.totalResult = page.totalResult
        this.list = result
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
    tableRowClassName ({ row, rowIndex }) {
      if (this.pendingRemoveList.some(item => item === row)) {
        return 'delete-row'
      }
      return ''
    },
    insertEvent () {
      this.$refs.xTable.insert({ age: '28' }).then(({ row }) => {
        this.$refs.xTable.validateRow(row).catch(e => e)
      })
    },
    pendingRemoveEvent () {
      let selection = this.multipleSelection
      if (selection.length) {
        let plus = []
        let minus = []
        selection.forEach(data => {
          if (this.pendingRemoveList.some(item => data === item)) {
            minus.push(data)
          } else {
            plus.push(data)
          }
        })
        if (minus.length) {
          this.pendingRemoveList = this.pendingRemoveList.filter(item => minus.some(data => data !== item)).concat(plus)
        } else if (plus) {
          this.pendingRemoveList = this.pendingRemoveList.concat(plus)
        }
        this.$refs.xTable.clearSelection()
      } else {
        Message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    },
    deleteListEvent () {
      let selection = this.multipleSelection
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
    },
    saveEvent () {
      this.$refs.xTable.validate(valid => {
        if (valid) {
          let removeRecords = this.pendingRemoveList
          let { insertRecords, updateRecords } = this.$refs.xTable.getAllRecords()
          if (insertRecords.length || removeRecords.length || updateRecords.length) {
            this.loading = true
            XEAjax.postJSON('/api/user/save', { insertRecords, removeRecords, updateRecords }).then(data => {
              Message({
                type: 'success',
                message: '保存成功!'
              })
              this.findList()
            }).catch(e => {
              this.loading = false
            })
          } else {
            Message({
              type: 'info',
              message: '数据未改动！'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.user-table .delete-row {
  color: #f56c6c;
  text-decoration: line-through;
}
</style>
