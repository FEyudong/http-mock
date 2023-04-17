# 介绍
是一款简单易用的本地http-mock工具。 
# 安装
```
npm i local-mock -D
```
# 使用
1. 新建mock文件夹，支持两种mock数据配置方式
    - JSON文件
        ```json
        // mock/user/baseInfo.json
        {
            "msg":"success",
            "code":0,
            "data":[]
        }
        ```
    - javascript文件
        ```javascript
        // mock/user/address.js
        
        import { Mock }  from 'local'; 
        // 为了方便模拟动态数据，内置了mockjs。
        // 这是它的文档 http://mockjs.com/examples.html

        const data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'list|1-10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1
            }]
        })
        export default data
        ```
2. 启动mock服务
    ```shell
    npx local-mock // 不带参数
    npx local-mock --dir src/mock // 指定mock文件目录为src/mock, 默认为项目根路径下的 mock 文件夹。
    npx local-mock --port 5000 // 指定端口为5000, 默认端口为5555。
    ```
 - 推荐与本地开发服务器一起启动，方便快捷。
    1. 配置mock专用的`script`
    推荐使用`cross-env`来设置环境变量。如项目中没有安装过，需`npm i corss-env -D`
        ```
        // package.json
        {
        ...
        "scripts": {
            "dev":"vite",
            "mock": "cross-env NODE_ENV=mock npm run dev & local-mock",
            ...
        }
        }
        ...
        ```
    2. 启动mock服务
        ```shell
        npm run mock
        ```
3. 修改公共请求路径
    ```javascript
    let baseUrl = '';

    if (process.env.NODE_ENV === 'mock') {
        baseUrl = 'http://localhost:5555'; // 配置mock服务请求地址及端口
    }
    // 公共的请求方法
    export const http = (path)=> {
        return fetch(`${baseUrl}${path}`).then((res)=>res.json())
    }
    
    ```
4. 配置已完成，可以在项目中试试mock效果了。请求路径与mock文件相对mock文件夹的路径一致。比如下边这样：
    ```javascript
   const data = await http('/user/baseInfo');
   console.log('data',data)
    ```