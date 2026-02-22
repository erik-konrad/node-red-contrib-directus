# Directus Node Package

This package contains various custom node-red nodes for handling data and files in [Directus Headless CMS](https://directus.io/).

## Nodes

### Config Node
**This is the configuration node for your directus credentials. This is used by all nodes, containing in this package.**

### Items Node
**The Items Node is the node for CRUD (Create, Read, Update, Delete) Operations in all tables.**

#### Inputs

: payload (object or array) : The data to be sent to Directus for POST, PATCH, or DELETE operations. For GET operations, this can be used to specify query parameters.
: itemId (string) : The ID of the item to be updated for PATCH operations.
: query (object) : The query parameters for GET, PATCH, or DELETE operations in multiple mode.

#### Outputs
1. Standard output
: payload (object) : The response from Directus if the operation was successful.
2. Error output
: payload (object) : The error details if there was an error during the operation.

This node allows you to interact with Directus collections. You can perform various operations such as reading, creating, updating, and deleting data from your Directus collections.

#### Configuration
- **Directus Configuration**: Select the Directus configuration you want to use for this node.
- **Name**: A name for the node (optional).
- **Collection**: The name of the Directus collection you want to interact with.
- **Method**: The HTTP method to use for the operation (GET, POST, PATCH, DELETE).
- **Mode**: Choose between "Single Item" or "Multiple Items" mode.

#### Input
The node accepts input messages that can contain data to be sent to Directus for POST, PATCH, or DELETE operations. For GET operations, the input can be used to specify query parameters.
#### Output
- **Success**: The output will contain the response from Directus if the operation was successful.
- **Error**: If there was an error during the operation, the error details will be sent to this output.

#### Methods
- **GET**: Retrieve data from the specified collection. The output will contain the retrieved data. You can use query parameters `msg.query` in the input message to filter, sort, or paginate the results.
- **POST**: Create a new item in the specified collection. The input message should contain the data for the new item in the payload. The output will contain the response from Directus, including the ID of the newly created item.
- **PATCH**: Update an existing item in the specified collection. The input message should contain the ID `msg.itemId` of the item to be updated and the data to be updated in the `msg.payload`. In multiple mode, the input message should contain a `msg.query` and data in the `msg.payload`. The output will contain the response from Directus, including the updated item details.
- **DELETE**: Delete an existing item from the specified collection. The input message should contain the `msg.payload` ID of the item or an array of IDs to be deleted in the payload. Alternatively a `msg.query` can be used, to find specific items to delete. The output will contain the response from Directus, confirming the deletion.
For more information on how to use this node, please refer to the Directus API documentation (https://directus.io/docs/api/items) and the Node-RED documentation.

### Files Node

**The Files Node can upload or import files from an url or a local storage.**

#### Inputs

: payload (object) : The Directus File Object. It contains all information for the directus_files table.
: mimetype (string) : The MIME type of the file being uploaded. This is optional but can help Directus handle the file correctly. This is used by upload mode only.
: filename (string) : The name of the file being uploaded. This is optional but can help Directus handle the file correctly. This is used by upload mode only.
: file (Buffer) : The file buffer for the upload. this can be the output from the read-file standard node. This is used by upload mode only.
: url (string) : The URL of the file to be imported. This is used by import mode only.

#### Outputs
1. Standard output with the result of the file upload or import.
: payload (object) : The output will contain the response from Directus if the file upload or import was successful.
2. Error output with the error message if the file upload or import failed.
: payload (object) : The output will contain the error message if the file upload or import failed.

This node auto detects if you want to upload a file or import it from a URL. If ``msg.url`` is set, it will import the file from the URL. If ``msg.file`` is set, it will upload the file buffer. For simplification, you can also send a simple file url as ``msg.payload`` for importing files.
