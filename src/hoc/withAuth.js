import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";

export default function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    const { req } = context;

    const cookies = parse(req.headers.cookie || "");

    const token = cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      verifyToken(token);

      if (getServerSidePropsFunc) {
        return await getServerSidePropsFunc(context);
      }

      return {
        props: {},
      };
    } catch (error) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}
