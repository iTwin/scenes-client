/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { GetObjectsOptions } from "./object/getObjectsOptions.js";
import { BulkSceneObjectCreate } from "./object/sceneObjectCreate.js";
import { BulkSceneObjectUpdate, SceneObjectUpdate } from "./object/sceneObjectUpdate.js";
import { GetScenesOptions } from "./scene/getScenesOptions.js";
import { SceneCreate } from "./scene/sceneCreate.js";
import { SceneUpdate } from "./scene/sceneUpdate.js";

export type ITwinParams = { iTwinId: string };
export type SceneParams = ITwinParams & { sceneId: string };
export type ObjectParams = SceneParams & { objectId: string };

export type GetSceneMetadataParams = SceneParams;
export type GetSceneParams = SceneParams & Pick<GetObjectsOptions, "orderBy">;
export type GetScenesParams = ITwinParams & Omit<GetScenesOptions, "delayMs">;
export type GetAllScenesParams = ITwinParams & GetScenesOptions;
export type PostSceneParams = ITwinParams & { scene: SceneCreate };
export type PatchSceneParams = SceneParams & { scene: SceneUpdate };
export type DeleteSceneParams = SceneParams;

export type GetObjectParams = ObjectParams;
export type GetObjectsParams = SceneParams & Omit<GetObjectsOptions, "delayMs">;
export type GetAllObjectsParams = SceneParams & GetObjectsOptions;
export type PostObjectsParams = SceneParams & BulkSceneObjectCreate;
export type PatchObjectParam = ObjectParams & { object: SceneObjectUpdate };
export type PatchObjectsParams = SceneParams & BulkSceneObjectUpdate;
export type DeleteObjectParams = ObjectParams;
export type DeleteObjectsParams = SceneParams & { objectIds: string[] };
