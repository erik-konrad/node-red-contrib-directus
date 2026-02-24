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

### Directus Snapshot Node

#### Inputs
An input is not required.

#### Outputs
1. Standard Output
: payload (object) : The snapshot of the Directus schema, including collections, fields, and relationships.
2. Error Output
: payload (object) : The error details if there was an error while retrieving the schema snapshot.

This node allows you to retrieve a snapshot of the Directus schema, which can be useful for understanding the structure of your data and for debugging purposes. The output will include details about all collections, their fields, and any relationships between them.
#### Configuration
- **Directus Configuration**: Select the Directus configuration you want to use for this node.
- **Name**: A name for the node (optional).

### Directus Schema Diff Node

#### Inputs
: payload (object) : The current snapshot of the Directus schema, including collections, fields, and relationships. For best results, you can use the output of the Directus Schema Snapshot node.

#### Outputs
1. Standard Output
: payload (object) : the diff from the current snapshot to the target snapshot, including added, removed, and changed collections, fields, and relationships.
2. Error Output
: payload (object) : The error details if there was an error while calculating the schema diff.

This node allows you to calculate the difference between the current Directus schema and a target schema, which can be useful for understanding changes in your data structure and for debugging purposes. The output will include details about added, removed, and changed collections, fields, and relationships.

#### Configuration
- **Name**: A name for the node (optional).
- **Directus Target Configuration**: Select the Directus target configuration you want to compare against.
- **Ignore Version and vendor restrictions**: If enabled, the diff will ignore version and vendor restrictions, which can be useful if you want to compare schemas from different Directus versions or vendors. However, use this option with caution, as it may lead to unexpected results if there are significant differences between the schemas.

### Directus Apply Schema Node

#### Inputs
: payload (object) : The diff of the Directus schema, including added, removed, and changed collections, fields, and relationships. For best results, you can use the output of the Directus Schema Diff node.

#### Outputs
1. Standard Output
: payload (object) : If nothing went wrong, the output will be null.
2. Error Output
: payload (object) : The error details if there was an error while applying the schema diff.

This node allows you to apply a schema diff to your Directus target instance, which can be useful for updating your data structure based on changes in your schema. The input should include details about added, removed, and changed collections, fields, and relationships, and the node will attempt to apply those changes to the target Directus instance.
#### Configuration
- **Name**: A name for the node (optional).
- **Directus Target Configuration**: Select the Directus target configuration you want to apply the schema diff to.
- **Keep existing tables and fields**: If enabled, the node will attempt to keep existing tables and fields that are not included in the schema diff, which can be useful if you want to preserve data that is not affected by the changes. However, use this option with caution, as it may lead to unexpected results if there are significant differences between the schemas.