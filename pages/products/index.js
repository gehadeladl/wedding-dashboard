import {
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import withAuth from "@/hoc/withAuth";
import PageHeader from "@/components/PageHeader";

const websiteSectionMap = {
  SUITS: "البدل",
  SHIRTS: "القمصان",
  BELTS: "الأحزمة",
  TIES_BOWTIES: "البابيون والكرافتات",
  SHOES: "الشوز",
  TSHIRTS_PULLOVERS: "التيشيرتات والبلوفرات",
};

const sectionColorMap = {
  SUITS: "blue",
  SHIRTS: "green",
  BELTS: "gold",
  TIES_BOWTIES: "purple",
  SHOES: "cyan",
  TSHIRTS_PULLOVERS: "magenta",
};

const sectionsOrder = [
  { key: "UNCLASSIFIED", title: "منتجات غير مصنفة", color: "default" },
  { key: "SUITS", title: "البدل", color: "blue" },
  { key: "SHIRTS", title: "القمصان", color: "green" },
  { key: "BELTS", title: "الأحزمة", color: "gold" },
  { key: "TIES_BOWTIES", title: "البابيون والكرافتات", color: "purple" },
  { key: "SHOES", title: "الشوز", color: "cyan" },
  {
    key: "TSHIRTS_PULLOVERS",
    title: "التيشيرتات والبلوفرات",
    color: "magenta",
  },
];

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  const isMobile = windowWidth < 576; // < 576px  → عمود المنتج فقط
  const isMedium = windowWidth < 992; // 576–991px → المنتج + السعر

  const getProducts = async () => {
    const res = await api.get("/products");
    setData(res.data || []);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      notification.success({ message: "تم حذف المنتج" });
      getProducts();
    } catch (error) {
      notification.error({ message: "حدث خطأ أثناء حذف المنتج" });
    }
  };

  const groupedProducts = {
    UNCLASSIFIED: data.filter((item) => !item.websiteSection),
    SUITS: data.filter((item) => item.websiteSection === "SUITS"),
    SHIRTS: data.filter((item) => item.websiteSection === "SHIRTS"),
    BELTS: data.filter((item) => item.websiteSection === "BELTS"),
    TIES_BOWTIES: data.filter((item) => item.websiteSection === "TIES_BOWTIES"),
    SHOES: data.filter((item) => item.websiteSection === "SHOES"),
    TSHIRTS_PULLOVERS: data.filter(
      (item) => item.websiteSection === "TSHIRTS_PULLOVERS",
    ),
  };

  const columns = [
    // عمود المنتج → دايماً ظاهر في كل الشاشات
    {
      title: "المنتج",
      width: 200,
      render: (_, row) => {
        const image = row.images?.[0]?.imageUrl;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {image ? (
              <img
                src={image}
                alt={row.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  objectFit: "cover",
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  background: "#f1f1f1",
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {row.name}
              </div>
              {row.description ? (
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    lineHeight: 1.7,
                    maxWidth: 240,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.description}
                </div>
              ) : (
                <div style={{ color: "#b0b0b0", fontSize: 12 }}>بدون وصف</div>
              )}
            </div>
          </div>
        );
      },
    },

    // السعر → يظهر في md و lg (مش في sm)
    ...(!isMobile
      ? [
          {
            title: "السعر",
            width: 140,
            render: (_, row) => (
              <span style={{ fontWeight: 700, color: "#111827" }}>
                {row.price ? `${row.price} جنيه` : "—"}
              </span>
            ),
          },
        ]
      : []),

    // إعدادات العرض → يظهر في lg فقط (≥992)
    ...(!isMedium
      ? [
          {
            title: "إعدادات العرض",
            width: 260,
            render: (_, row) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Tag
                  color={row.showPrice ? "green" : "red"}
                  style={{
                    borderRadius: 999,
                    paddingInline: 10,
                    paddingBlock: 4,
                    marginInlineEnd: 0,
                  }}
                >
                  {row.showPrice ? "السعر ظاهر" : "السعر مخفي"}
                </Tag>
                <Tag
                  color={row.showOnHome ? "blue" : "default"}
                  style={{
                    borderRadius: 999,
                    paddingInline: 10,
                    paddingBlock: 4,
                    marginInlineEnd: 0,
                  }}
                >
                  {row.showOnHome ? "يظهر في الرئيسية" : "مخفي من الرئيسية"}
                </Tag>
                <Tag
                  color="gold"
                  style={{
                    borderRadius: 999,
                    paddingInline: 10,
                    paddingBlock: 4,
                    marginInlineEnd: 0,
                  }}
                >
                  ترتيب: {row.displayOrder ?? 0}
                </Tag>
              </div>
            ),
          },
        ]
      : []),

    // ❌ عمود الإجراءات اتشال — دايماً في expandable
  ];

  const expandedRowRender = (row) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* السعر → في expandable لما يكون sm */}
      {isMobile && (
        <div>
          <strong>السعر: </strong>
          {row.price ? `${row.price} جنيه` : "—"}
        </div>
      )}

      {/* إعدادات العرض → في expandable لما يكون md أو sm */}
      {isMedium && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Tag color={row.showPrice ? "green" : "red"}>
            {row.showPrice ? "السعر ظاهر" : "السعر مخفي"}
          </Tag>
          <Tag color={row.showOnHome ? "blue" : "default"}>
            {row.showOnHome ? "يظهر في الرئيسية" : "مخفي من الرئيسية"}
          </Tag>
          <Tag color="gold">ترتيب الظهور: {row.displayOrder ?? 0}</Tag>
        </div>
      )}

      {/* الإجراءات دايماً في expandable في كل الشاشات */}
      <Space style={{ marginTop: 6 }}>
        <Link href={`/products/edit/${row.id}`}>
          <Button type="primary">تعديل</Button>
        </Link>
        <Popconfirm
          title="هل تريد حذف المنتج ؟"
          okText="نعم"
          cancelText="لا"
          onConfirm={() => deleteProduct(row.id)}
        >
          <Button danger>حذف</Button>
        </Popconfirm>
      </Space>
    </div>
  );

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[{ title: "المنتجات" }]}
        buttonText="إضافة منتج"
        buttonLink="/products/create"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sectionsOrder.map((section) => {
          const sectionProducts = groupedProducts[section.key] || [];

          return (
            <Card
              key={section.key}
              style={{ borderRadius: 18 }}
              bodyStyle={{ padding: 0 }}
            >
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    {section.title}
                  </h3>
                  <Tag
                    color={section.color}
                    style={{
                      borderRadius: 999,
                      paddingInline: 10,
                      paddingBlock: 4,
                      marginInlineEnd: 0,
                      fontWeight: 700,
                    }}
                  >
                    {sectionProducts.length} منتج
                  </Tag>
                </div>
              </div>

              <Table
                rowKey="id"
                columns={columns}
                dataSource={sectionProducts}
                pagination={false}
                locale={{ emptyText: "لا توجد منتجات في هذا القسم" }}
                scroll={{ x: "max-content" }}
                rowClassName={() => "products-table-row"}
                expandable={{
                  expandedRowRender,
                }}
              />
            </Card>
          );
        })}
      </div>

      <style jsx global>{`
        .products-table-row td {
          vertical-align: middle !important;
          padding-top: 18px !important;
          padding-bottom: 18px !important;
        }
      `}</style>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
