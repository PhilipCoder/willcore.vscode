const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const coreProxy = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.https;
    //Serve the javascript folder.
     coreProxy.testServer.jsFiles.files = "/javascript";
     coreProxy.testServer.myService.service = "/services/dataService.js";
})();