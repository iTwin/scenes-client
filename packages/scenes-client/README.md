# @bentley/scenes-client

## About

This package provides a TypeScript client and types for interacting with the [Scenes API](https://developer.bentley.com/apis/scenes/).


## Installation

```bash
npm install @bentley/scenes-client
# or
pnpm add @bentley/scenes-client
```

## Usage

### Basic Client Setup

```ts
import { SceneClient } from "@bentley/scenes-client";

const client = new SceneClient({
  getAccessToken: async () => "<itwin_platform_auth_token>",
  baseUrl: "<HOST_URL>", // Optional, defaults to "https://api.bentley.com/scenes"
});
```
---
### Working with Scenes

#### Get a Scene

```ts
const sceneResponse = await client.getScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  orderBy: "displayName", // Optional property to order scene data by
});

console.log(sceneResponse.scene);
/*
{
  id: "<scene_id>",
  displayName: "My Scene",
  iTwinId: "<itwin_id>",
  createdById: "<creator_id>",
  creationTime: "2025-01-01T10:00:00.000Z",
  lastModified: "2025-01-01T10:01:00.000Z",
  sceneData: { objects: [...] },
  isPartial: false
}
*/
```

#### Get List of Scenes for an iTwin

```ts
// Get a single page of scenes (for UI pagination)
const listResponse = await client.getScenes({
  iTwinId: "<itwin_id>",
  top: 10, // Optional, defaults to 100
  skip: 5  // Optional, defaults to 0
});

console.log(`Found ${listResponse.scenes.length} scenes on this page.`);
listResponse.scenes.forEach(scene => {
  console.log(`${scene.displayName} (${scene.id})`);
});
```

#### Get All Scenes with Iterator

```ts
// Get all scenes using async iterator
const allScenesIterator = await client.getAllScenes({
  iTwinId: "<itwin_id>",
});

let totalScenes = 0;
for await (const page of allScenesIterator) {
  console.log(`Processing ${page.scenes.length} scenes...`);
  page.scenes.forEach(scene => {
    console.log(`${scene.displayName}`);
    totalScenes++;
  });
}

console.log(`Processed ${totalScenes} total scenes`);
```

#### Create a Scene

```ts
const createResponse = await client.postScene({
  iTwinId: "<itwin_id>",
  scene: {
    displayName: "Construction Site Overview",
    sceneData: {
      objects: []
    }
  }
});

console.log(`Created scene: ${createResponse.scene!.displayName}`);
```

#### Update a Scene

```ts
const updateResponse = await client.patchScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  scene: {
    displayName: "Updated Scene Name"
  }
});

console.log(`Updated scene: ${updateResponse.scene!.displayName}`);
```

#### Delete a Scene

```ts
await client.deleteScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>"
});

console.log("Scene deleted successfully");
```


### Working with Scene Objects

#### Get a Scene Object

```ts
const objectResponse = await client.getObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>"
});

console.log(objectResponse.object);
/*
{
  id: "<object_id>",
  sceneId: "<scene_id>",
  displayName: "My View3d Object",
  kind: "View3d",
  version: "1.0.0",
  data: { ... },
  createdById: "<creator_id>",
  creationTime: "2025-01-01T10:00:00.000Z",
  lastModified: "2025-01-01T10:01:00.000Z"
}
*/
```

#### Get List of Objects in a Scene

```ts
// Get a single page of objects (for UI pagination)
const listResponse = await client.getObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  orderBy: "displayName", // Optional property to order results by
  top: 10, // Optional, defaults to 100
  skip: 5  // Optional, defaults to 0
});

console.log(`Found ${listResponse.objects.length} objects on this page.`);
listResponse.objects.forEach(object => {
  console.log(`${object.displayName} (${object.id})`);
});
```

#### Get All Objects with Iterator

```ts
// Get all objects in a scene using async iterator
const allObjectsIterator = await client.getAllObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>"
});

let totalObjects = 0;
for await (const page of allObjectsIterator) {
  console.log(`Processing ${page.objects.length} objects...`);
  page.objects.forEach(object => {
    console.log(`${object.id}`);
    totalObjects++;
  });
}

console.log(`Processed ${totalObjects} total objects`);
```

#### Create Scene Objects

```ts
// Create objects in bulk
const objectsPayload = [
  // Add a Layer
  {
    id: "<layer_id>",
    kind: "Layer",
    version: "1.0.0",
    displayName: "Buildings",
    data: {
      visible: true,
      displayName: "Buildings"
    }
  },
  // Add an iModel resource
  {
    kind: "RepositoryResource",
    version: "1.0.0",
    displayName: "Main Building Model",
    parentId: "<layer_id>", // Organize under the layer
    iTwinId: "<itwin_id>",
    data: {
      class: "iModels",
      repositoryId: "iModels",
      id: "<imodel_id>",
      visible: true
    }
  },
  // Add a 3D view
  {
    kind: "View3d",
    version: "1.0.0",
    displayName: "Aerial View",
    data: {
      position: { x: -50.0, y: 75.0, z: 150.0 },
      direction: { x: 0.2, y: 0.2, z: -0.96 },
      up: { x: 0, y: 1, z: 0 },
      aspectRatio: 1.33,
      near: 1,
      far: 1000,
      ecefTransform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
  }
];

// Create objects in bulk
const createResponse = await client.postObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objects: objectsPayload
});

console.log(`Created ${createResponse.objects.length} objects:`);
createResponse.objects.forEach(obj => {
  console.log(`Created ${obj.kind} object: ${obj.displayName} (${obj.id})`);
});

```

#### Update Scene Objects

```ts
// Update a single object by id
const updatePayload = {
  displayName: "Updated Object Name"
};
const updateResponse = await client.patchObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>",
  object: updatePayload
});

console.log(`Updated object: ${updateResponse.object.displayName}`);

// Update multiple objects in bulk (ex. reorder objects)
const bulkUpdatePayload = [
  { id: "<object_id_1>", order: 1 },
  { id: "<object_id_2>", order: 2 },
  { id: "<object_id_3>", order: 3 }
];
const bulkUpdateResponse = await client.patchObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objects: bulkUpdatePayload
});

console.log(`Updated ${bulkUpdateResponse.objects.length} objects`);
```

#### Delete Scene Objects

```ts
// Delete a single object by id
await client.deleteObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>"
});

// Delete objects in bulk
await client.deleteObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectIds: [
    "<object_id_1>",
    "<object_id_2>",
    "<object_id_3>"
  ]
});
```

### Error Handling

```ts
import { SceneApiError } from "@bentley/scenes-client";

try {
  const scene = await client.getScene({
    iTwinId: "<itwin_id>",
    sceneId: "<invalid_scene_id>"
  });
} catch (error) {
  if (error instanceof SceneApiError) {
    console.error(`Error getting scene: ${error.status} - ${error.message}`);
    console.error(`Details ${error.details}`);
  }
}
```

## Issues

Please report bugs, feature requests, or questions using the [GitHub Issues](../../issues) page.

---

Copyright © Bentley Systems, Incorporated. All rights reserved.
See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
