// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { GetObjectsOptions } from "./object/getObjectsOptions";
import { BulkSceneObjectCreateDTO } from "./object/sceneObjectCreate.dto";
import {
  BulkSceneObjectUpdate,
  SceneObjectUpdateDTO,
} from "./object/sceneObjectUpdate.dto";
import { GetScenesOptions } from "./scene/getScenesOptions";
import { SceneCreateDTO } from "./scene/sceneCreate.dto";
import { SceneUpdateDTO } from "./scene/sceneUpdate.dto";

export type ITwinParams = { iTwinId: string; };
export type SceneParams = ITwinParams & { sceneId: string; };
export type ObjectParams = SceneParams & { objectId: string; };

export type GetSceneParams = SceneParams & Pick<GetObjectsOptions, "orderBy">;
export type GetScenesParams = ITwinParams & Omit<GetScenesOptions, "delayMs">;
export type GetAllScenesParams = ITwinParams & GetScenesOptions;
export type PostSceneParams = ITwinParams & { scene: SceneCreateDTO; };
export type PatchSceneParams = SceneParams & { scene: SceneUpdateDTO; };
export type DeleteSceneParams = SceneParams;

export type GetObjectParams = ObjectParams;
export type GetObjectsParams = SceneParams & Omit<GetObjectsOptions, "delayMs">;
export type GetAllObjectsParams = SceneParams & GetObjectsOptions;
export type PostObjectsParams = SceneParams & BulkSceneObjectCreateDTO;
export type PatchObjectParam = ObjectParams & { object: SceneObjectUpdateDTO; };
export type PatchObjectsParams = SceneParams & BulkSceneObjectUpdate;
export type DeleteObjectParams = ObjectParams;
export type DeleteObjectsParams = SceneParams & { objectIds: string[]; };
