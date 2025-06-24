# Contributing

## Schema Types

The Scenes API supports the following categories of schemas, each with unique requirements:

1. **Core**: These schemas can exist in the scene without any prerequisites. (e.g., Layer, RepositoryResource, View3d)

2. **Global Styling**: Schemas meant to provide global styling options.

3. **Resource Styling**: Schemas meant to provide options on how to style and visualize **repository resources**. These objects can only exist if linked to a repository resource object with a **relatedId** relationship.

The [schemas](/schemas) folder is organized by these categories:

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

## Adding a new JSON schema

1. Clone the repository (first time) using `git clone` or pull the latest updates (subsequent times) using `git pull`.
2. Determine the type of object you are contributing and create a new folder to store all versions of your schema under the appropriate directory:
   [schemas/core/](/schemas/core),
   [schemas/globalStyling/](/schemas/globalStyling), or
   [schemas/resourceStyling/](/schemas/resourceStyling/).

3. Add your JSON schema(s) under this folder, following the naming convention `<FolderName>.<SemVer>.json`.
4. Provide sample JSON data for each schema version under the [samples](/samples) directory, using the name `<SchemaName>.sample.json`. This helps ensure your schema works correctly, as the sample data is automatically validated against it during unit testing.
5. Publish changes to your branch and open a pull request.

## CommonTypes

You can leverage common type definitions (such as `guid`, `id64`, and `dateTime`) in [CommonTypes.json](/schemas/CommonTypes.json) using `$ref` syntax.

## Schema Rules and Restrictions

1. All schemas must have a top-level `type` of `object`

2. All schemas must include a top-level `description` explaining its purpose

3. Every field under `properties` must include a `description`

4. Direct use of `"type": "string"` is disallowed. To ensure input strings are secure, use one of the predefined string types from [CommonTypes](schemas/CommonTypes.json) instead.

## Pull Requests

We follow the normal GitHub pull request workflow to ensure all changes in this repository are reviewed.

Once merged, your changes will automatically be deployed to DEV within ~15 minutes.

## Local Validations

To verify if your schema is valid, you can run unit tests and linting locally (both of which are required PR checks).

### Prerequisites

1. Node.js `>=20.0.0`
2. PNPM `>=9.0.0`

### Usage

1. Install packages: `pnpm install`
2. Run unit tests: `pnpm run test`
3. Check for linting errors: `pnpm run lint`
