/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export type SceneObjectUpdateDTO = {
  /** Display name for the scene object */
  displayName?: string
  /** Number for the scene object's order in lists */
  order?: number
  /** Parent Id for the scene object (UUID) */
  parentId?: string
  /** iTwin Id the scene object is associated with (UUID) */
  iTwinId?: string
  /** Data for the scene object */
  data?: object
}

export type SceneObjectUpdateWithIdDTO = SceneObjectUpdateDTO & {
  /** Id of the scene object to update (UUID) */
  id: string
}
