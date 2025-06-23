// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import additionalPropsRule from "./customRules/no-additional-properties.js";
import noStringRule from "./customRules/no-plain-string-types.js";
import objectTypeRule from "./customRules/top-level-objects.js";
import descriptionsRule from "./customRules/property-descriptions.js";

/* Custom ESLint plugin for scene schema rules */
const sceneSchemaPlugin = {
  rules: {
    "no-plain-string-types": noStringRule,
    "top-level-object-type": objectTypeRule,
    "no-additional-properties": additionalPropsRule,
    "property-descriptions": descriptionsRule,
  },
};

export default sceneSchemaPlugin;
