// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SceneClient } from "../src/client.js";
import { SceneCreate, SceneObjectCreate, ScenesApiError } from "../src/models";

function requireMetaEnv<K extends keyof ImportMetaEnv>(
  key: K,
): ImportMetaEnv[K] {
  const v = import.meta.env[key];
  if (!v) {
    throw new Error(`Missing env var ${key}`);
  }
  return v;
}

const HOST_URL = requireMetaEnv("VITE_HOST_URL");
const ISSUER_URL = requireMetaEnv("VITE_ISSUER_URL");
const OIDC_SCOPES = requireMetaEnv("VITE_OIDC_SCOPES");
const CLIENT_ID = requireMetaEnv("VITE_CLIENT_ID");
const CLIENT_SECRET = requireMetaEnv("VITE_CLIENT_SECRET");
const ITWIN_ID = requireMetaEnv("VITE_ITWIN_ID");
const IMODEL_ID = requireMetaEnv("VITE_IMODEL_ID");

const LAYER_OBJ: SceneObjectCreate = {
  kind: "Layer",
  version: "1.0.0",
  displayName: "TestLayer",
  data: { visible: true },
};
const REPO_OBJ: SceneObjectCreate = {
  kind: "RepositoryResource",
  version: "1.0.0",
  data: {
    iTwinId: ITWIN_ID,
    visible: true,
    id: IMODEL_ID,
    class: "iModels",
    repositoryId: "iModels",
  },
};

const TEST_SCENES: SceneCreate[] = [
  { displayName: "TestSceneA", sceneData: { objects: [LAYER_OBJ, REPO_OBJ] } },
  { displayName: "TestSceneB", sceneData: { objects: [LAYER_OBJ, REPO_OBJ] } },
];

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

const client = new SceneClient(getAccessToken, HOST_URL);

describe("Scenes operation", () => {
  let sceneAId: string, sceneBId: string;

  it("create 2 scenes", async () => {
    const resA = await client.postScene({
      iTwinId: ITWIN_ID,
      scene: TEST_SCENES[0],
    });
    expect(resA.scene.displayName).toBe(TEST_SCENES[0].displayName);

    const resB = await client.postScene({
      iTwinId: ITWIN_ID,
      scene: TEST_SCENES[1],
    });
    expect(resB.scene.displayName).toBe(TEST_SCENES[1].displayName);

    sceneAId = resA.scene.id;
    expect(sceneAId).toBeDefined();
    sceneBId = resB.scene.id;
    expect(sceneBId).toBeDefined();
  });

  it("get scene by id", async () => {
    // Use the ID saved from the createScene test
    const res = await client.getScene({ iTwinId: ITWIN_ID, sceneId: sceneAId });

    // Basic identity checks
    expect(res.scene.id).toBe(sceneAId);
    expect(res.scene.displayName).toBe("TestSceneA");
    expect(res.scene.iTwinId).toBe(ITWIN_ID);

    // Verify the sceneData.objects array contains both objects
    expect(res.scene.sceneData.objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining(LAYER_OBJ),
        expect.objectContaining(REPO_OBJ),
      ]),
    );
  });

  it("get scene metadata by id", async () => {
    // Use the ID saved from the createScene test
    const res = await client.getSceneMetadata({
      iTwinId: ITWIN_ID,
      sceneId: sceneAId,
    });

    // Basic identity checks
    expect(res.scene.id).toBe(sceneAId);
    expect(res.scene.displayName).toBe("TestSceneA");
    expect(res.scene.iTwinId).toBe(ITWIN_ID);

    // Verify the sceneData.objects link
    expect(res.scene.sceneData?.objects).toBeDefined();
    expect(res.scene.sceneData.objects.href).toEqual(
      `${HOST_URL}/${sceneAId}/objects?iTwinId=${ITWIN_ID}`,
    );
  });

  it("get scenes paged", async () => {
    const res = await client.getAllScenes({ iTwinId: ITWIN_ID });

    let found = false;
    for await (const page of res) {
      expect(page.scenes.length).toBeGreaterThan(0);
      const scene = page.scenes.find((s) => s.id === sceneAId);
      if (scene) {
        expect(scene.displayName).toBe("TestSceneA");
        found = true;
        break;
      }
    }

    expect(found).toBe(true);
  });

  it("update scene", async () => {
    const upd = await client.patchScene({
      iTwinId: ITWIN_ID,
      sceneId: sceneAId,
      scene: { displayName: "UpdatedA", description: "UpdateB" },
    });

    expect(upd.scene.displayName).toBe("UpdatedA");
    expect(upd.scene.description).toBe("UpdateB");
  });

  it("delete scene", async () => {
    await client.deleteScene({ iTwinId: ITWIN_ID, sceneId: sceneAId });
    await expect(
      client.getScene({ iTwinId: ITWIN_ID, sceneId: sceneAId }),
    ).rejects.toMatchObject({
      status: 404,
      code: "SceneNotFound",
    } as ScenesApiError);

    await client.deleteScene({ iTwinId: ITWIN_ID, sceneId: sceneBId });
    await expect(
      client.getScene({ iTwinId: ITWIN_ID, sceneId: sceneBId }),
    ).rejects.toMatchObject({
      status: 404,
      code: "SceneNotFound",
    } as ScenesApiError);
  });
});

