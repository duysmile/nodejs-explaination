const DIContainer = require('./di-container');
const service1 = require('./services/service1');
const service2 = require('./services/service2');
const service3 = require('./services/service3');

const dic = new DIContainer();
dic.factory("service1", service1);
dic.factory("service2", service2);
dic.factory("service3", service3);

const s1 = dic.get("service1");
s1.runService();

const s2 = dic.get("service2");
s2.runService();

const s3 = dic.get("service3");
s3.runService();
