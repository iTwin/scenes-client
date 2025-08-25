# Scene Object Schemas

This documentation describes the JSON5 schemas used by the Scenes API. These schemas define the structure and validation rules for scene objects that can be created, updated, and managed through the API.

> **New to Scenes API?** Start with the [Scenes API Overview](https://developer.bentley.com/apis/scenes/overview/).

## What are scene objects?

Scene objects are structured data entities used to curate customized visualization experiences. They allow consumers to visualize specific data, models, and views tailored to their workflow or use case.
Think of scene objects as the building blocks of a scene - they define what appears, how it's styled, and how it's organized.

### Key Characteristics

Scene objects are:

- **Extensible**: Validated against JSON schemas that can be extended to support custom workflows.
- **Typed and versioned**: Each object's data must conform to a specific schema based on the `kind` and `version` in its metadata. This ensures data integrity and allows for maintaining compatibility with older versions.
- **Hierarchical**: Objects can reference each other with parent-child relationships.

### Common Object Types & Examples

<details>
<summary><strong>Layer</strong> - Organize related content and toggle visibility</summary>

```json
{
  "kind": "Layer",
  "version": "1.0.0",
  "data": {
    "visible": true,
    "displayName": "Exton Campus - Main Building"
  }
}
```

</details>

<details>
<summary><strong>RepositoryResource</strong> - Reference <a href="https://developer.bentley.com/apis/itwins/overview/#itwin-repositories">iTwin repositories</a> (iModels, reality data, etc.)</summary>

```json
{
  "displayName": "Main Building Model",
  "kind": "RepositoryResource",
  "version": "1.0.0",
  "iTwinId": "fa6e86b2-da9a-4fdc-a1bd-4a707b696d32",
  "data": {
    "class": "iModels",
    "repositoryId": "iModels",
    "id": "c2fdfb84-bedb-409d-8527-fe519c85abe2",
    "visible": true
  }
}
```

</details>

<details>
<summary><strong>View3d</strong> - Define camera positions and angles</summary>

```json
{
  "displayName": "Default View",
  "kind": "View3d",
  "version": "1.0.0",
  "data": {
    "position": {
      "x": -17.90,
      "y": 20.51,
      "z": -12.33
    },
    "aspectRatio": 1.33,
    "direction": {
      "x": 0.5,
      "y": -0.5,
      "z": 0
    },
    "up": {
      "x": 0,
      "y": 1,
      "z": 0
    },
    "near": 0,
    "far": 100,
    "ecefTransform": [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }
}
```

</details>


> **Note**: These examples show simplified object structures. Full scene objects include additional metadata such as id, sceneId, timestamps, etc.


### Building a Scene

The individual objects work together to create a functional scene. Here's a real-world example showing how to organize building and utility models with custom styling:

**Scene Structure Overview:**
```
Scene: "Construction Site Overview"
├── Layer: "Buildings"
│   ├── RepositoryResource: "Main Building iModel"
│   └── iModelVisibility: "Hide Internal Walls" → linked via relatedId
├── Layer: "Utilities"
│   └── RepositoryResource: "Utility Lines iModel"
└── View3d: "Aerial View"
```

> **Key Relationship:** Resource styling objects (like `iModelVisibility`) can be organized within layers, but they are functionally linked to specific repository resources via the `relatedId` property, not through parent-child hierarchy.

<details>
<summary><strong>📋 Complete Scene JSON</strong></summary>


```json
{
  "id": "8c361895-93ee-4e52-ba61-f51f2efa88f3",
  "displayName": "Construction Site Overview",
  "iTwinId": "64060a14-d545-4fff-b3b0-4c31291e7a00",
  "sceneData": {
    "objects": [
      // Layer: Buildings - Controls visibility of building-related content
      {
        "id": "709f6a9d-d791-4e6c-9154-1b8fffbab3c1",
        "kind": "Layer",
        "version": "1.0.0",
        "data": {
          "visible": true,
          "displayName": "Buildings"
        }
      },

      // RepositoryResource: Main Building iModel
      {
        "id": "0e5751c6-2846-4637-9de4-5e486968c8b2",
        "displayName": "Main Building iModel",
        "kind": "RepositoryResource",
        "version": "1.0.0",
        "parentId": "709f6a9d-d791-4e6c-9154-1b8fffbab3c1", // References Buildings Layer
        "iTwinId": "64060a14-d545-4fff-b3b0-4c31291e7a00",
        "data": {
          "class": "iModels",
          "repositoryId": "iModels",
          "id": "ba9bdbbf-59f9-41aa-a4e3-6fbd8d6bd068",
          "visible": true
        }
      },

      // iModelVisibility: Styling for Main Building iModel
      {
        "id": "8d4ce395-cc6b-46da-bc93-6c166bb22e96",
        "displayName": "Hide Internal Walls",
        "kind": "iModelVisibility",
        "version": "1.0.0",
        "parentId": "709f6a9d-d791-4e6c-9154-1b8fffbab3c1",  // Organized under Buildings Layer
        "relatedId": "0e5751c6-2846-4637-9de4-5e486968c8b2", // Styles the Main Building iModel
        "data": {
          "categories": {
            "shownList": "",
            "hiddenList": "+300000000A0+ED1+3*2+4+D+3*2+8+4*3+3*5+2+3*4+4+3*2+4*2+3*3+5+4+5+4+8+3*2+5+4+7F",
          },
          "models": {
            "shownList": "",
            "hiddenList": "+20000000002",
          }
        }
      },

      // Layer: Utilities - Controls visibility of utility-related content
      {
        "id": "3bc3a0c0-75e8-498b-901a-7290f57f7b40",
        "kind": "Layer",
        "version": "1.0.0",
        "data": {
          "visible": true,
          "displayName": "Utilities"
        }
      },

      // RepositoryResource: Utility Lines iModel
      {
        "id": "c03b3685-338a-45f3-8b84-9ee0551515a9",
        "displayName": "Utility Lines iModel",
        "kind": "RepositoryResource",
        "version": "1.0.0",
        "parentId": "3bc3a0c0-75e8-498b-901a-7290f57f7b40", // References Utilities Layer
        "iTwinId": "64060a14-d545-4fff-b3b0-4c31291e7a00",
        "data": {
          "class": "iModels",
          "repositoryId": "iModels",
          "id": "6bbcf593-6160-4d83-9c07-1a69e4cc29fb",
          "visible": true
        }
      },

      // View3d: Global camera position and view settings
      {
        "id": "46db6358-d6a4-4ea4-85f9-9f66a2f80860",
        "displayName": "Aerial View",
        "kind": "View3d",
        "version": "1.0.0",
        "data": {
          "position": {
            "x": -50.0,
            "y": 75.0,
            "z": 150.0
          },
          "isOrthographic": false,
          "aspectRatio": 1.33,
          "direction": {
            "x": 0.2,
            "y": 0.2,
            "z": -0.96
          },
          "up": {
            "x": 0,
            "y": 1,
            "z": 0
          },
          "near": 1,
          "far": 1000,
          "ecefTransform": [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          ]
        }
      }
    ]
  }
}
```

</details>


## Schema Categories

Scene object schemas are organized into three categories based on their purpose and dependencies:

| Category | Purpose | Dependencies | Examples |
|----------|---------|--------------|----------|
| 🏗️ **Core** | Independent  objects providing core functionality  | None | Layer, RepositoryResource, View3d |
| 🌍 **Global Styling** | Scene-wide styling options | None | GoogleTilesStyling, UnrealAtmosphericStyling |
| 🎨 **Resource Styling** | Resource-specific styling options | Requires `RepositoryResource` linked via `relatedId` | iModelVisibility, RealityDataStyling |

---


The [schemas](./schemas) folder is organized by these categories:

```
schemas/
├── CommonTypes.json           # 📋 Shared definitions used across schemas
├── core/                      # 🏗️ Independent objects
│   ├── Layer/
│   ├── RepositoryResource/
│   ├── View3d/
│   └── ...
├── globalStyling/            # 🌍 Scene-wide styling
│   ├── GoogleTilesStyling/
│   ├── UnrealAtmosphericStyling/
│   └── ...
└── resourceStyling/          # 🎨 Resource-specific styling
    ├── iModelVisibility/
    └── ...
```

> **Note**: Schema files are named `{kind}.{version}.json` (e.g., `Layer.1.0.0.json`). Each schema folder contains all versions of that schema type.

## Next Steps

1. **New to the API?** Start with the [Scenes API Overview](https://developer.bentley.com/apis/scenes/overview/) for scene concepts
2. **Ready to code?** See the [client package documentation](../packages/scenes-client/README.md) for installation and code examples
3. **Need schema details?** Browse the [schemas folder](./schemas/) for JSON5 schema definitions
4. **API Reference?** Check the [API operations documentation](https://developer.bentley.com/apis/scenes/operations/)


## Issues
Please report bugs or questions using the [GitHub Issues](./issues) page.

---

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
