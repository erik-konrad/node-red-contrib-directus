const { createDirectus, staticToken, rest, serverPing, uploadFiles, importFile } = require('@directus/sdk');



module.exports = function(RED) {
    function DirectusFilesNode(config) {
        RED.nodes.createNode(this, config);

        this.serverConfig = RED.nodes.getNode(config.server);
        
        var node = this;

        const client = createDirectus(this.serverConfig.host)
            .with(staticToken(this.serverConfig.token))
            .with(rest());
        
        const result = async function() { await client.request(serverPing()) };

        result().finally(() => {
            node.status({fill:"green", shape:"dot", text:"ready"});
        }).catch((error) => {
            node.status({fill:"red", shape:"dot", text:"error"});
            node.error(error);
        })

        node.on('input', async function(msg) {
            let result = {};
            node.status({fill:"blue", shape:"dot", text:"uploading..."});
            if(msg.file) {

                const formData = new FormData();

                const fileBlob = new Blob([msg.file], { type: msg.mimetype || 'application/octet-stream' });

                Object.keys(msg.payload).forEach(key => {
                    formData.append(key, msg.payload[key]);
                });

                formData.append('file', fileBlob, msg.filename || 'file');


                try {
                    result = await client.request(uploadFiles(formData));
                } catch (error) {
                    node.status({fill:"red", shape:"dot", text:"error"});
                    msg.payload = {error: error.message};
                    node.send([null, msg]);
                    return;
                }

            } else if(typeof msg.payload === 'string') {
                try {
                    result = await client.request(importFile(msg.payload, {}));
                } catch (error) {
                    node.status({fill:"red", shape:"dot", text:"error"});
                    node.error(error);
                    msg.payload = {error: error.message};
                    node.send([null, msg]);
                    return;
                } 
            } else if (msg.payload.url || msg.url) {

                const url = msg.payload.url || msg.url;
                delete msg.payload.url;

                try {
                    result = await client.request(importFile(url, msg.payload));
                } catch (error) {
                    node.status({fill:"red", shape:"dot", text:"error"});
                    node.error(error);
                    msg.payload = {error: error.message};
                    node.send([null, msg]);
                    return;
                } 

            } else {
                node.status({fill:"red", shape:"dot", text:"no file or url provided"});
                msg.payload = {error: "No file or url provided in payload"};
                node.send([null, msg]);
                return;
            }

            msg.payload = result;
            node.status({fill:"green", shape:"dot", text:"ready"});
            node.send([msg, null]);
        })
    }

    RED.nodes.registerType("directus-files", DirectusFilesNode);
};