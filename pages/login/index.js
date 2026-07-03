import { Button, Card, Checkbox, Form, Input, notification } from "antd";

import { useState } from "react";
import { useRouter } from "next/router";

import api from "@/services/api";
import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";
export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await api.post("/auth/login", values);

      notification.success({
        message: "تم تسجيل الدخول بنجاح",
      });

      router.push("/dashboard");
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "فشل تسجيل الدخول",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <Card
        title="تسجيل الدخول"
        style={{
          width: 450,
          borderRadius: 12,
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="اسم المستخدم"
            name="username"
            rules={[
              {
                required: true,
                message: "أدخل اسم المستخدم",
              },
            ]}
          >
            <Input size="large" placeholder="اسم المستخدم" />
          </Form.Item>

          <Form.Item
            label="كلمة المرور"
            name="password"
            rules={[
              {
                required: true,
                message: "أدخل كلمة المرور",
              },
            ]}
          >
            <Input.Password size="large" placeholder="كلمة المرور" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>تذكرني</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            تسجيل الدخول
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = parse(context.req.headers.cookie || "");

    if (cookies.token) {
      verifyToken(cookies.token);

      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
  } catch {}

  return {
    props: {},
  };
}
