import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Carousel, Col, Row, Spin } from "antd";
import { motion } from "framer-motion";

import WebsiteLayout from "@/layouts/WebsiteLayout";
import api from "@/services/api";
import {
  fadeInVariant,
  fadeUpVariant,
  scaleInVariant,
} from "@/utils/animations";

export default function HomePage() {
  const [sliders, setSliders] = useState([]);
  const [sections, setSections] = useState({
    suits: [],
    shirts: [],
    belts: [],
    tiesBowties: [],
    shoes: [],
    casual: [],
  });
  const [loading, setLoading] = useState(true);

  const getHomeData = async () => {
    try {
      const res = await api.get("/website/home");

      setSliders(res.data?.sliders || []);
      setSections(
        res.data?.sections || {
          suits: [],
          shirts: [],
          belts: [],
          tiesBowties: [],
          shoes: [],
          casual: [],
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  const getWhatsappLink = (productName) => {
    const phone = "201000000000"; // غيره برقم المصنع الحقيقي
    const message = `السلام عليكم، أريد الاستفسار عن المنتج: ${productName}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const renderEmptyState = (text = "لا توجد منتجات حالياً") => (
    <div
      style={{
        padding: "32px 20px",
        borderRadius: 20,
        background: "#1d1d1d",
        textAlign: "center",
        color: "var(--muted)",
        border: "1px dashed var(--muted)",
      }}
    >
      {text}
    </div>
  );

  const renderPrice = (product, dark = false) => {
    if (!product?.showPrice) return null;

    return (
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#fff",
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
      {/* ===================== HERO ===================== */}
      <section
        style={{
          position: "relative",
          minHeight: "500px",
          overflow: "hidden",
          background: "#111827",
        }}
      >
        {sliders.length ? (
          <Carousel autoplay autoplaySpeed={30000} dots arrows speed={700}>
            {sliders.map((slider) => (
              <div key={slider.id}>
                <div
                  style={{
                    minHeight: "500px",
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${slider.imageUrl})`,
                    backgroundSize: "contain",
                    // backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "100px",
                  }}
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariant}
                    custom={0.1}
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      maxWidth: 900,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 18,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      مصنع ديزاينر
                    </div>

                    <h1
                      style={{
                        margin: 0,
                        fontSize: "clamp(36px, 6vw, 64px)",
                        lineHeight: 1.2,
                        fontWeight: 900,
                        color: "#fff",
                      }}
                    >
                      أناقة مفصلة خصيصًا لإطلالتك
                    </h1>

                    <p
                      style={{
                        margin: "20px auto 0",
                        maxWidth: 760,
                        fontSize: 18,
                        lineHeight: 1.9,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      بدل، قمصان، أحزمة، شوز، بابيون وكرافتات بأفضل الخامات
                      والتفاصيل.
                    </p>
                  </motion.div>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "120px 24px 80px",
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #111827 100%)",
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              custom={0.1}
              style={{
                textAlign: "center",
                color: "#fff",
                maxWidth: 900,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 18,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                مصنع ديزاينر
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(36px, 6vw, 64px)",
                  lineHeight: 1.2,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                أناقة مفصلة خصيصًا لإطلالتك
              </h1>

              <p
                style={{
                  margin: "20px auto 0",
                  maxWidth: 760,
                  fontSize: 18,
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                بدل، قمصان، أحزمة، شوز، بابيون وكرافتات بأفضل الخامات والتفاصيل.
              </p>
            </motion.div>
          </div>
        )}
      </section>

      {/* ===================== SUITS ===================== */}
      <section
        id="suits-section"
        style={{
          padding: "40px 24px 40px",
          background: "#0f0f0f",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم البدل
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              بدل مختارة بعناية
            </h2>
          </motion.div>

          {sections.suits.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.suits.map((product, index) => (
                  <Col xs={24} md={12} lg={8} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={scaleInVariant}
                      custom={index * 0.08}
                      style={{
                        background: "#1d1d1d",
                        borderRadius: 24,
                        overflow: "hidden",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    >
                      <div
                        style={{
                          height: 360,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, #171717 0%, #1d1d1d 100%)",
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

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/suits">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد بدل مضافة حالياً")
          )}
        </div>
      </section>

      {/* ===================== SHIRTS ===================== */}
      <section
        id="shirts-section"
        style={{
          padding: "40px 24px 40px",
          background: "#171717",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم القمصان
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              قمصان بألوان وخامات مختلفة
            </h2>
          </motion.div>

          {sections.shirts.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.shirts.map((product, index) => (
                  <Col xs={24} sm={12} lg={8} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={fadeUpVariant}
                      custom={index * 0.08}
                      style={{
                        background: "#1d1d1d",
                        borderRadius: 20,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: 280,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <div style={{ padding: 18 }}>
                        <h3
                          style={{
                            margin: "0 0 10px",
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#111827",
                          }}
                        >
                          {product.name}
                        </h3>

                        {product.description && (
                          <p
                            style={{
                              margin: "0 0 14px",
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

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/shirts">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد قمصان مضافة حالياً")
          )}
        </div>
      </section>

      {/* ===================== BELTS ===================== */}
      <section
        id="belts-section"
        style={{
          padding: "40px 24px 40px",
          background: "#0f0f0f",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم الأحزمة
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              أحزمة عادية وعريضة
            </h2>
          </motion.div>

          {sections.belts.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.belts.map((product, index) => (
                  <Col xs={24} md={12} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={fadeInVariant}
                      custom={index * 0.1}
                      style={{
                        background: "#111827",
                        color: "#fff",
                        borderRadius: 24,
                        padding: 24,
                        minHeight: 240,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <h3
                          style={{
                            margin: "0 0 12px",
                            fontSize: 26,
                            fontWeight: 800,
                            color: "#fff",
                          }}
                        >
                          {product.name}
                        </h3>

                        {product.description && (
                          <p
                            style={{
                              margin: "0 0 16px",
                              color: "rgba(255,255,255,0.8)",
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
                            gap: 12,
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                          }}
                        >
                          {renderPrice(product, true)}

                          <Button
                            shape="round"
                            href={getWhatsappLink(product.name)}
                            target="_blank"
                          >
                            تواصل
                          </Button>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 220,
                          height: 180,
                          borderRadius: 20,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          flexShrink: 0,
                        }}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/belts">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد أحزمة مضافة حالياً")
          )}
        </div>
      </section>

      {/* ===================== TIES & BOWTIES ===================== */}
      <section
        id="ties-section"
        style={{
          padding: "40px 24px 40px",
          background: "#171717",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم البابيون والكرافتات
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              لمسات الإطلالة الأخيرة
            </h2>
          </motion.div>

          {sections.tiesBowties.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.tiesBowties.map((product, index) => (
                  <Col xs={24} sm={12} md={8} lg={4} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={scaleInVariant}
                      custom={index * 0.05}
                      style={{
                        background: "#1d1d1d",
                        borderRadius: 18,
                        padding: 16,
                        border: "1px solid #edf2f7",
                        textAlign: "center",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: 180,
                          borderRadius: 14,
                          marginBottom: 14,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <h3
                        style={{
                          margin: "0 0 8px",
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#111827",
                        }}
                      >
                        {product.name}
                      </h3>

                      <div style={{ marginBottom: 12 }}>
                        {renderPrice(product)}
                      </div>

                      <Button
                        size="small"
                        shape="round"
                        href={getWhatsappLink(product.name)}
                        target="_blank"
                      >
                        تواصل
                      </Button>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/ties-bowties">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد بابيونات أو كرافتات مضافة حالياً")
          )}
        </div>
      </section>

      {/* ===================== SHOES ===================== */}
      <section
        id="shoes-section"
        style={{
          padding: "40px 24px 40px",
          background: "#0f0f0f",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم الشوز
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              شوز كلاسيك وكاجوال
            </h2>
          </motion.div>

          {sections.shoes.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.shoes.map((product, index) => (
                  <Col xs={24} md={8} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={fadeUpVariant}
                      custom={index * 0.1}
                      style={{
                        background: "#1d1d1d",
                        borderRadius: 28,
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: 320,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <div style={{ padding: 20 }}>
                        <h3
                          style={{
                            margin: "0 0 12px",
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
                              margin: "0 0 14px",
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

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/shoes">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد منتجات شوز مضافة حالياً")
          )}
        </div>
      </section>

      {/* ===================== CASUAL ===================== */}
      <section
        id="casual-section"
        style={{
          padding: "90px 24px 100px",
          background: "#171717",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            custom={0.1}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#c9a65b",
                marginBottom: 10,
              }}
            >
              قسم التيشيرتات والبلوفرات
            </div>

            <h2
              style={{
                fontSize: 34,
                margin: 0,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              خيارات كاجوال يومية
            </h2>
          </motion.div>

          {sections.casual.length ? (
            <>
              <Row gutter={[20, 20]}>
                {sections.casual.map((product, index) => (
                  <Col xs={24} sm={12} lg={6} key={product.id}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={scaleInVariant}
                      custom={index * 0.08}
                      style={{
                        background: "#0f172a",
                        color: "#fff",
                        borderRadius: 24,
                        overflow: "hidden",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: 260,
                          backgroundImage: product?.images?.[0]?.imageUrl
                            ? `url(${product.images[0].imageUrl})`
                            : "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <div style={{ padding: 18 }}>
                        <h3
                          style={{
                            margin: "0 0 10px",
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#fff",
                          }}
                        >
                          {product.name}
                        </h3>

                        {product.description && (
                          <p
                            style={{
                              margin: "0 0 14px",
                              color: "rgba(255,255,255,0.8)",
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
                          {renderPrice(product, true)}

                          <Button
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

              <div
                style={{
                  marginTop: 28,
                  textAlign: "center",
                }}
              >
                <Link href="/casual">
                  <Button size="large" shape="round">
                    عرض المزيد
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            renderEmptyState("لا توجد منتجات كاجوال مضافة حالياً")
          )}
        </div>
      </section>
    </WebsiteLayout>
  );
}
