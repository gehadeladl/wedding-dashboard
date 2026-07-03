import {
  AppstoreOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  TeamOutlined,
  InboxOutlined,
  PictureOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import api from "@/services/api";
import { notification, Layout, Menu, Spin, Button, Grid } from "antd";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const screens = useBreakpoint();

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!screens.lg) {
      setMobileOpen(false);
    }
  }, [router.pathname]);

  const logout = async () => {
    try {
      setLogoutLoading(true);

      await api.post("/auth/logout");

      notification.success({
        message: "تم تسجيل الخروج",
      });

      router.push("/login");
    } catch {
      notification.error({
        message: "حدث خطأ",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">الرئيسية</Link>,
    },

    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/products">المنتجات</Link>,
    },

    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: <Link href="/customers">العملاء</Link>,
    },

    {
      key: "/inventory",
      icon: <InboxOutlined />,
      label: <Link href="/inventory">المخزون</Link>,
    },

    {
      key: "/website/sliders",
      icon: <PictureOutlined />,
      label: <Link href="/website/sliders">سلايدر الموقع</Link>,
    },

    {
      key: "/logout",
      icon: logoutLoading ? <Spin size="small" /> : <LogoutOutlined />,
      label: logoutLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج",
      danger: true,
    },
  ];

  const selectedMenuKey = router.pathname.startsWith("/products")
    ? "/products"
    : router.pathname.startsWith("/customers")
      ? "/customers"
      : router.pathname.startsWith("/inventory")
        ? "/inventory"
        : router.pathname.startsWith("/website/sliders")
          ? "/website/sliders"
          : "/dashboard";
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Overlay للموبايل */}
      {!screens.lg && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 999,
          }}
        />
      )}

      <Sider
        theme="dark"
        width={250}
        trigger={null}
        collapsible
        collapsed={screens.lg ? collapsed : false}
        collapsedWidth={screens.lg ? 80 : 0}
        breakpoint="lg"
        style={
          screens.lg
            ? {}
            : {
                position: "fixed",
                right: mobileOpen ? 0 : -250,
                top: 0,
                bottom: 0,
                zIndex: 1000,
                transition: "all .3s",
              }
        }
      >
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            padding: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Designer
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={items}
          onClick={({ key }) => {
            if (!screens.lg) {
              setMobileOpen(false);
            }

            if (key === "/logout" && !logoutLoading) {
              logout();
            }
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            paddingInline: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Button
              type="text"
              icon={
                screens.lg ? (
                  collapsed ? (
                    <MenuFoldOutlined />
                  ) : (
                    <MenuUnfoldOutlined />
                  )
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => {
                if (screens.lg) {
                  setCollapsed(!collapsed);
                } else {
                  setMobileOpen(!mobileOpen);
                }
              }}
            />

            <h3
              style={{
                margin: 0,
              }}
            >
              مصنع Designer
            </h3>
          </div>

          <span>مرحباً Admin</span>
        </Header>

        <Content
          style={{
            padding: 20,
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
