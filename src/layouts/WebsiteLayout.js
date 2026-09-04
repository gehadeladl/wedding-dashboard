import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function WebsiteLayout({ children }) {
  const router = useRouter();

  const isHomePage = router.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = useMemo(
    () => [
      {
        label: "البدل",
        id: "suits-section",
        href: "/suits",
      },
      {
        label: "القمصان",
        id: "shirts-section",
        href: "/shirts",
      },
      {
        label: "الأحزمة",
        id: "belts-section",
        href: "/belts",
      },
      {
        label: "البابيون والكرافتات",
        id: "ties-section",
        href: "/ties-bowties",
      },
      {
        label: "الشوز",
        id: "shoes-section",
        href: "/shoes",
      },
      {
        label: "التيشيرتات والبلوفرات",
        id: "casual-section",
        href: "/casual",
      },
    ],
    [],
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (!isHomePage) return;

      const sections = navItems
        .map((item) => ({
          id: item.id,
          el: document.getElementById(item.id),
        }))
        .filter((item) => item.el);

      const scrollPosition = window.scrollY + 140;

      let current = "";

      for (const section of sections) {
        const top = section.el.offsetTop;
        const bottom = top + section.el.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          current = section.id;
          break;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, navItems]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileOpen(false);
  };

  const handleNavClick = (item) => {
    if (isHomePage) {
      scrollToSection(item.id);
      return;
    }

    setMobileOpen(false);
    router.push(item.href);
  };

  const getDesktopLinkStyle = (item) => {
    const isActive =
      isHomePage && activeSection
        ? activeSection === item.id
        : router.pathname === item.href;

    const darkMode = !scrolled && isHomePage;

    return {
      background: isActive
        ? darkMode
          ? "rgba(201,166,91,0.16)"
          : "rgba(201,166,91,0.10)"
        : "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: isActive ? 600 : 400,
      color: darkMode ? "#f8f6f0" : isActive ? "#c9a65b" : "#f8f6f0",
      padding: "5px 10px",
      borderRadius: 10,
      transition: "all 0.25s ease",
      whiteSpace: "nowrap",
      minWidth: 60,
    };
  };

  const getMobileLinkStyle = (item) => {
    const isActive =
      isHomePage && activeSection
        ? activeSection === item.id
        : router.pathname === item.href;

    return {
      width: "100%",
      textAlign: "right",
      background: isActive ? "rgba(201,166,91,0.12)" : "transparent",
      border: "none",
      borderRadius: 14,
      padding: "14px 16px",
      fontSize: 15,
      fontWeight: isActive ? 800 : 600,
      color: isActive ? "#c9a65b" : "#f8f6f0",
      cursor: "pointer",
    };
  };

  return (
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
      }}
      className="website-shell"
    >
      {/* ================= NAVBAR ================= */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: "rgba(18,18,18,0.88)",
          // background:
          //   scrolled || !isHomePage ? "rgba(18,18,18,0.88)" : "transparent",
          backdropFilter: scrolled || !isHomePage ? "blur(12px)" : "blur(0px)",
          borderBottom:
            scrolled || !isHomePage
              ? "1px solid rgba(201,166,91,0.18)"
              : "1px solid transparent",
          boxShadow:
            scrolled || !isHomePage ? "0 10px 30px rgba(0,0,0,0.28)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: isMobile ? "14px 16px" : "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <img
              src="/images/logo/logo.png"
              alt="Designer Mohamed Alaa"
              style={{
                width: 180,
                // width: isMobile ? 70 : 90,
                height: "auto",
                display: "block",
                objectFit: "contain",
                cursor: "pointer",
                transition: "all .3s ease",
              }}
            />
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={getDesktopLinkStyle(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Right side */}
          {!isMobile ? (
            <Button
              type={scrolled || !isHomePage ? "primary" : "default"}
              href="https://wa.me/201000000000"
              target="_blank"
              style={{
                borderRadius: 10,
                height: 35,
                fontWeight: 500,
                width: 80,
                border:
                  scrolled || !isHomePage
                    ? undefined
                    : "1px solid rgba(201,166,91,0.65)",
                color: scrolled || !isHomePage ? undefined : "#f8f6f0",
                background: "rgba(18,18,18,0.92)",
                //  background:
                // scrolled || !isHomePage ? undefined : "rgba(18,18,18,0.92)",
              }}
            >
              واتساب
            </Button>
          ) : (
            <Button
              type="text"
              icon={
                <MenuOutlined
                  style={{
                    fontSize: 22,
                    color: "#c9a65b",
                  }}
                />
              }
              onClick={() => setMobileOpen(true)}
            />
          )}
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        title="القائمة"
        placement="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={320}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              style={getMobileLinkStyle(item)}
            >
              {item.label}
            </button>
          ))}

          <Button
            type="primary"
            href="https://wa.me/201000000000"
            target="_blank"
            style={{
              marginTop: 12,
              height: 46,
              borderRadius: 14,
              fontWeight: 700,
            }}
          >
            تواصل عبر واتساب
          </Button>
        </div>
      </Drawer>

      {/* ================= PAGE CONTENT ================= */}
      <main>{children}</main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          marginTop: 80,
          background: "#121212",
          color: "#fff",
          borderTop: "1px solid rgba(201,166,91,.18)",
          padding: "28px 20px",
          textAlign: "center",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        جميع الحقوق محفوظة لمصنع ديزاينر © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
