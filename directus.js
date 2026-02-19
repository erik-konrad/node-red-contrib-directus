const { createDirectus, rest, readItem, readItems, updateItem, updateItems, createItem, createItems, deleteItem, deleteItems, staticToken, serverPing } = require('@directus/sdk');



module.exports = function(RED) {
    function DirectusNode(config) {
        RED.nodes.createNode(this, config);

        this.serverConfig = RED.nodes.getNode(config.server);
        this.collection = config.collection;

        var node = this;

        const client = createDirectus(this.serverConfig.host)
            .with(staticToken(this.serverConfig.token))
            .with(rest());
        
        node.status({fill:"yellow", shape:"dot", text:"healthcheck..."});
        
        const result = async function() { await client.request(serverPing()) };

        result().finally(() => {
            node.status({fill:"green", shape:"dot", text:"ready"});
        }).catch((error) => {
            node.status({fill:"red", shape:"dot", text:"error"});
        })

        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"fetching..."});
            const collection = msg.collection || config.collection;
            const method = msg.method || config.method;
            const mode = msg.mode || config.mode;

            let response = null;

            try {
                switch (method) {
                    case 'GET':
                        if(mode === 'single') {
                            response = await client.request(
                                readItem(collection, msg.payload, msg.query || {})
                            );
                        } else {
                            response = await client.request(
                                readItems(collection, msg.query || {
                                    limit: -1,
                                    fields: ['*']
                                })
                            );
                        }
                    break;
                    case 'POST':
                        if(mode === 'single') {
                            response = await client.request(createItem(collection, msg.payload, msg.query || {}));
                        } else {
                            response = await client.request(createItems(collection, msg.payload, msg.query || {}));
                        } 
                    break;
                    case 'PATCH':
                        if(mode === 'single') {
                            response = await client.request(updateItem(collection, msg.itemId, msg.payload, msg.query || {}));
                        } else {
                            response = await client.request(updateItems(collection, msg.keysOrQuery, msg.payload, msg.query || {}));
                        }
                    break;
                    case 'DELETE':
                        if(mode === 'single') {
                            response = await client.request(deleteItem(collection, msg.payload));
                        } else {
                            response = await client.request(deleteItems(collection, msg.payload));
                        }
                    break;
                }



                msg.payload = response;
                node.send([msg, null]);
                node.status({fill:"green", shape:"dot", text:"idle"});

            } catch (error) {
                msg.payload = error;
                node.status({fill:"red", shape:"dot", text:"error"});
                node.send([null, msg]);
            }
        });

        node.status({fill:"green", shape:"dot", text:"idle"});
    }

    RED.nodes.registerType("directus", DirectusNode);
}