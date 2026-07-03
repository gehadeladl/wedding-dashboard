import { parse } from "cookie";
import { verifyToken } from "./jwt";

export function getAuth(req) {
  try {
    const cookies = parse(req.headers.cookie || "");

    if (!cookies.token) {
      return null;
    }

    return verifyToken(cookies.token);
  } catch {
    return null;
  }
}
