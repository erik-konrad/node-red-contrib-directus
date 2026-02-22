module.exports = function(RED) {
    function DirectusConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.token = n.token;
    }
    RED.nodes.registerType("directus-config",DirectusConfigNode);
}