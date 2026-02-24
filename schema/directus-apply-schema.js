const {createDirectus, staticToken, serverPing, rest, schemaApply} = require('@directus/sdk');




module.exports = function(RED) {
    function DirectusApplySchemaNode(config) {
        RED.nodes.createNode(this, config);

        this.serverConfig = RED.nodes.getNode(config.target);

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
            node.error(error);
        })

        node.on('input', async function(msg) {
            node.status({fill:"blue", shape:"dot", text:"applying schema..."});

            const systemFields = ['user_created', 'user_updated', 'date_created', 'date_updated'];

            if (msg.payload.diff.fields) {
                msg.payload.diff.fields = msg.payload.diff.fields.filter(field => {
                    const fieldName = field.field;
                    
                    if (systemFields.includes(fieldName)) {
                        const isEdit = field.diff && field.diff.some(d => d.kind === 'E');
                        
                        if (isEdit) {
                            return false; 
                        }
                    }

                    if(config.keep) {
                        const isFieldDelete = field.diff && field.diff.some(d => d.kind === 'D');
                        if (isFieldDelete) return false;
                    }

                    return true;
                });
            }

            if(config.keep) { 
                if (msg.payload && msg.payload.diff && msg.payload.diff.collections) {
                    msg.payload.diff.collections = msg.payload.diff.collections.filter(coll => {
                        return coll.diff.every(d => d.kind !== 'D'); 
                    });
                }
            }

            try {
                const response = await client.request(schemaApply(msg.payload, true));

                msg.payload = response;
            } catch (err) {

                node.status({ fill: "red", shape: "dot", text: "error"})
                msg.payload = err;
                node.send([null, msg]);

                return;
            }
            
            node.status({fill: "green", shape: "dot", text: "ready"});
            node.send([msg, null]);
        })
    }

    RED.nodes.registerType("directus-apply-schema", DirectusApplySchemaNode);
}