# 介绍
是一款简单易用的本地http-mock工具。 
# 安装
```
npm i local-mock -D
```
# 使用
1. **新建mock目录，添加mock文件。**
同时支持以下两种mock数据配置方式：
    - JSON文件（提供静态数据）
        ```json
        // mock/user/baseInfo.json
        {
            "msg":"success",
            "code":0,
            "data":[]
        }
        ```
    - javascript文件（提供动态数据）
        ```javascript
        // mock/user/address.js
        
        import { Mock }  from 'local-mock'; 
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
2. **启动mock服务**
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
3. **修改请求地址** 
    - 全局请求mock
    修改公共请求路径
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
    - 单个请求mock
    直接请求`http://localhost:端口/路径`即可。

4. **配置完成**。可以在项目中试试mock效果了。
**mock文件相对mock目录的路径** 需要与 **请求路径** 保持一致。比如下边这样：
    ```javascript
   const data = await http('/user/baseInfo'); // mock文件路径为 mock/user/baseInfo.json
   console.log('data',data)
    ```