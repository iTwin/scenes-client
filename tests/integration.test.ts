// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import "dotenv/config";
import { describe, it, expect } from "vitest";
import { SceneClient } from "../client/src/client";
import { ScenesApiError } from "../client/src/models";

function requireEnv(key: keyof NodeJS.ProcessEnv): string {
  const v = process.env[key];
  if (!v) {
    throw new Error(`Missing env var ${key}`);
  }
  return v;
}

const HOST_URL = requireEnv("HOST_URL");
const ISSUER_URL = requireEnv("ISSUER_URL");
const OIDC_SCOPES = requireEnv("OIDC_SCOPES");
const CLIENT_ID = requireEnv("CLIENT_ID");
const CLIENT_SECRET = requireEnv("CLIENT_SECRET");
const ITWIN_ID = requireEnv("ITWIN_ID");
const IMODEL_ID = requireEnv("IMODEL_ID");
const SCENE_ID = requireEnv("SCENE_ID");

const getAccessToken = async (): Promise<string> => {
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    scope: OIDC_SCOPES,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const res = await fetch(`${ISSUER_URL}/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params,
  });
  const { access_token } = await res.json();
  return "Bearer " + access_token;
};

const client = new SceneClient({
  getAccessToken,
  urlPrefix: "",
  baseUrl: HOST_URL,
});

let sceneId: string;
describe("Scenes operation", () => {
  it("create scene", async () => {
    const res = await client.postScene({
      iTwinId: ITWIN_ID,
      scene: {
        displayName: "TestScene",
        sceneData: {
          objects: [
            {
              kind: "RepositoryResource",
              version: "1.0.0",
              iTwinId: ITWIN_ID,
              data: {
                visible: true,
                id: IMODEL_ID,
                class: "iModels",
                repositoryId: "iModels",
              },
            },
            {
              kind: "Layer",
              version: "1.0.0",
              data: {
                displayName: "TestLayer",
                visible: true,
              },
            },
          ],
        },
      },
    });

    expect(res.scene).toEqual(
      expect.objectContaining({
        displayName: "TestScene",
        iTwinId: ITWIN_ID,
        sceneData: expect.objectContaining({
          objects: expect.arrayContaining([
            expect.objectContaining({
              kind: "Layer",
              version: "1.0.0",
              data: {
                displayName: "TestLayer",
                visible: true,
              },
            }),
            expect.objectContaining({
              kind: "RepositoryResource",
              version: "1.0.0",
              data: {
                visible: true,
                id: IMODEL_ID,
                class: "iModels",
                repositoryId: "iModels",
              },
              iTwinId: ITWIN_ID,
            }),
          ]),
        }),
      }),
    );

    sceneId = res.scene.id;
    expect(sceneId).toBeDefined();
  });

  it("get scene by id", async () => {
    // Use the ID saved from the createScene test
    const res = await client.getScene({ iTwinId: ITWIN_ID, sceneId });

    // Basic identity checks
    expect(res.scene.id).toBe(sceneId);
    expect(res.scene.displayName).toBe("TestScene");
    expect(res.scene.iTwinId).toBe(ITWIN_ID);

    // Verify the sceneData.objects array contains both objects
    expect(res.scene.sceneData.objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "Layer",
          version: "1.0.0",
          data: { displayName: "TestLayer", visible: true },
        }),
        expect.objectContaining({
          kind: "RepositoryResource",
          version: "1.0.0",
          data: {
            visible: true,
            id: expect.any(String),
            class: "iModels",
            repositoryId: "iModels",
          },
          iTwinId: ITWIN_ID,
        }),
      ]),
    );
  });

  it("get all scenes", async () => {
    const res = await client.getScenes({ iTwinId: ITWIN_ID });

    expect(res).toBeDefined();
    expect(res.scenes.length).toBeGreaterThan(0);
  });

  it("update scene", async () => {
    const res = await client.patchScene({
      iTwinId: ITWIN_ID,
      sceneId,
      scene: {
        displayName: "UpdatedTestScene",
      },
    });

    expect(res.scene.displayName).toBe("UpdatedTestScene");
  });

  it("delete scene", async () => {
    await client.deleteScene({ iTwinId: ITWIN_ID, sceneId });

    try {
      await client.getScene({ iTwinId: ITWIN_ID, sceneId });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).status).toBe(404);
      expect((error as ScenesApiError).code).toBe("SceneNotFound");
      expect((error as ScenesApiError).target).toBe("scene");
    }
  });
});

let objectId: string;
let objectId2: string;
describe("Scenes Objects operations", () => {
  it("create single object", async () => {
    const res = await client.postObject({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      object: {
        kind: "Layer",
        version: "1.0.0",
        data: {
          displayName: "TestLayer1",
          visible: true,
        },
      },
    });

    expect(res.object).toEqual(
      expect.objectContaining({
        kind: "Layer",
        version: "1.0.0",
        data: {
          displayName: "TestLayer1",
          visible: true,
        },
      }),
    );

    objectId = res.object.id;
  });

  it("create multiple objects", async () => {
    const res = await client.postObjects({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objects: [
        {
          kind: "Layer",
          version: "1.0.0",
          data: {
            displayName: "TestLayer2",
            visible: true,
          },
        },
        {
          kind: "RepositoryResource",
          version: "1.0.0",
          iTwinId: ITWIN_ID,
          data: {
            visible: true,
            id: IMODEL_ID,
            class: "iModels",
            repositoryId: "iModels",
          },
        },
      ],
    });

    expect(res.objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "Layer",
          version: "1.0.0",
          data: {
            displayName: "TestLayer2",
            visible: true,
          },
        }),
        expect.objectContaining({
          kind: "RepositoryResource",
          version: "1.0.0",
          iTwinId: ITWIN_ID,
          data: {
            visible: true,
            id: IMODEL_ID,
            class: "iModels",
            repositoryId: "iModels",
          },
        }),
      ]),
    );

    objectId2 = res.objects[0].id;
  });

  it("patch object", async () => {
    const res = await client.patchObject({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objectId,
      object: {
        displayName: "UpdatedTestLayer1",
      },
    });

    expect(res.object).toEqual(
      expect.objectContaining({
        id: objectId,
        displayName: "UpdatedTestLayer1",
        kind: "Layer",
        version: "1.0.0",
        data: {
          displayName: "TestLayer1",
          visible: true,
        },
      }),
    );
  });

  it("patch multiple objects", async () => {
    const res = await client.patchObjects({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objects: [
        {
          id: objectId,
          displayName: "UpdatedTestLayer1Again",
        },
        {
          id: objectId2,
          displayName: "UpdatedTestLayer2",
        },
      ],
    });

    expect(res.objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: objectId,
          displayName: "UpdatedTestLayer1Again",
        }),
        expect.objectContaining({
          id: objectId2,
          displayName: "UpdatedTestLayer2",
        }),
      ]),
    );
  });

  it("get object", async () => {
    const res = await client.getObject({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objectId,
    });

    expect(res.object).toEqual(
      expect.objectContaining({
        id: objectId,
        displayName: "UpdatedTestLayer1Again",
        kind: "Layer",
        version: "1.0.0",
        data: {
          displayName: "TestLayer1",
          visible: true,
        },
      }),
    );
  });

  it("get all objects", async () => {
    const res = await client.getObjects({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
    });

    expect(res.objects.length).toBeGreaterThan(0);
  });

  it("delete object", async () => {
    await client.deleteObject({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objectId,
    });

    try {
      await client.getObject({
        iTwinId: ITWIN_ID,
        sceneId: SCENE_ID,
        objectId,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).status).toBe(404);
      expect((error as ScenesApiError).code).toBe("SceneObjectNotFound");
      expect((error as ScenesApiError).target).toBe("sceneObject");
    }
  });

  it("delete multiple objects", async () => {
    await client.deleteObjects({
      iTwinId: ITWIN_ID,
      sceneId: SCENE_ID,
      objectIds: [objectId2],
    });

    try {
      await client.getObject({
        iTwinId: ITWIN_ID,
        sceneId: SCENE_ID,
        objectId: objectId2,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).status).toBe(404);
      expect((error as ScenesApiError).code).toBe("SceneObjectNotFound");
      expect((error as ScenesApiError).target).toBe("sceneObject");
    }
  });
});
