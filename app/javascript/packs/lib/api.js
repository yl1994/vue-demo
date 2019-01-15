import req from './utils';

let baseUrl = '';

export default {
    //获取用户列表
    getUsers(form) {
        return req.get(baseUrl + '/users', form);
    },
    //添加用户
    postUser(form) {
        return req.post(baseUrl + '/users', form);
    },
    //更新用户
    putUser(form) {
        return req.put(baseUrl + '/users/' + form.id, form);
    },
    delUsers(form){
        return req.del(baseUrl+'/users/batch',form)
    }
}