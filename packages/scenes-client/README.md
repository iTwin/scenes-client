# @itwin/scenes-client

## About

This package provides a TypeScript client and types for interacting with the [Scenes API](https://developer.bentley.com/apis/scenes/).

## Installation

```bash
npm install @itwin/scenes-client
# or
pnpm add @itwin/scenes-client
```

## Usage

### Basic Client Setup

```ts
import { SceneClient } from "@itwin/scenes-client";

const client = new SceneClient(
  async () => "<itwin_platform_auth_token>",
  "<HOST_URL>", // Optional, defaults to "https://api.bentley.com/scenes"
);
```

---

### Working with Scenes

#### Get a Scene

```ts
import { OrderByProperties } from "@itwin/scenes-client";

const sceneResponse = await client.getScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  orderBy: OrderByProperties.NAME, // Optional property to order scene data by
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
import { SceneMinimal } from "@itwin/scenes-client";

// Get a single page of scenes (for UI pagination)
const listResponse = await client.getScenes({
  iTwinId: "<itwin_id>",
  top: 10, // Optional, defaults to 100
  skip: 5, // Optional, defaults to 0
});

console.log(`Found ${listResponse.scenes.length} scenes on this page.`);
listResponse.scenes.forEach((scene: SceneMinimal) => {
  console.log(`${scene.displayName} (${scene.id})`);
});
```

#### Get All Scenes with Iterator

```ts
import { SceneMinimal } from "@itwin/scenes-client";

// Get all scenes using async iterator
const allScenesIterator = await client.getAllScenes({
  iTwinId: "<itwin_id>",
});

let totalScenes = 0;
for await (const page of allScenesIterator) {
  console.log(`Processing ${page.scenes.length} scenes...`);
  page.scenes.forEach((scene: SceneMinimal) => {
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
      objects: [
        /** (optional) objects to create */
      ],
    },
  },
});

console.log(`Created scene: ${createResponse.scene!.displayName}`);
```

#### Update a Scene

```ts
const updateResponse = await client.patchScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  scene: {
    displayName: "Updated Scene Name",
  },
});

console.log(`Updated scene: ${updateResponse.scene!.displayName}`);
```

#### Delete a Scene

```ts
await client.deleteScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
});

console.log("Scene deleted successfully");
```

### Working with Scene Objects

#### Get a Scene Object

```ts
const objectResponse = await client.getObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>",
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
import { OrderByProperties, SceneObject } from "@itwin/scenes-client";

// Get a single page of objects (for UI pagination)
const listResponse = await client.getObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  orderBy: OrderByProperties.NAME, // Optional property to order results by
  top: 10, // Optional, defaults to 100
  skip: 5, // Optional, defaults to 0
});

console.log(`Found ${listResponse.objects.length} objects on this page.`);
listResponse.objects.forEach((object: SceneObject) => {
  console.log(`${object.displayName} (${object.id})`);
});
```

#### Get All Objects with Iterator

```ts
import { SceneObject } from "@itwin/scenes-client";

// Get all objects in a scene using async iterator
const allObjectsIterator = await client.getAllObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
});

let totalObjects = 0;
for await (const page of allObjectsIterator) {
  console.log(`Processing ${page.objects.length} objects...`);
  page.objects.forEach((object: SceneObject) => {
    console.log(`${object.id}`);
    totalObjects++;
  });
}

console.log(`Processed ${totalObjects} total objects`);
```

#### Create Scene Objects

```ts
import {
  SceneObject,
  iModelVisibilityCreate,
  LayerCreate,
  RepositoryCreate,
  RepositoryResourceCreate,
  View3dCreate,
} from "@itwin/scenes-client";

// Create objects with strongly typed interfaces
// Note: LayerCreate is an alias for StandardObjectCreate<"Layer", "1.0.0">
const layer: LayerCreate = {
  id: "<layer_id>",
  kind: "Layer",
  version: "1.0.0",
  displayName: "Buildings",
  data: {
    visible: true,
  },
};

// Note: RepositoryResourceCreate is an alias for StandardObjectCreate<"RepositoryResource", "1.0.0">
const iModelResource: RepositoryResourceCreate = {
  id: "<imodel_object_id>",
  kind: "RepositoryResource",
  version: "1.0.0",
  displayName: "Main Building Model",
  parentId: "<layer_id>", // Organize under the layer
  data: {
    iTwinId: "<itwin_id>",
    class: "iModels",
    repositoryId: "iModels",
    id: "<imodel_id>",
    visible: true,
  },
};

// Note: iModelVisibilityCreate is an alias for ResourceStylingObjectCreate<"iModelVisibility", "1.0.0">
const iModelStyling: iModelVisibilityCreate = {
  kind: "iModelVisibility",
  version: "1.0.0",
  displayName: "Hide Building Elements",
  relatedId: "<imodel_object_id>", // References the iModel resource to style
  data: {
    categories: {
      shownList: "",
      hiddenList: "+300000000A0+ED1+3*2+4+D+3*2+8+4*3+3*5+2+3*4+4+3*2+4*2+3*3+5+4+5+4+8+3*2+5+4+7F",
    },
    models: {
      shownList: "",
      hiddenList: "+20000000002",
    },
  },
};

// Note: View3dCreate is an alias for StandardObjectCreate<"View3d", "1.0.0">
const view3d: View3dCreate = {
  kind: "View3d",
  version: "1.0.0",
  displayName: "Aerial View",
  data: {
    position: { x: -50.0, y: 75.0, z: 150.0 },
    direction: { x: 0.2, y: 0.2, z: -0.96 },
    isOrthographic: false,
    up: { x: 0, y: 1, z: 0 },
    aspectRatio: 1.33,
    near: 1,
    far: 1000,
    ecefTransform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  },
};

// Note: RepositoryCreate is an alias for StandardObjectCreate<"Repository", "1.0.0">
const formsRepository: RepositoryCreate = {
  kind: "Repository",
  version: "1.0.0",
  displayName: "iTwin A Forms",
  data: {
    visible: true,
    iTwinId: "<itwin_id>",
    repositoryId: "Forms",
    class: "Forms",
  },
};

// Create objects in bulk
const createResponse = await client.postObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objects: [layer, view3d, iModelResource, iModelStyling, formsRepository],
});

console.log(`Created ${createResponse.objects.length} objects:`);
createResponse.objects.forEach((obj: SceneObject) => {
  console.log(`Created ${obj.kind} object: ${obj.displayName} (${obj.id})`);
});
```

#### Update Scene Objects

```ts
import { SceneObjectUpdate, SceneObjectUpdateById } from "@itwin/scenes-client";

// Update data for a specific object with type safety
const objectUpdate: SceneObjectUpdate<"GoogleTilesStyling", "1.0.0"> = {
  displayName: "Updated Global Styling Options",
  data: {
    // Fully typed - IntelliSense shows available properties
    quality: 0.30000001192092896,
    adjustment: [1.309999942779541, 72.0326, -75.6275],
  },
};

const updateResponse = await client.patchObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>",
  object: objectUpdate,
});

console.log(`Updated object: ${updateResponse.object.displayName}`);

// Update multiple objects in bulk (ex. reorder objects)
const bulkUpdatePayload: SceneObjectUpdateById[] = [
  { id: "<object_id_1>", order: 1 },
  { id: "<object_id_2>", order: 2 },
  { id: "<object_id_3>", order: 3 },
];
const bulkUpdateResponse = await client.patchObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objects: bulkUpdatePayload,
});

console.log(`Updated ${bulkUpdateResponse.objects.length} objects`);
```

#### Delete Scene Objects

```ts
// Delete a single object by id
await client.deleteObject({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectId: "<object_id>",
});

// Delete objects in bulk
await client.deleteObjects({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
  objectIds: ["<object_id_1>", "<object_id_2>", "<object_id_3>"],
});
```

### Type Safety

This client provides strongly typed interfaces for all scene object operations, giving you compile-time validation:

```ts
import { StandardObjectCreate, ResourceStylingObjectCreate } from "@itwin/scenes-client";

// Each schema has its own typed interface
const camera: StandardObjectCreate<"CameraAnimation", "1.0.0"> = {
  kind: "CameraAnimation",
  version: "1.0.0",
  displayName: "Site Walkthrough",
  data: {
    input: [0, 5, 10, 15], // TypeScript knows this should be number[]
    output: [
      {
        camera: {
          position: { x: 0, y: 0, z: 100 },
          direction: { x: 0, y: 1, z: 0 },
          up: { x: 0, y: 0, z: 1 },
          // IntelliSense shows all available camera properties
        },
      },
    ],
  },
};

// Resource styling objects automatically require relatedId
const styling: ResourceStylingObjectCreate<"iModelVisibility", "1.0.0"> = {
  kind: "iModelVisibility",
  version: "1.0.0",
  relatedId: "<repository_object_id>", // TypeScript enforces this field
  data: {
    // IntelliSense shows iModelVisibility specific properties
    categories: { ... },
    models: { ... },
  },
};
```

### Error Handling

```ts
import { SceneApiError } from "@itwin/scenes-client";

try {
  const scene = await client.getScene({
    iTwinId: "<itwin_id>",
    sceneId: "<invalid_scene_id>",
  });
} catch (error) {
  if (error instanceof SceneApiError) {
    console.error(`Error getting scene: ${error.status} - ${error.message}`);
    console.error(`Details ${error.details}`);
  }
}
```

## Issues

Please report bugs, feature requests, or questions using the [GitHub Issues](https://github.com/iTwin/scenes-client/issues) page.

---

Copyright © Bentley Systems, Incorporated. All rights reserved.
See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
