import { useEffect, useState } from "react";
import { Button, Col, Row, Spin } from "antd";
import { motion } from "framer-motion";

import WebsiteLayout from "@/layouts/WebsiteLayout";
import api from "@/services/api";
import { fadeUpVariant, scaleInVariant } from "@/utils/animations";

export default function ShoesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const res = await api.get("/website/products?section=SHOES");
      setProducts(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getWhatsappLink = (productName) => {
    const phone = "201000000000";
    const message = `السلام عليكم، أريد الاستفسار عن الشوز: ${productName}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const renderPrice = (product) => {
    if (!product?.showPrice) return null;

    return (
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {product.price ? `${product.price} ج.م` : "اسأل عن السعر"}
      </div>
    );
  };

  if (loading) {
    return (
      <WebsiteLayout>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <section
        style={{
          padding: "160px 24px 80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #1e3a8a 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          custom={0.1}
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 12,
            }}
          >
            مصنع ديزاينر
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 6vw, 58px)",
              fontWeight: 900,
              lineHeight: 1.2,
              color: "#fff",
            }}
          >
            جميع الشوز
          </h1>

          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 700,
              fontSize: 18,
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            موديلات شوز متنوعة تناسب البدل والإطلالات الرسمية بأناقة وجودة
            عالية.
          </p>
        </motion.div>
      </section>

      <section
        style={{
          padding: "70px 24px 90px",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {products.length ? (
            <Row gutter={[20, 20]}>
              {products.map((product, index) => (
                <Col xs={24} md={12} lg={8} key={product.id}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={scaleInVariant}
                    custom={index * 0.08}
                    style={{
                      background: "#fff",
                      borderRadius: 24,
                      overflow: "hidden",
                      boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        height: 360,
                        backgroundImage: product?.images?.[0]?.imageUrl
                          ? `url(${product.images[0].imageUrl})`
                          : "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div style={{ padding: 20 }}>
                      <h3
                        style={{
                          margin: "0 0 10px",
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#111827",
                        }}
                      >
                        {product.name}
                      </h3>

                      {product.description && (
                        <p
                          style={{
                            margin: "0 0 16px",
                            color: "#64748b",
                            lineHeight: 1.8,
                          }}
                        >
                          {product.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        {renderPrice(product)}

                        <Button
                          type="primary"
                          shape="round"
                          href={getWhatsappLink(product.name)}
                          target="_blank"
                        >
                          تواصل
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                background: "#fff",
                borderRadius: 24,
                color: "#64748b",
                border: "1px dashed #cbd5e1",
              }}
            >
              لا توجد منتجات شوز مضافة حالياً
            </div>
          )}
        </div>
      </section>
    </WebsiteLayout>
  );
}
