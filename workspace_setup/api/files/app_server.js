const willCoreProxy = require("willcore.core");

const willcore = willCoreProxy.new();
//init server
willcore.todoListServer.server[__dirname] = 8581;
willcore.todoListServer.server.http;
//Get data at http://localhost:8581/details/info
willcore.todoListServer.details.service = "/services_server/details.js";