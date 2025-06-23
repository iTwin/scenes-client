// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { readFileSync } from "fs";
import { basename, extname } from "path";
import {
  getAllFilePaths,
  loadSchemas,
  validateDataMatchesSchema,
  validateSchemaIsLoaded,
} from "@bentley/itwin-scenes-schema-validation";

describe("Core Scenes Schema Tests", () => {
  beforeAll(() => {
    // Load schemas
    loadSchemas("./schemas");
  });

  describe("Test schemas with samples", () => {
    it("all schemas should have samples", () => {
      // Load all schema files
      const schemaFiles = getAllFilePaths("./schemas");

      // Load all sample files
      const sampleFiles = getAllFilePaths("./samples");
      const samples = sampleFiles.map((file) => basename(file));

      // Get list of missing samples, if any
      const missingSamples = [];
      schemaFiles.forEach((file) => {
        const schemaName = basename(file, extname(file));
        if (schemaName === "CommonTypes") {
          return; // Skip CommonTypes definitions
        }
        const sampleName = `${schemaName}.sample.json`;
        if (!samples.includes(sampleName)) {
          missingSamples.push(sampleName);
        }
      });

      expect(missingSamples.join("\n")).toBe("");
    });

    it("test schema validation with samples", async () => {
      // Load sample JSON files
      const sampleFiles = getAllFilePaths("./samples");
      const failedList = [];
      for (const file of sampleFiles) {
        // Parse json file
        const data = JSON.parse(readFileSync(file, "utf8"));
        const fileName = basename(file, extname(file));
        const parts = fileName.split(".");

        // Craft schema name and version from path
        const schemaName = parts[0];
        const schemaVersion = `${parts[1]}.${parts[2]}.${parts[3]}`;

        // Validate the sample data against the schema
        try {
          validateSchemaIsLoaded(schemaName, schemaVersion);
          validateDataMatchesSchema(schemaName, schemaVersion, data);
        } catch (error) {
          console.error(`Failed: ${schemaName} - ${schemaVersion}. Error: ${error.message}`);
          failedList.push(`${schemaName} - ${schemaVersion}.`);
        }
      }
      expect(failedList.join("\n")).toBe("");
    });
  });
});
