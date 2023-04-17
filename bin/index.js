#!/usr/bin/env node
import minimist from 'minimist'
import httpMock from '../src/index.js';

// 获取命令行参数
const argv = minimist(process.argv.slice(2));

httpMock(argv)

