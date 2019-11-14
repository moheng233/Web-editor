/*
* wed.js web界面开源可视化编辑器。
* 技术支持： 
*/
/*********************************************/
;(function(global,undefined){
    "use strict"
    var _global;

    // 组件列表
    var comlist = [];

    // add对象
    var add_this;

    // template
    var template;

    // 实例化部分常用变量
    var comselect;
    var groupselect;

    // wed主对象
    var wed = {
        init: function(){
            // 编辑器全局初始化
            wed.modal.init();
            wed.edit.init();
            wed.update();
            console.log('wed.js loaded')
        },
        update: function(){
            // 编辑器每次操作后，重新绑定事件
            console.log('update');
            $('add').off().on('click',function(){
                $('#add_modal').modal();
                add_this = $(this);
            })
            $('[edit]').off().on('dblclick',function(event){
                console.log('edit');
                event.stopPropagation();
            })
        },
        editor:{
            // 编辑器对象
            insert: function(component){
                // 往add对象前插入模板
                template = $('script#template-'+component.cid);
                template = template.children().clone().attr('data-component',component.cid).attr('data-group',component.gid);
                return add_this.before(template);
            }
        },
        template:{
            create: function(cid,template){
                $('body').append('<script type="text/template" id="template-'+ cid +'"></script>');
                $('script#template-'+cid).append($(template));
            }
        },
        edit:{
            // 对于卡片进行编辑的主对象
            init: function(){
                wed.edit.create();
                wed.edit.update();
            },
            update: function(){
                $('[data-node]').off().on('dblclick',function(){
                    
                })
            },
            create: function(){
                // 创建卡片编辑器弹窗
                var $edit_model = $('\
                <template>\
                    <div class="modal fade" tabindex="10" id="edit_modal">\
                        <div class="modal-dialog modal-dialog-centered" role="document">\
                            <div class="modal-content">\
                                <div class="modal-header">\
                                    <h5 class="modal-title bj">编辑</h5>\
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                                    <span aria-hidden="true">&times;</span>\
                                    </button>\
                                </div>\
                                <div class="modal-body">\
                                </div>\
                                <div class="modal-footer">\
                                    <button type="button" id="save" class="btn btn-primary">保存</button>\
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </template>\
                ')

                $('body').append($edit_model.html())
            }
        },
        modal: {
            // 新增弹窗的主对象
            init: function(){
                // 弹窗的初始化函数
                wed.modal.create();
                wed.modal.select.group();
                wed.modal.select.component();
            },
            select: {
                group: function(){
                    console.log('group select update');
                    groupselect = $('#groupselect');
                    groupselect.empty();
                    comlist.forEach(function(group){
                        groupselect.append('<option value="'+ group.gid + '">' + group.name + '</option>');
                    })
                },
                component: function(){
                    console.log('component select update');
                    groupselect = $('#groupselect');
                    comselect = $('#comselect');

                    var group =  wed.get.group(groupselect.val());
                    comselect.empty();
                    group.component.forEach(function(component){
                        comselect.append('<option value="'+ component.cid + '">' + component.name + '</option>')
                    })
                }
            },
            create: function(){
                // 在界面上创建弹窗
                var $add_modal = $('\
                    <template>\
                        <div class="modal fade" tabindex="10" id="add_modal">\
                            <div class="modal-dialog modal-dialog-centered" role="document">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <h5 class="modal-title bj">添加卡片</h5>\
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                                        <span aria-hidden="true">&times;</span>\
                                        </button>\
                                    </div>\
                                    <div class="modal-body">\
                                        <select id="groupselect" class="custom-select"></select>\
                                        <select id="comselect" class="custom-select"></select>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button type="button" id="divadd" class="btn btn-primary">添加</button>\
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </template>\
                ') 
                // 绑定事件（为了防止重复绑定）
                $('body').append($add_modal.html()).off().on('click','#divadd',function(){
                    var component = wed.get.component(groupselect.val(),comselect.val());
                    component.into(add_this);
                    $('#add_modal').modal('hide');
                    wed.update();
                }).on('change','#groupselect',function(){
                    wed.modal.select.component();
                })
            }
        },
        register: {
            component: function(gid,component){
                // 注册组件，gid为定义的组件组的gid，component是组件对象
                var comgroup = wed.get.group(gid);
                if(comgroup == undefined){
                    return undefined;
                };
                component.gid = gid;
                wed.template.create(component.cid,component.template);
                comgroup.component.push(component);
            },
            group: function(gid,groupname){
                // 注册组件组
                var comgroup = comlist.find(function (value){
                    return value.name == groupname;
                })
                if(comgroup != undefined){
                    return false;
                }
                comlist.push({
                    gid: gid,
                    name: groupname,
                    type: 'component',
                    component: []
                });
                wed.modal.select.group();
                return true;
            }
        },
        get: {
            group: function(gid){
                // 获得指定gid的组件组对象
                var group = comlist.find(function (value){
                    return value.gid == gid;
                })
                return group;
            },
            component: function(gid,cid){
                // 获得指定组的组件对象
                var group = wed.get.group(gid);
                var component = group.component.find(function(value){
                    return value.cid == cid
                });
                return component;
            },
            componentlist: function(){
                // 获得组件表对象（仅调试用，开发时尽量不要调用）
                return comlist;
            },
            rand: function(n) {
                // 生成随机数
                var str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                var r = '';
                for (var i = 0; i < n; i++) {
                    r += str.charAt(Math.floor(Math.random() * str.length));
                }
                return r;
            }
        }
    }
    _global = (function(){ return this || (0, eval)('this'); }());
    !('wed' in _global) && (_global.wed = wed);
}())