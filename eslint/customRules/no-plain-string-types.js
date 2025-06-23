// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

// Custom ESLint rule to disallow "type": "string" in domain schemas
// See https://eslint.org/docs/latest/extend/custom-rules
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow string type in json schemas",
    },
    messages: {
      stringType: "String properties must use CommonTypes definitions",
    },
    fixable: "code",
  },
  create: (context) => {
    return {
      Member(node) {
        if (node.name.value === "type" && node.value.value === "string") {
          context.report({
            loc: node.loc,
            messageId: "stringType",
            data: { type: "string" },
            fix: (fixer) => {
              // Linting with --fix option will replace 'type': 'string' with safeString definition
              return fixer.replaceText(
                node,
                '"$ref": "/schemas/CommonTypes#/definitions/safeString"',
              );
            },
          });
        }
      },
    };
  },
};
