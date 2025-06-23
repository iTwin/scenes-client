// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

// Custom ESLint rule to enforce no additional properties rule in domain schemas
// See https://eslint.org/docs/latest/extend/custom-rules
export default {
  meta: {
    type: "problem",
    docs: {
      description: 'Require "additionalProperties": false on all object types in JSON schemas',
    },
    messages: {
      additionalPropsFalse: 'Object types must set "additionalProperties": false',
    },
  },
  create: (context) => ({
    Object(node) {
      const isObjectType = node.members.some(
        (member) => member.name.value === "type" && member.value.value === "object",
      );
      // Only check object types
      if (!isObjectType) {
        return;
      }
      // Report object if missing '"additionalProperties": false'
      const hasAdditionalPropsFalse = node.members.some(
        (member) => member.name.value === "additionalProperties" && member.value.value === false,
      );
      if (!hasAdditionalPropsFalse) {
        context.report({ node, messageId: "additionalPropsFalse" });
      }
    },
  }),
};
