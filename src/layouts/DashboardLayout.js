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
      className="dashboard-shell"
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
            background: "rgba(0,0,0,.7)",
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
            padding: "3px 15px",
            marginBottom: "10px",
          }}
        >
          {collapsed ? (
            <Link href="/" style={{ textDecoration: "none" }}>
              <img
                src="/images/logo/logoRes.png"
                alt="Designer Mohamed Alaa"
                style={{
                  width: 50,
                  // width: isMobile ? 70 : 90,
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  margin: "auto",
                }}
              />
            </Link>
          ) : (
            <Link href="/" style={{ textDecoration: "none" }}>
              <img
                src="/images/logo/logo.png"
                alt="Designer Mohamed Alaa"
                style={{
                  width: 170,
                  // width: isMobile ? 70 : 90,
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  margin: "auto",
                }}
              />
            </Link>
          )}
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
            background: "rgba(18,18,18,.92)",
            paddingInline: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 20px rgba(0,0,0,.25)",
            borderBottom: "1px solid rgba(201,166,91,.18)",
            color: "#f8f6f0",
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
