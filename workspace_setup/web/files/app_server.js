const willCoreProxy = require("willcore.core");

const willcore = willCoreProxy.new();
//init server
willcore.todoListServer.server[__dirname] = 8581;
willcore.todoListServer.server.http;
willcore.todoListServer.userSession.session;
willcore.todoListServer.ui;
willcore.todoListServer.ui.bootstrapEndpoint.bootstrap;
willcore.todoListServer.siteCss.style = "/root/css/site.css";
willcore.todoListServer.details.service = "/services_server/details.js";
willcore.todoListServer.ui.open();