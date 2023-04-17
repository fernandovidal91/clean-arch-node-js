import { AccessToken } from "@/domain/model";
import { AuthenticationError } from "@/domain/errors";

export interface IFacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>;
}

namespace FacebookAuthentication {
  export type Params = {
    token: string;
  }

  export type Result = AccessToken | AuthenticationError;
}
