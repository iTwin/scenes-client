// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { GetObjectsOptions } from "./object/GetObjectsOptions";
import { BulkSceneObjectCreateDTO } from "./object/sceneObjectCreate.dto";
import { BulkSceneObjectUpdate } from "./object/sceneObjectUpdate.dto";
import { GetScenesOptions } from "./scene/GetScenesOptions";
import { SceneCreateDTO } from "./scene/sceneCreate.dto";
import { SceneUpdateDTO } from "./scene/sceneUpdate.dto";


export type ITwinParams = { iTwinId: string };
export type SceneParams = ITwinParams & { sceneId: string };
export type ObjectParams = SceneParams & { objectId: string };

export type GetScenesParams = ITwinParams;
export type GetScenesPagedParams = ITwinParams & GetScenesOptions;
export type GetSceneParams = SceneParams;
export type PostSceneParams = ITwinParams & { scene: SceneCreateDTO };
export type PatchSceneParams = SceneParams & { scene: SceneUpdateDTO };
export type DeleteSceneParams = SceneParams;

export type GetObjectParams = ObjectParams;
export type GetObjectsPagedParams = SceneParams & GetObjectsOptions;
export type PostObjectsParams = SceneParams & BulkSceneObjectCreateDTO;
export type PatchObjectsParams = SceneParams & BulkSceneObjectUpdate;
export type DeleteObjectParams = ObjectParams;
export type DeleteObjectsParams = SceneParams & { objectIds: string[] };
