/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SceneCreate } from "./sceneCreate.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SceneUpsert extends Omit<SceneCreate, "id"> {}
