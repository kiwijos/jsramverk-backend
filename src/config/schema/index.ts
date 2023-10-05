import schema from "./schema";
import query from "./query";
import mutation from "./mutation";

// Spread query and mutation resolvers into a single object
const resolver = {
    ...query,
    ...mutation
};

export { resolver, schema };