describe("Scenes Objects operations", () => {
  let obj1: string, obj2: string, sceneId: string;

  beforeAll(async () => {
    const res = await client.postScene({
      iTwinId: ITWIN_ID,
      scene: TEST_SCENES[1],
    });
    expect(res.scene?.id).toBeDefined();
    sceneId = res.scene.id;
  });

  afterAll(async () => {
    await client.deleteScene({ iTwinId: ITWIN_ID, sceneId });
    await expect(
      client.getScene({ iTwinId: ITWIN_ID, sceneId }),
    ).rejects.toMatchObject({
      status: 404,
      code: "SceneNotFound",
    } as ScenesApiError);
  });

  it("create multiple objects", async () => {
    const multi = await client.postObjects({
      iTwinId: ITWIN_ID,
      sceneId,
      objects: [LAYER_OBJ, REPO_OBJ],
    });

    expect(multi.objects).toHaveLength(2);

    const layer = multi.objects.find((o) => o.kind === "Layer");
    if (!layer) {
      throw new Error("Missing Layer object");
    }
    obj1 = layer.id;

    const repo = multi.objects.find((o) => o.kind === "RepositoryResource");
    if (!repo) {
      throw new Error("Missing RepositoryResource");
    }
    obj2 = repo.id;
  });

  it("patch object", async () => {
    const p1 = await client.patchObject({
      iTwinId: ITWIN_ID,
      sceneId,
      objectId: obj1,
      object: { displayName: "Layer1Up" },
    });
    expect(p1.object.displayName).toBe("Layer1Up");
  });

  it("patches objects", async () => {
    const p1 = await client.patchObjects({
      iTwinId: ITWIN_ID,
      sceneId,
      objects: [
        {
          id: obj1,
          displayName: "Layer1Up squared",
        },
      ],
    });
    expect(p1.objects[0].displayName).toBe("Layer1Up squared");

    const pAll = await client.patchObjects({
      iTwinId: ITWIN_ID,
      sceneId,
      objects: [
        { id: obj1, displayName: "Layer1Again" },
        { id: obj2, displayName: "ResrcUp" },
      ],
    });
    expect(pAll.objects.map((o) => o.displayName)).toEqual(
      expect.arrayContaining(["Layer1Again", "ResrcUp"]),
    );
  });

  it("get single object", async () => {
    const res = await client.getObject({
      iTwinId: ITWIN_ID,
      sceneId,
      objectId: obj1,
    });

    expect(res.object.id).toBe(obj1);
    expect(res.object.kind).toBe("Layer");
    expect(res.object.displayName).toBe("Layer1Again");
  });

  it("get objects paged", async () => {
    const res = await client.getAllObjects({
      iTwinId: ITWIN_ID,
      sceneId,
    });

    let found = false;
    for await (const page of res) {
      expect(page.objects.length).toBeGreaterThan(0);
      const obj = page.objects.find((o) => o.id === obj1);
      if (obj) {
        expect(obj.displayName).toBe("Layer1Again");
        found = true;
        break;
      }
    }

    expect(found).toBe(true);
  });

  it("delete object", async () => {
    await client.deleteObjects({
      iTwinId: ITWIN_ID,
      sceneId,
      objectIds: [obj1, obj2],
    });
    await expect(
      client.getObject({
        iTwinId: ITWIN_ID,
        sceneId,
        objectId: obj2,
      }),
    ).rejects.toMatchObject({ code: "SceneObjectNotFound" } as ScenesApiError);
  });
});
