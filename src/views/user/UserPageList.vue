<template>
  <div
    class="home"
    v-loading="loading">

    <el-button size="mini" @click="insertEvent()">新增</el-button>
    <el-button size="mini" @click="pendingRemoveEvent()">标记/取消删除</el-button>
    <el-button size="mini" @click="deleteListEvent()">删除选中</el-button>
    <el-button size="mini" @click="saveEvent()">保存</el-button>

    <el-editable
      ref="editable"
      class="user-table"
      :data="list"
      stripe
      border
      height="534"
      size="small"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :edit-rules="validRules"
      @selection-change="handleSelectionChange">
      <el-editable-column
        type="selection"
        width="55">
      </el-editable-column>
      <el-editable-column
        prop="id"
        label="ID"
        width="80">
      </el-editable-column>
      <el-editable-column
        prop="name"
        label="姓名"
        show-overflow-tooltip
        :edit-render="{name: 'ElInput', attrs: {placeholder: '请输入姓名！'}}">
      </el-editable-column>
      <el-editable-column
        prop="age"
        label="年龄"
        align="center"
        :edit-render="{name: 'ElInputNumber', attrs: {placeholder: '请输入年龄！'}}">
      </el-editable-column>
      <el-editable-column
        prop="email"
        label="邮箱"
        :edit-render="{name: 'ElInput', attrs: {placeholder: '请输入邮箱！'}}">
      </el-editable-column>
      <el-editable-column
        prop="createDate"
        label="创建日期"
        :formatter="formatColumnDate">
      </el-editable-column>
      <el-editable-column
        prop="updateTime"
        label="最后更新时间"
        :formatter="formatColumnDate">
      </el-editable-column>
      <el-editable-column
        prop="describe"
        label="备注"
        show-overflow-tooltip
        :edit-render="{name: 'ElInput'}">
      </el-editable-column>
    </el-editable>

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
        this.$refs.editable.reload(result)
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
    tableRowClassName ({ row, rowIndex }) {
      if (this.pendingRemoveList.some(item => item === row)) {
        return 'delete-row'
      }
      return ''
    },
    insertEvent () {
      if (!this.$refs.editable.checkValid().error) {
        let row = this.$refs.editable.insert({ age: '28' })
        this.$nextTick(() => this.$refs.editable.validateRow(row).catch(e => e))
      }
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
        this.$refs.editable.clearSelection()
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
          XEAjax.postJSON('/api/user/delete', { removeRecords: selection }).then(data => {
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
      this.$refs.editable.validate(valid => {
        if (valid) {
          let removeRecords = this.pendingRemoveList
          let { insertRecords, updateRecords } = this.$refs.editable.getAllRecords()
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
