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


Here's how the objects can combine to create a scene:

```
Scene: "Construction Site Overview"
├── Layer: "Buildings" (visible: true)
│   ├── RepositoryResource: "Main Building iModel"
│   └── iModelVisibility: "Hide Internal Walls"
├── Layer: "Utilities" (visible: false)
│   └── RepositoryResource: "Utility Lines iModel"
└── View3d: "Aerial View"
```


## Schema Categories

Scene object schemas are organized into three categories based on their purpose and dependencies:

| Category | Purpose | Dependencies | Examples |
|----------|---------|--------------|----------|
| 🏗️ **Core** | Independent  objects providing core fucntionality  | None | Layer, RepositoryResource, View3d |
| 🌍 **Global Styling** | Scene-wide styling options | None | GoogleTilesStyling, UnrealAtmosphericStyling |
| 🎨 **Resource Styling** | Resource-specific styling options | Requires `RepositoryResource` linked via `relatedId` | iModelVisibility |

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
