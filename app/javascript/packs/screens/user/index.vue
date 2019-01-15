<template>
    <div>
        <h1>用户管理</h1>
        <Input v-model="query.keyword" placeholder="Enter something..." style="width: 300px" />
        <Button type="primary" @click="handelSearch">查询</Button>
        <Button type="success" @click="handelCreate">新增</Button>
        <Button type="error" @click="handleDelete" :disabled="deleteStatus">删除</Button>
        <Table :columns="columns" :data="data" @on-selection-change="selectionChange">
        </Table>
        <Page :total="query.total" @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer />
        <Modal v-model="visable" title="新增/编辑用户" @on-ok="" @on-cancel="">
            <Form ref="form" :model="form" :rules="rules" :label-width="80">
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem label="年龄" prop="age">
                    <Select v-model="form.age">
                        <Option v-for="age in ages" :value="age.value" :key="age.value">{{ age.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="form.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handelSubmit">{{form.id?"修改": "创建" }}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            checkInput: '',
            lists: [
                { id: 1, item: 'Bar' },
                { id: 2, item: 'Gun' }
            ],
            selection: [],
            data: [],
            rules: {
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: 'Please select the city', trigger: 'change', type: "integer" }
                ],

                address: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                ],
            },
            visable: false,
            query: {
                keyword: null,
                page: 1,
                per_page: 10,
                total: 0
            },
            ages: [{
                    value: 10,
                    label: "10"
                },
                {
                    value: 11,
                    label: "11"
                },
                {
                    value: 12,
                    label: "12"
                }
            ],
            form: {
                id: null,
                name: null,
                age: null,
                address: null,
            },
            columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '年龄',
                    key: 'age'
                },
                {
                    title: '地址',
                    key: 'address'
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handelEdit(params.row)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, 'Delete')
                        ]);
                    }
                }

            ]
        }
    },

    created: function() {
        this.fetchLists()
        this.getUsers()
    },
    computed: {
        deleteStatus() {
            return !this.selection.length
        }
    },
    methods: {
        getUsers() {
            let that = this;
            this.visable = false;
            this.selection = [];
            this.$api.getUsers(this.query).then(res =>{
              that.data = res.data
              that.query.total = res.total    
            })
            // this.$http.get("/users.json", { params: this.query }).then(res => {
            //     this.data = res.data
            //     this.query.total = res.total
            // })
        },
        handelSearch() {
            this.query.page = 1;
            this.getUsers();
        },
        handelCreate() {
            this.$refs.form.resetFields();
            this.visable = true;
        },
        handelEdit(row) {
            this.$refs.form.resetFields();
            this.form = JSON.parse(JSON.stringify(row));
            this.visable = true;
        },
        selectionChange(selection) {
            this.selection = selection;
        },
        handleDelete() {
            let ids = _(this.selection).flatMap("id").value();
            let that = this;
            this.$api.delUsers({ids: ids}).then(res => {
              if (res.code == 200) {
                  that.$Notice.success({
                      title: res.msg,
                  });
              } else {
                  that.$Notice.error({
                      title: res.msg,
                  });
              }
              that.getUsers();    
            })
            // this.$http.delete("/users/batch", { body: { ids: ids } }).then(res => {
            //     if (res.code == 200) {
            //         this.$Notice.success({
            //             title: res.msg,
            //         });
            //     } else {
            //         this.$Notice.error({
            //             title: res.msg,
            //         });
            //     }
            //     this.getUsers();
            // })
        },
        handelSubmit() {
            let that = this
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    this.$Notice.warning({
                        title: "表单验证错误"
                    });
                } else {
                    if (this.form.id) {
                        this.$api.putUser(this.form).then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                that.$Notice.success({
                                    title: res.msg,
                                });
                            } else {
                                that.$Notice.error({
                                    title: res.msg,
                                });
                            }
                            that.getUsers();
                        })
                    } else {
                        this.$api.postUser(this.form).then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                that.$Notice.success({
                                    title: res.msg,
                                });
                            } else {
                                that.$Notice.error({
                                    title: res.msg,
                                });
                            }
                            that.getUsers();
                        })
                    }
                }
            })


        },
        pageChange(page) {
            this.query.page = page;
            this.getUsers();

        },
        pageSizeChange(per_page) {
            this.query.per_page = per_page;
            this.query.page = 1;
            this.getUsers();
        },
        show(index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
            })
        },
        remove(index) {
            this.data.splice(index, 1);
        },
        fetchLists: function() {
            this.$http.get("/lists.json").then(response => {
                var newList = response.data.map((oldItem) => {
                    oldItem.editable = false;
                    return oldItem;
                })
                this.lists = newList
            })
        },
        addLine: function() {
            this.$http.post('/lists.json', { item: this.checkInput }, {}).then(response => {
                this.fetchLists(), this.checkInput = ''
            }).catch(function(error) {
                console.log('Got a problem' + error)
            })
        },
        changeLine(line) {
            line.editable = !line.editable
        },
        updateLine(line) {
            this.$http.put(`/lists/${line.id}`, { item: line.item }).then(response => {
                this.fetchLists()
            }).catch(function(error) {
                console.log('Got a problem' + error)
            })
        },
        deleteLine(id) {
            this.$http.delete(`/lists/${id}.json`).then(response => {
                this.fetchLists()
            }).catch(function(error) {
                console.log('Got a problem' + error)
            })
        }
    }
}
</script>
<style scoped>
h1 {
    font-size: 2em;
    text-align: center;
    color: red;
}
</style>