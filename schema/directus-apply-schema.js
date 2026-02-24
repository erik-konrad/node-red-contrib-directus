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