import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { SceneClient } from '../src/client'
import { ScenesApiError } from '../src/types'

const {
    HOST_URL,
    ISSUER_URL,
    OIDC_SCOPES,
    CLIENT_ID,
    CLIENT_SECRET,
    ITWIN_ID,
    IMODEL_ID,
    SCENE_ID,
  } = process.env

// @naron: not necessary now but we could cache the access token
const getAccessToken = async (): Promise<string> => {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: OIDC_SCOPES!,
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
  })
  const res = await fetch(`${ISSUER_URL}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params,
  })
  const { access_token } = await res.json()
  return "Bearer " + access_token
}

const client = new SceneClient({ getAccessToken, urlPrefix: "", baseUrl: HOST_URL })

let sceneId: string
describe('Scenes operation', () => {
  it('create scene', async () => {
    const scene = await client.postScene({
      iTwinId: ITWIN_ID!,
      scene: {
        displayName: 'TestScene',
        sceneData: {
          objects: [
            {
              kind: 'RepositoryResource',
              version: '1.0.0',
              iTwinId: ITWIN_ID!,
              data: {
                visible: true,
                id: IMODEL_ID!,
                class: 'iModels',
                repositoryId: 'iModels',
              },
            },
            {
              kind: 'Layer',
              version: '1.0.0',
              data: {
                displayName: 'TestLayer',
                visible: true,
              },
            },
          ],
        },
      },
    })

    // @naron: feel like this could be better optimized reusing the objects
    expect(scene).toEqual(
      expect.objectContaining({
        displayName: "TestScene",
        iTwinId: ITWIN_ID!,
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
                id: IMODEL_ID!,
                class: "iModels",
                repositoryId: "iModels",
              },
              iTwinId: ITWIN_ID!,
            }),
          ]),
        }),
      })
    );

    sceneId = scene.id;
    expect(sceneId).toBeDefined();
  });

  it("get scene by id", async () => {
    // Use the ID saved from the createScene test
    const scene = await client.getScene({iTwinId: ITWIN_ID!, sceneId});
  
    // Basic identity checks
    expect(scene.id).toBe(sceneId);
    expect(scene.displayName).toBe("TestScene");
    expect(scene.iTwinId).toBe(ITWIN_ID);
  
    // Verify the sceneData.objects array contains both objects
    expect(scene.sceneData.objects).toEqual(
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
      ])
    );
  });

  it("get all scenes", async () => {
    const res = await client.getScenes({ iTwinId: ITWIN_ID! });

    expect(res).toBeDefined();
    expect(res.scenes.length).toBeGreaterThan(0);
  });

  it(`update scene`, async () => {
    const updatedScene = await client.patchScene({
      iTwinId: ITWIN_ID!,
      sceneId,
      scene: {
        displayName: "UpdatedTestScene",
      },
    })

    expect(updatedScene.displayName).toBe("UpdatedTestScene");
  });

  it("delete scene", async () => {
    await client.deleteScene({ iTwinId: ITWIN_ID!, sceneId });

    try {
      await client.getScene({iTwinId: ITWIN_ID!, sceneId});
    }
    catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).status).toBe(404);
      expect((error as ScenesApiError).code).toBe('SceneNotFound');
      expect((error as ScenesApiError).target).toBe('scene');
    }
  });
})

let objectId: string;
describe('Scenes Objects operations', () => {
  it('create single object', async () => {
    const res = await client.postObject({
      iTwinId: ITWIN_ID!,
      sceneId: SCENE_ID!,
      object: {
        kind: 'Layer',
        version: '1.0.0',
        data: { 
          displayName: 'TestLayer1',
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
      })
    );

    objectId = res.object.id;
  });

  it(`create multiple objects`, async () => {
    const res = await client.postObjects({
      iTwinId: ITWIN_ID!,
      sceneId: SCENE_ID!,
      objects: [
        {
          kind: 'Layer',
          version: '1.0.0',
          data: {
            displayName: 'TestLayer2',
            visible: true,
          },
        },
        {
          kind: 'RepositoryResource',
          version: '1.0.0',
          iTwinId: ITWIN_ID!,
          data: {
            visible: true,
            id: IMODEL_ID!,
            class: 'iModels',
            repositoryId: 'iModels',
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
          iTwinId: ITWIN_ID!,
          data: {
            visible: true,
            id: IMODEL_ID!,
            class: "iModels",
            repositoryId: "iModels",
          },
        }),
      ])
    );
  });

  it(`patch object`, async () => {
    const res = await client.patchObject({
      iTwinId: ITWIN_ID!,
      sceneId: SCENE_ID!,
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
      })
    );
  });

  

  // it("get scene objects", async () => {
  //   const res = await client.getSceneObjects({ iTwinId: ITWIN_ID!, sceneId: SCENE_ID! });

  //   expect(res.objects.length).toBeGreaterThan(0);
  //   expect(res.objects[0]).toEqual(
  //     expect.objectContaining({
  //       kind: "Layer",
  //       version: "1.0.0",
  //       data: {
  //         displayName: "TestLayer",
  //         visible: true,
  //       },
  //     })
  //   );
  // });



});


// @naron: there should be tests for exceptions/errors as well