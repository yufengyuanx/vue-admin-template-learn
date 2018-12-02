<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加数据库
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit>
      <!--<el-table-column align="center" label="ID" width="50">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.id }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="HOST" width="300">
        <template slot-scope="scope">
          {{ scope.row.host }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="PORT" width="200">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库" width="200">
        <template slot-scope="scope">
          {{ scope.row.dbName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="username" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库类型" width="300">
        <template slot-scope="scope">
          {{ scope.row.dbType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库环境" width="300">
        <template slot-scope="scope">
          {{ scope.row.dbEnvType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item :label="createDbConfigLabelMap.host">
          <el-input v-model="temp.host" label="host"/>
        </el-form-item>

        <el-form-item :label="createDbConfigLabelMap.port">
          <el-input v-model="temp.port" label="port"/>
        </el-form-item>

        <el-form-item :label="createDbConfigLabelMap.dbName">
          <el-input v-model="temp.dbName" label="dbName"/>
        </el-form-item>

        <el-form-item :label="createDbConfigLabelMap.username">
          <el-input v-model="temp.username" label="username"/>
        </el-form-item>

        <el-form-item :label="createDbConfigLabelMap.password" prop="password">
          <el-input
            :type="pwdType"
            v-model="temp.password"
            auto-complete="on"
            placeholder="password"
            label="password"/>
        </el-form-item>

        <el-form-item :label="createDbConfigLabelMap.dbEnvType">
          <el-select v-model="temp.dbEnvType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in dbEnvTypeOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>
      <!-- dialog footer -->
      <!--type: danger = red, primary = blue, default = white-->
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">测试连接</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDbInfoList } from '@/api/table'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pwdType: 'password',
      listQuery: {
        direction: undefined,
        field: undefined,
        size: 20,
        page: 1
      },
      temp: {
        id: undefined,
        host: '',
        port: '',
        dbName: '',
        username: '',
        dbType: '',
        dbEnvType: ''
      },
      createDbConfigLabelMap: {
        host: '主机',
        port: '端口',
        dbName: '数据库',
        username: '用户名',
        password: '密码',
        dbType: '类型',
        dbEnvType: '环境'
      },
      rules: {
        createTime: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dbEnvTypeOptions: ['DEV', 'STG', 'PRD', 'PRD_RO'],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getDbInfoList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        host: '',
        port: '',
        dbName: '',
        username: '',
        dbType: '',
        dbEnvType: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
