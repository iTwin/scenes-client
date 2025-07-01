# Scene Object Schemas

## Schema Types

The Scenes API supports the following categories of schemas, each with unique requirements:

1. **Core**: These schemas can exist in the scene without any prerequisites. (e.g., Layer, RepositoryResource, View3d)

2. **Global Styling**: Schemas meant to provide global styling options.

3. **Resource Styling**: Schemas meant to provide options on how to style and visualize **repository resources**. These objects can only exist if linked to a repository resource object with a **relatedId** relationship.

The [schemas](./schemas) folder is organized by these categories:

```
schemas
├── core
│   ├── Layer
│   ├── RepositoryResource
│   ├── View3d
│   └── ...
├── globalStyling
│   ├── GoogleTilesStyling
│   ├── UnrealAtmosphericStyling
│   └── ...
└── resourceStyling
    ├── iModelVisibility
    └── ...
```
