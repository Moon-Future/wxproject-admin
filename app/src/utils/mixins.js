export const tableMixin = {
  data() {
    return {
      loading: false,
      total: 0,
      pageNo: 1,
      pageSize: 20
    }
  },
  created() {
    this.getData()
  },
  methods: {
    trimData(data) {
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
    },
    search() {
      this.pageNo = 1
      this.trimData(this.searchConds)
      this.getData(this.searchConds)
      this.$refs.baseTable.cancel()
    },
    refreshData() {
      this.getData(this.searchConds)
    },
    changeSize(val) {
      this.pageSize = val
      this.getData()
    },
    changeNo(val) {
      this.pageNo = val
      this.getData()
    }
  }
}
