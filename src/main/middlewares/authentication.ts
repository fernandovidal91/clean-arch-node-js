import { adaptExpressMiddleware } from "../adapters";
import { makeAuthenticationMiddleware } from "../factories/middlewares/authentication";

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())
