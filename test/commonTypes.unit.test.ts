// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { loadSchema, ajv } from "@bentley/itwin-scenes-schema-validation";

describe("Common Types Schema Tests", () => {
  beforeAll(() => {
    loadSchema("./schemas/CommonTypes.json");
  });

  describe("Test CommonType definitions", () => {
    it("dateTime validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/dateTime";
      // VALID
      // YYYY-MM-DDThh:mm:ssZ
      expect(ajv.validate(schema, "2024-04-15T12:11:00Z")).toBe(true);
      // YYYY-MM-DDThh:mm:ss.sssZ
      expect(ajv.validate(schema, "2024-04-15T12:11:00.000Z")).toBe(true);

      // INVALID
      // YYYY-MM-DDThh:mm:sssZ
      expect(ajv.validate(schema, "2024-04-15T12:11:000Z")).toBe(false);
      // YYYY-MM-DDThh:mm:ss.Z
      expect(ajv.validate(schema, "2024-04-15T12:11:00.Z")).toBe(false);
      // YYYY-MM-DDThh:mm:ss
      expect(ajv.validate(schema, "2024-04-15T12:11:00")).toBe(false);
    });

    it("alphaNumericString validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/alphaNumericString";
      // VALID
      // numbers and letters
      expect(ajv.validate(schema, "12AlphaNumeric3")).toBe(true);
      // numbers only
      expect(ajv.validate(schema, "567")).toBe(true);
      // letters only
      expect(ajv.validate(schema, "lowercase")).toBe(true);
      // letters only
      expect(ajv.validate(schema, "UPPERCASE")).toBe(true);
      // single letter
      expect(ajv.validate(schema, "z")).toBe(true);
      // single number
      expect(ajv.validate(schema, "0")).toBe(true);

      // INVALID
      expect(ajv.validate(schema, "under_score")).toBe(false);
      expect(ajv.validate(schema, "not.valid")).toBe(false);
      expect(ajv.validate(schema, "#")).toBe(false);
      expect(ajv.validate(schema, "Hi!")).toBe(false);
    });

    it("id64 validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/id64";
      // VALID
      expect(ajv.validate(schema, "0")).toBe(true);
      expect(ajv.validate(schema, "0x1200")).toBe(true);
      expect(ajv.validate(schema, "0xabc34f")).toBe(true);
      expect(ajv.validate(schema, "0x3456789abcdef08")).toBe(true); // max length

      // INVALID
      expect(ajv.validate(schema, "0x")).toBe(false);
      expect(ajv.validate(schema, "0x0x")).toBe(false);
      expect(ajv.validate(schema, "0xABC34F")).toBe(false); // uppercase
      expect(ajv.validate(schema, "0x0123")).toBe(false); // 0x followed by zero
      expect(ajv.validate(schema, "0x34567890123456789")).toBe(false); // over max length
      expect(ajv.validate(schema, "not an id")).toBe(false);
      expect(ajv.validate(schema, "12340")).toBe(false);
      expect(ajv.validate(schema, "0!")).toBe(false);
      expect(ajv.validate(schema, " ")).toBe(false);
      expect(ajv.validate(schema, "")).toBe(false);
    });

    it("compressedId64Set validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/compressedId64Set";
      // VALID (examples from itwinjs-core id tests)
      expect(ajv.validate(schema, "")).toBe(true);
      expect(ajv.validate(schema, "+2")).toBe(true);
      expect(ajv.validate(schema, "+1+4")).toBe(true);
      expect(ajv.validate(schema, "+3+4+1+2")).toBe(true);
      expect(ajv.validate(schema, "+FF+51")).toBe(true);
      expect(ajv.validate(schema, "+1*5")).toBe(true);
      expect(ajv.validate(schema, "+1*4+4*3")).toBe(true);
      expect(ajv.validate(schema, "+1+2710*17+1")).toBe(true);
      expect(ajv.validate(schema, "+FFFFFFFFFE+3")).toBe(true);
      expect(ajv.validate(schema, "+4000000023A+9FFFFFFFF8F")).toBe(true);
      expect(ajv.validate(schema, "+F0A0000000100+20*2+C2")).toBe(true);
      expect(ajv.validate(schema, "+21234567890+10000000000*2+20000000000")).toBe(true);
      expect(ajv.validate(schema, "+1000000000000001+3000000000000003*2+3000007777777770")).toBe(
        true,
      );

      // INVALID
      expect(ajv.validate(schema, "FFFFFFFFFE+3")).toBe(false); // doesn't start with +
      expect(ajv.validate(schema, "*FFFFFFFFFE+3")).toBe(false); // doesn't start with +
      expect(ajv.validate(schema, "+*5")).toBe(false); // + followed by *
      expect(ajv.validate(schema, "++5")).toBe(false); // + followed by +
      expect(ajv.validate(schema, "+fffe+3")).toBe(false); // lowercase
      expect(ajv.validate(schema, ["0xff", "0x150"])).toBe(false); // non-compressed id64 set
      expect(ajv.validate(schema, "0")).toBe(false); // id64 string
      expect(ajv.validate(schema, "0x1200")).toBe(false); // id64 string
      expect(ajv.validate(schema, "0xabc34f")).toBe(false); // id64 string
      expect(ajv.validate(schema, "not an id")).toBe(false);
      expect(ajv.validate(schema, "1234")).toBe(false);
      expect(ajv.validate(schema, 1234)).toBe(false);
      expect(ajv.validate(schema, "+5!")).toBe(false);
      expect(ajv.validate(schema, " ")).toBe(false);
      expect(ajv.validate(schema, [])).toBe(false);
    });

    it("guid validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/guid";
      // VALID
      expect(ajv.validate(schema, "03b7cc6c-a6d4-43b4-8df8-2e77a700a5d8")).toBe(true);
      expect(ajv.validate(schema, "03B7CC6C-A6D4-43B4-8DF8-2E77A700A5D8")).toBe(true);
      expect(ajv.validate(schema, "00000000-0000-0000-0000-000000000000")).toBe(true);

      // INVALID
      expect(ajv.validate(schema, "not a uuid")).toBe(false);
      expect(ajv.validate(schema, "123456789")).toBe(false);
      expect(ajv.validate(schema, "03b7cc6ca6d443b48df82e77a700a5d8")).toBe(false);
      expect(ajv.validate(schema, "0000000!-0000-0000-0000-000000000000")).toBe(false);
      // Invalid lengths (should be <8 chars>-<4 chars>-<4 chars>-<4 chars>-<12 chars>)
      // 9-4-4-4-12
      expect(ajv.validate(schema, "000000000-a6d4-43b4-8df8-2e77a700a5d8")).toBe(false);
      // 7-4-4-4-12
      expect(ajv.validate(schema, "0000000-a6d4-43b4-8df8-2e77a700a5d8")).toBe(false);
      // 8-5-4-4-12
      expect(ajv.validate(schema, "03b7cc6c-00000-43b4-8df8-2e77a700a5d8")).toBe(false);
      // 8-3-4-4-12
      expect(ajv.validate(schema, "03b7cc6c-000-43b4-8df8-2e77a700a5d8")).toBe(false);
      // 8-4-5-4-12
      expect(ajv.validate(schema, "03b7cc6c-a6d4-00000-8df8-2e77a700a5d8")).toBe(false);
      // 8-4-3-4-12
      expect(ajv.validate(schema, "03b7cc6c-a6d4-000-8df8-2e77a700a5d8")).toBe(false);
      // 8-4-4-5-12
      expect(ajv.validate(schema, "03b7cc6c-a6d4-43b4-00000-2e77a700a5d8")).toBe(false);
      // 8-4-4-3-12
      expect(ajv.validate(schema, "03b7cc6c-a6d4-43b4-000-2e77a700a5d8")).toBe(false);
      // 8-4-4-4-13
      expect(ajv.validate(schema, "03b7cc6c-a6d4-43b4-8df8-0000000000000")).toBe(false);
      // 8-4-4-4-11
      expect(ajv.validate(schema, "03b7cc6c-a6d4-43b4-8df8-00000000000")).toBe(false);
    });

    it("safeString validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/safeString";
      // VALID
      expect(ajv.validate(schema, "123 = Safe-String!")).toBe(true);
      expect(ajv.validate(schema, "Plant_04.i")).toBe(true);
      expect(ajv.validate(schema, "01:02")).toBe(true);
      expect(ajv.validate(schema, "0x0123")).toBe(true);
      expect(ajv.validate(schema, "AlphaNumeric567")).toBe(true);
      expect(ajv.validate(schema, "?!@_/")).toBe(true);
      expect(ajv.validate(schema, "")).toBe(true);

      // INVALID
      expect(ajv.validate(schema, "disallowed chars ∆ * % ^")).toBe(false);
      expect(ajv.validate(schema, "less than < is invalid")).toBe(false);
      expect(ajv.validate(schema, "greater than > is invalid")).toBe(false);
      expect(ajv.validate(schema, "ampersand & is invalid")).toBe(false);
      // eslint-disable-next-line quotes
      expect(ajv.validate(schema, '"double quotes"')).toBe(false);
      expect(ajv.validate(schema, "'single quotes'")).toBe(false);
    });

    it("vector3d validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/vector3d";
      // VALID
      expect(
        ajv.validate(schema, {
          x: 0,
          y: 1,
          z: 0,
        }),
      ).toBe(true);
      expect(
        ajv.validate(schema, {
          x: -5,
          y: -5,
          z: -5,
        }),
      ).toBe(true);

      // INVALID
      expect(ajv.validate(schema, [0, 1, 0])).toBe(false);
      expect(
        ajv.validate(schema, {
          x: 0,
          y: 1,
        }),
      ).toBe(false);
      expect(
        ajv.validate(schema, {
          x: "a",
          y: "b",
          z: "c",
        }),
      ).toBe(false);
    });

    it("transform validation", () => {
      const schema = "/schemas/CommonTypes#/definitions/transform";
      // VALID
      expect(ajv.validate(schema, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(true);
      expect(ajv.validate(schema, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])).toBe(true);

      // INVALID
      expect(ajv.validate(schema, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(false);
      expect(
        ajv.validate(schema, [
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
        ]),
      ).toBe(false);
    });
  });
});
