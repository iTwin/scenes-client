/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { describe, expectTypeOf, it } from "vitest";
import {
  CreateSceneObjectOperation,
  CutoutCreateV2,
  CutoutV1,
  CutoutV2,
  LayerV1,
  SceneObject,
  SceneObjectCreate,
  SceneObjectUpdate,
  SchemaData,
  SchemaKind,
  SchemaVersion,
  UpdateSceneObjectOperation,
} from "../src/models/index.js";

describe("SchemaVersion", () => {
  it("includes every version of every kind in a union", () => {
    expectTypeOf<"2.0.0">().toExtend<SchemaVersion<SchemaKind>>();
    expectTypeOf<SchemaVersion<"Cutout" | "Layer">>().toEqualTypeOf<"1.0.0" | "2.0.0">();
  });

  it("keeps only the versions of a single kind", () => {
    expectTypeOf<SchemaVersion<"Layer">>().toEqualTypeOf<"1.0.0">();
  });
});

describe("SchemaData", () => {
  it("keeps only valid pairs of a kind and a version", () => {
    expectTypeOf<SchemaData<"Cutout" | "Layer", "2.0.0">>().toEqualTypeOf<
      SchemaData<"Cutout", "2.0.0">
    >();
  });
});

describe("SceneObject", () => {
  it("accepts every version of a kind by default", () => {
    expectTypeOf<CutoutV1>().toExtend<SceneObject>();
    expectTypeOf<CutoutV2>().toExtend<SceneObject>();
    expectTypeOf<LayerV1>().toExtend<SceneObject>();
  });

  it("keeps explicit kind and version arguments", () => {
    expectTypeOf<SceneObject<"Cutout", "2.0.0">>().toEqualTypeOf<CutoutV2>();
    expectTypeOf<SceneObject<"Cutout">>().toEqualTypeOf<CutoutV1 | CutoutV2>();
  });

  it("narrows by kind and version", () => {
    expectTypeOf<
      Extract<SceneObject, { kind: "Cutout"; version: "2.0.0" }>
    >().toEqualTypeOf<CutoutV2>();
  });
});

describe("SceneObjectCreate", () => {
  it("accepts every version of a kind by default", () => {
    expectTypeOf<CutoutCreateV2>().toExtend<SceneObjectCreate>();
  });
});

describe("SceneObjectUpdate", () => {
  it("accepts data of every version of a kind by default", () => {
    expectTypeOf<{ data: SchemaData<"Cutout", "2.0.0"> }>().toExtend<SceneObjectUpdate>();
  });

  it("keeps explicit kind and version arguments", () => {
    expectTypeOf<SceneObjectUpdate<"Cutout", "2.0.0">["data"]>().toEqualTypeOf<
      SchemaData<"Cutout", "2.0.0"> | undefined
    >();
  });
});

describe("Scene object operations", () => {
  it("accept every version of a kind by default", () => {
    expectTypeOf<{ payload: CutoutCreateV2 }>().toExtend<
      Pick<CreateSceneObjectOperation, "payload">
    >();
    expectTypeOf<{ payload: { data: SchemaData<"Cutout", "2.0.0"> } }>().toExtend<
      Pick<UpdateSceneObjectOperation, "payload">
    >();
  });
});
