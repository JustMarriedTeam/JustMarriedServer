import { createAccount } from "../../main/domain/services/account.service";
import jwtManager from "../../main/security/jwt/jwt.manager";

export function createAccountAndGetToken() {
  return createAccount({
    login: "test",
    password: "test",
    user: {}
  }).then((account) => jwtManager.releaseToken(account))
    .then((token) => token.token);
}

