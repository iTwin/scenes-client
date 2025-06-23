// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

// Custom ESLint rule to enforce all domain schemas have a description
// See https://eslint.org/docs/latest/extend/custom-rules
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require top-level json schema descriptions",
    },
    messages: {
      schemaDescription: "Schema must contain a top-level description",
    },
  },
  create: (context) => {
    return {
      Document(node) {
        const sourceCode = context.getSourceCode();
        const data = JSON.parse(sourceCode.text);
        if (!data.description) {
          context.report({
            node,
            messageId: "schemaDescription",
          });
        }
      },
    };
  },
};
