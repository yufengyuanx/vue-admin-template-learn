<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加数据库</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit>
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
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
          {{ scope.row.database }}
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
          {{ scope.row.dbEnv }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="360" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" >编辑</el-button>
          <el-button type="danger" size="mini" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item :label="createUserLabelMap.username">
          <el-input v-model="temp.username" label="username"/>
        </el-form-item>

        <el-form-item :label="createUserLabelMap.role">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>
      <!-- dialog footer -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDbInfoList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        id: undefined,
        username: '',
        fullName: '',
        role: '',
        apartment: ''
      },
      createUserLabelMap: {
        username: '用户名',
        role: '角色'
      },
      rules: {
        createTime: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      dialogFormVisible: false,
      roleOptions: ['MASTER', 'DEVELOPER'],
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
      getDbInfoList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        fullName: '',
        role: '',
        apartment: ''
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
