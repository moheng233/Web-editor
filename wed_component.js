$(function(){
    console.log('web editor component loader');
    var r = wed.register.group('basis','基础');
    var r = wed.register.group('text','文本');
    wed.register.component('basis',{
        cid: 'card',
        name: '卡片',
        template: '\
            <div class="card" edit>\
                <div class="card-header">\
                    新卡片\
                </div>\
                <div class="card-body">\
                    <add></div>\
                </div>\
            </div>',
        edit:[
            {
                eid: 'card_header_text',
                name: '卡片头部标题',
                type: 'text',
                get: function(component){
                    return $.trim(component.find('.card-header').html())
                },
                set: function(component,value){
                    return component.find('.card-header').html(value);
                }
            }
        ],
        into: function(){
            return wed.editor.insert(this);
        }
    })
    wed.register.component('basis',{
        cid: 'container',
        name: '容器',
        template: '\
            <div class="container" edit>\
                <add></add>\
            </div>',
        into: function(){
            return wed.editor.insert(this);
        }
    })
    wed.register.component('basis',{
        cid: 'col-6',
        name: '1/1栅格',
        template: '\
            <div class="row" edit>\
                <div class="col-6">\
                    <add></add>\
                </div>\
                <div class="col-6">\
                    <add></add>\
                </div>\
            </div>\
        ',
        into: function(){
            return wed.editor.insert(this);
        }
    })
    wed.register.component('text',{
        cid: 'h1',
        name: '一级标题',
        template: '<h1 edit>一级标题</h1>',
        edit: [
            {
                eid: 'text',
                name: '文字',
                type: 'text',
                get: function(component){
                    return $.trim(component.html())
                },
                set: function(component,value){
                    return component.html(value);
                }
            }
        ],
        into: function(){
            return wed.editor.insert(this);
        }
    })
});