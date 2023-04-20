import { AccessToken } from "@/domain/model";
import { AuthenticationError } from "@/domain/errors";

export interface FacebookAuthentication {
  execute: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>;
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string;
  }

  export type Result = AccessToken | AuthenticationError;
}
