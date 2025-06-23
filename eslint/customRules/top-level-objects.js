// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

// Custom ESLint rule to enforce top level object type in domain schemas
// See https://eslint.org/docs/latest/extend/custom-rules
export default {
  meta: {
    type: "problem",
    docs: {
      description: 'Require top-level "type" in json schemas to be "object"',
    },
    messages: {
      objectType: 'Top-level "type" must be "object". Received "{{type}}".',
    }
  },
  create: (context) => {
    return {
      Document(node) {
        const sourceCode = context.getSourceCode();
        const data = JSON.parse(sourceCode.text);
        if (data.type !== "object") {
          context.report({
            node,
            messageId: "objectType",
            data: {type: data.type},
          });
        }
      }
    };
  },
};
