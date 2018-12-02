<template>
  <div class="app-container">

    <!-- 列表上面控制栏 -->
    <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
    <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
    <!--</el-select>-->
    <!--<el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">-->
    <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>-->
    <!--</el-select>-->
    <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
    <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
    <!--</el-select>-->
    <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
    <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
    <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
    <!--<el-checkbox v-model="showMobile" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">mobile</el-checkbox>-->

    <div class="filter-container">
      <el-input :placeholder="createUserLabelMap.username" v-model="listQuery.userName" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData"/>
      <el-checkbox v-model="showMobile" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">Show Mobile</el-checkbox>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate()">添加
      </el-button>
    </div>

    <!-- 列表部分 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit>
      <!-- 列表元素开始 -->
      <el-table-column align="center" label="用户名" width="400">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="中文名" width="200">
        <template slot-scope="scope">
          {{ scope.row.fullName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色" width="300">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门信息" width="400">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>

      <el-table-column v-if="showMobile" align="center" label="电话" width="300">
        <template slot-scope="scope">
          {{ scope.row.telephoneNumber }}
        </template>
      </el-table-column>

      <!-- 控制 -->
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页查询 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"/>

    <!-- Form -->
    <!-- 1. textMap[dialogStatus] 控制标题 -->
    <!-- 2. visible.sync 控制打开状态 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <!-- prop 设置属性 -->
        <el-form-item :label="createUserLabelMap.username">
          <el-input v-if="dialogStatus === 'update'" v-model="temp.username" disabled="disabled" />
          <el-input v-if="dialogStatus === 'create'" v-model="temp.username"/>
        </el-form-item>

        <el-form-item :label="createUserLabelMap.role">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select" prop="role">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData() : updateData()">确定</el-button>
      </div>

    </el-dialog>

  </div>

</template>

<script>
import { getUserList } from '@/api/table'
import { addUser, deleteUser } from '@/api/login'
import Pagination from '@/components/Pagination'

export default {
  // todo : 暂时不知道有什么用
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      // 返回的数据
      list: null,
      // 列表总个数
      total: 0,
      showMobile: false,
      labelMap: {
        userName: 'username'
      },
      // 查询的参数 todo: 最好能把分页和参数查询分开 listQuery & pageQuery
      listQuery: {
        userName: undefined,
        direction: undefined,
        field: undefined,
        size: undefined,
        page: undefined
      },
      // 返回回来的sort信息
      sortInfo: {
        direction: 'DESC',
        property: '',
        ignoreCase: false,
        nullHandling: '',
        descending: false,
        ascending: false
      },
      // 加载状态
      listLoading: true,
      // 临时变量，用来发送请求等
      temp: {
        id: undefined,
        username: '',
        fullName: '',
        role: '',
        deptName: ''
      },
      // 表单里的label名
      createUserLabelMap: {
        username: '用户名',
        role: '角色'
      },
      dialogFormVisible: false,
      roleOptions: ['MASTER', 'DEVELOPER'],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }],
        role: [{ required: true, message: 'role is required' }]
      }
    }
  },

  // 初始的时候加载信息
  created() {
    this.fetchData()
  },

  // 方法类
  methods: {
    // 获取列表信息
    fetchData() {
      // 此时是等待列表加载过程
      this.listLoading = true
      // 获取用户信息列s表，参数是listQuery
      getUserList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        // 加载之后取消重置等待加载状态
        this.listLoading = false
      })
    },
    // 创建用户 todo：考虑换一个名字，还是所有都是用统一的名字
    // 点击创建确定这个按钮之后触发的方法
    createData() {
      addUser(this.temp).then(response => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success',
          duration: 2000
        })
      })
    },
    // 更新用户
    updateData() {
      addUser(this.temp).then(response => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteUser(id) {
      deleteUser(id).then(() => {
        this.dialogFormVisible = false
        this.fetchData()
        this.$notify({
          title: '成功',
          message: 'delete成功',
          type: 'success',
          duration: 2000
        })
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        fullName: '',
        role: '',
        deptName: ''
      }
    },
    handleUpdate(row) {
      // 编辑的时候更新这些信息，填入表格中
      this.temp.id = row.id
      this.temp.username = row.username
      this.temp.role = row.role
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    // 点击创建用户应该出发的dialog状态，这里不涉及到真正的创建用户，只是打开Form
    handleCreate() {
      // 创建用户的时候直接清空temp变量表
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // TODO: 这个nextTick到底是什么意思
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    }
  }
}
</script>
