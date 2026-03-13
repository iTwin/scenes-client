/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { GetObjectsOptions } from "./object/getObjectsOptions.js";
import { BulkSceneObjectCreate } from "./object/sceneObjectCreate.js";
import { BulkSceneObjectOperations } from "./object/sceneObjectOperations.js";
import { BulkSceneObjectUpdate, SceneObjectUpdate } from "./object/sceneObjectUpdate.js";
import { GetScenesOptions } from "./scene/getScenesOptions.js";
import { SceneCreate } from "./scene/sceneCreate.js";
import { SceneUpdate } from "./scene/sceneUpdate.js";
import { SceneUpsert } from "./scene/sceneUpsert.js";
import { GetTagsOptions } from "./tag/getTagsOptions.js";
import { TagCreate } from "./tag/tagCreate.js";
import { TagUpdate } from "./tag/tagUpdate.js";

export type ITwinParams = { iTwinId: string };
export type SceneParams = ITwinParams & { sceneId: string };
export type ObjectParams = SceneParams & { objectId: string };
export type TagParams = ITwinParams & { tagId: string };

export type GetSceneMetadataParams = SceneParams;
export type GetSceneParams = SceneParams & Pick<GetObjectsOptions, "orderBy">;
export type GetScenesParams = ITwinParams & Omit<GetScenesOptions, "delayMs">;
export type GetAllScenesParams = ITwinParams & GetScenesOptions;
export type PostSceneParams = ITwinParams & { scene: SceneCreate };
export type PutSceneParams = SceneParams & { scene: SceneUpsert };
export type PatchSceneParams = SceneParams & { scene: SceneUpdate };
export type DeleteSceneParams = SceneParams;

export type GetObjectParams = ObjectParams;
export type GetObjectsParams = SceneParams & Omit<GetObjectsOptions, "delayMs">;
export type GetAllObjectsParams = SceneParams & GetObjectsOptions;
export type PostObjectsParams = SceneParams & BulkSceneObjectCreate;
export type PatchObjectParam = ObjectParams & { object: SceneObjectUpdate };
export type PatchObjectsParams = SceneParams & BulkSceneObjectUpdate;
export type PatchObjectsOperationsParams = SceneParams & BulkSceneObjectOperations;
export type DeleteObjectParams = ObjectParams;
export type DeleteObjectsParams = SceneParams & { objectIds: string[] };

export type GetTagParams = TagParams;
export type GetTagsParams = ITwinParams & Omit<GetTagsOptions, "delayMs">;
export type GetAllTagsParams = ITwinParams & GetTagsOptions;
export type PostTagParams = ITwinParams & { tag: TagCreate };
export type PatchTagParams = TagParams & { tag: TagUpdate };
export type DeleteTagParams = TagParams;
