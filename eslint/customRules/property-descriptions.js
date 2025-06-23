// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

// Custom ESLint rule to enforce descritpion properties in domain schemas
// See https://eslint.org/docs/latest/extend/custom-rules
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require descriptions on all properties in JSON schemas",
    },
    messages: {
      missingDescription: "Property '{{name}}' is missing a description.",
    },
  },
  create: (context) => ({
    Member(node) {
      if (node.name.value === "properties") {
        // For each property, check if description field is present
        node.value.members.forEach((member) => {
          const descriptionProperty = member.value.members.some(
            (member) => member.name.value === "description",
          );
          // Report if description is missing or empty
          if (!descriptionProperty) {
            context.report({
              node: member,
              messageId: "missingDescription",
              data: { name: member.name.value },
            });
          }
        });
      }
    },
  }),
};
