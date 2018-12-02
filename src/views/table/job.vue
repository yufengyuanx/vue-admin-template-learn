<template>
  <div class="app-container">
    <!-- button -->
    <div class="filter-container">
      <!-- jobName search -->
      <el-input :placeholder="placeHolderMap.jobName" v-model="listQuery.jobName" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData()"/>

      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
      <!--</el-select>-->

      <el-select v-model="listQuery.jobState" style="width: 140px" class="filter-item" @change="fetchData()">
        <el-option v-for="item in stateOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">创建新任务
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit>
      <el-table-column align="center" label="任务名称" width="400">
        <template slot-scope="scope">
          {{ scope.row.jobName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务desc" width="200">
        <template slot-scope="scope">
          {{ scope.row.jobDesc }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="任务状态" width="130" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ stateTextMap[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人" width="200">
        <template slot-scope="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改人" width="200">
        <template slot-scope="scope">
          {{ scope.row.updateBy }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Review" width="200">
        <template slot-scope="scope">
          {{ scope.row.reviewer }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<router-link :to="'../example/edit/'+scope.row.id">-->
          <el-button v-if="scope.row.state ==='DEVELOPING'" type="primary" size="mini">编辑</el-button>
          <!--</router-link>-->

          <!-- <el-button v-if="scope.row.state ==='DEVELOPING'" type="primary" size="mini" >编辑任务</el-button> -->
          <el-button v-if="scope.row.state !=='DEVELOPING'" type="primary" size="mini">查看</el-button>
          <el-button v-if="scope.row.state ==='STOP'" type="success" size="mini">重新开发</el-button>

          <!-- <el-button v-if="scope.row.state='PRODUCING'" type="danger" size="mini" >下线</el-button> -->
          <!--           <el-button v-if="scope.row.state!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button> -->
          <el-button v-if="scope.row.state ==='PRODUCING'" type="danger" size="mini">任务下线</el-button>
          <!-- <el-button type="success" size="mini" >复制</el-button> -->
          <el-button v-if="scope.row.state ==='DEVELOPING'" type="danger" size="mini">删除</el-button>
          <!-- <el-button type="success" size="mini" >运行历史</el-button> -->
          <!--           <el-button v-if="scope.row.state!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button> -->
        </template>
      </el-table-column>

      <!--  <el-table-column label="NAME">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页查询 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"/>
  </div>
</template>

<script>
import { getJobList } from '@/api/table'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    statusFilter(state) {
      const statusMap = {
        PRODUCING: 'success',
        REVIEWING: 'success',
        CREATED: 'primary',
        DEVELOPING: 'primary',
        STOP: 'danger'
      }
      return statusMap[state]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        jobName: '',
        jobState: '',
        direction: undefined,
        field: undefined,
        size: 10,
        page: 1
      },
      stateOptions: [
        { label: '全部', key: undefined },
        { label: '生产中', key: 'PRODUCING' },
        { label: '审查中', key: 'REVIEWING' },
        { label: '创建', key: 'CREATED' },
        { label: '开发中', key: 'DEVELOPING' },
        { label: '下线', key: 'STOP' }],
      stateTextMap: {
        PRODUCING: '生产中',
        REVIEWING: '审查中',
        CREATED: '创建',
        DEVELOPING: '开发中',
        STOP: '下线'
      },
      placeHolderMap: {
        jobName: '作业名'
      },
      listLoading: true,
      rules: {
        createTime: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getJobList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    }
  }
}
</script>
