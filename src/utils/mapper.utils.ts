import { TokenPayload } from "@/types/token-payload";

import { pick } from "@/utils/type.utils";

export function mapToTokenPayload<T extends TokenPayload>(
  obj: T,
): TokenPayload {
  return pick(obj, ["username", "email"]);
}
