import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import path from "node:path";
import fs from "node:fs";
import cors from "koa2-cors";
import child_process from "node:child_process";
import { blue, cyan } from "kolorist";
export { default as Mock } from "mockjs";

function main(args) {
  const app = new Koa();
  const router = new Router();
  app.use(logger());
  app.use(
    cors({
      credentials: true,
    })
  );
  const { dir = "mock", port = 5555 } = args;
  const mockfileDir = path.resolve(dir);
  if (!fs.existsSync(mockfileDir)) {
    throw new Error(`mock需要的${mockfileDir}文件夹未找到`);
  }

  // 匹配所有请求路径，如有对应的json文件，就返回，没有就默认成功。
  router.all("/(.*)", async (ctx, next) => {
    let data = null;
    const jsonFilePath = path.resolve(mockfileDir, `./${ctx.path}.json`);
    const jsFilePath = path.resolve(mockfileDir, `./${ctx.path}.js`);

    if (fs.existsSync(jsonFilePath)) {
      data = JSON.parse(fs.readFileSync(jsonFilePath).toString());
    }

    if (fs.existsSync(jsFilePath)) {
      data = (await import(`${jsFilePath}?v=${Date.now()}`)).default; // 这里拼接版本号是为了禁用import的缓存
    }

    ctx.body = data;

    next();
  });

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port, (e) => {
    console.log(blue(`mock server start port:${cyan(port)}`));
  });
}
export default main;
