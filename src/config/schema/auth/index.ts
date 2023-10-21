import schema from "./schema";
import mutation from "./mutation";
import query from "./query";

// Spread query and mutation resolvers into a single object
const resolver = {
    ...query,
    ...mutation
};

export { resolver as authResolver, schema as authSchema };
