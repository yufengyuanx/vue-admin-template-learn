<template>
  <div class="app-container">
    <el-input v-model="listQuery.jobName" placeholder="作业名称" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData()"/>

    <el-select v-model="listQuery.isSuccess" style="width: 140px" class="filter-item" placeholder="运行结果" @change="fetchData()">
      <el-option v-for="item in stateOptions" :key="item.key" :label="item.label" :value="item.key"/>
    </el-select>

    <el-input v-model="listQuery.lastDays" :placeholder="3" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData()"/>

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
      <el-table-column align="center" label="作业名称" width="400">
        <template slot-scope="scope">
          {{ scope.row.relatedJob.jobName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="成功/失败" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.success | statusFilter">{{ stateLabelMap[scope.row.success] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运行耗时" width="200">
        <template slot-scope="scope">
          {{ scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改人" width="200">
        <template slot-scope="scope">
          {{ scope.row.relatedJob.lastOperator }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="错误原因" width="400">
        <template slot-scope="scope">
          {{ scope.row.errorMes }}
        </template>
      </el-table-column>

      <!--errorMes-->
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini">日志</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"/>

      <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->

      <!--<el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">-->

      <!--<el-form-item :label="createDbConfigLabelMap.host">-->
      <!--<el-input v-model="temp.host" label="host"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item :label="createDbConfigLabelMap.port">-->
      <!--<el-input v-model="temp.port" label="port"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item :label="createDbConfigLabelMap.dbName">-->
      <!--<el-input v-model="temp.dbName" label="dbName"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item :label="createDbConfigLabelMap.username">-->
      <!--<el-input v-model="temp.username" label="username"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item :label="createDbConfigLabelMap.password" prop="password">-->
      <!--<el-input-->
      <!--:type="pwdType"-->
      <!--v-model="temp.password"-->
      <!--auto-complete="on"-->
      <!--placeholder="password"-->
      <!--label="password"/>-->
      <!--</el-form-item>-->

      <!--<el-form-item :label="createDbConfigLabelMap.dbEnvType">-->
      <!--<el-select v-model="temp.dbEnvType" class="filter-item" placeholder="Please select">-->
      <!--<el-option v-for="item in dbEnvTypeOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <!--</el-form>-->
      <!--&lt;!&ndash; dialog footer &ndash;&gt;-->
      <!--&lt;!&ndash;type: danger = red, primary = blue, default = white&ndash;&gt;-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button type="danger" @click="dialogFormVisible = false">测试连接</el-button>-->
      <!--<el-button @click="dialogFormVisible = false">取消</el-button>-->
      <!--<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>-->
      <!--</div>-->
      <!--</el-dialog>-->
  </div>
</template>

<script>
import { getHistoryList } from '@/api/table'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  filters: {
    statusFilter(state) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[state]
    }
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pwdType: 'password',
      listQuery: {
        jobName: '',
        lastDays: undefined,
        isSuccess: undefined,
        direction: undefined,
        field: undefined,
        size: 20,
        page: 1
      },
      stateOptions: [
        { label: '成功', key: true },
        { label: '失败', key: false }],
      stateLabelMap: {
        true: '成功',
        false: '失败'
      },
      dialogFormVisible: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getHistoryList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    }
  }
}
</script>
