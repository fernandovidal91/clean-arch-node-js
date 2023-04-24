import { Router } from "express";
import { makeFacebookLoginController } from "@/main/factories/controllers";
import { adaptExpressRoute as adapt } from "@/main/adapters";

export default (router: Router) => {
  router.post('/api/login/facebook', adapt(makeFacebookLoginController()));
}
