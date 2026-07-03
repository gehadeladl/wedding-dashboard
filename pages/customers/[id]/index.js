import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  Row,
  Spin,
  Tag,
  Steps,
  Select,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import api from "@/services/api";
import withAuth from "@/hoc/withAuth";

import dayjs from "dayjs";
import Link from "next/link";

const statusIndex = {
  NEW: 0,
  MEASURED: 1,
  IN_PROGRESS: 2,
  FITTING_READY: 3,
  READY: 4,
  DELIVERED: 5,
};
export default function CustomerDetails() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  console.log(customer);

  const [loading, setLoading] = useState(true);

  const collarImageMap = {
    NOTCH: "/images/notch-lapel.jfif",
    PEAK: "/images/peak-lapel.jfif",
    SHAWL: "/images/shawl-lapel.jpg",
  };

  const collarMap = {
    NOTCH: "نوتش لابيل",
    PEAK: "بيك لابيل",
    SHAWL: "شول لابيل",
  };

  const vestCollarMap = {
    WITH_COLLAR: "بياقة",
    WITHOUT_COLLAR: "بدون ياقة",
  };

  const vestButtonsMap = {
    SINGLE: "صف واحد",
    DOUBLE: "صفين",
  };

  const fabricCategoryMap = {
    PLAIN: "سادة",
    CHECKED: "كاروهات",
    STRIPED: "مألم",
    TEXTURED: "مشبح",
    LINEN: "كتان",
    ENGLISH_WOOL: "صوف إنجليزي",
  };

  const fabricOriginMap = {
    TURKISH: "تركي",
    ITALIAN: "إيطالي",
    SPANISH: "إسباني",
    BRITISH: "بريطاني",
  };

  const beltColorMap = {
    BLACK: "أسود",
    BROWN: "بني",
    CAMEL: "جملي",
  };

  const materialMap = {
    GENUINE: "طبيعي",
    SYNTHETIC: "صناعي",
    SATIN: "ستان",
    SUEDE: "شمواه",
  };

  const shoesStyleMap = {
    NORMAL: "عادي",
    HALF: "هاف",
    BOOTS: "بوت",
  };

  const getCustomer = async () => {
    try {
      const res = await api.get(`/customers/${router.query.id}`);

      setCustomer(res.data);
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (status) => {
    try {
      await api.put(`/customers/${customer.id}`, {
        orderStatus: status,
      });

      getCustomer();

      message.success("تم تحديث الحالة");
    } catch {
      message.error("حدث خطأ");
    }
  };
  useEffect(() => {
    if (router.query.id) {
      getCustomer();
    }
  }, [router.query.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Spin />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[
          {
            title: "العملاء",
            href: "/customers",
          },
          {
            title: customer?.name,
          },
        ]}
        buttonText={customer?.measurement ? "تعديل المقاسات" : "إضافة المقاسات"}
        onButtonClick={() =>
          router.push(`/customers/${customer.id}/measurements`)
        }
      />

      <Row gutter={16}>
        {/* <Col xs={24} lg={12} style={{ marginTop: "10px" }}>
          <Card title="بيانات العميل">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="الاسم">
                {customer?.name}
              </Descriptions.Item>

              <Descriptions.Item label="رقم الهاتف">
                {customer?.phone}
              </Descriptions.Item>

              <Descriptions.Item label="تاريخ الحجز">
                {dayjs(customer?.bookingDate).format("YYYY-MM-DD")}
              </Descriptions.Item>

              <Descriptions.Item label="موعد الاستلام">
                {dayjs(customer?.deliveryDate).format("YYYY-MM-DD")}
              </Descriptions.Item>

              <Descriptions.Item label="الحالة">
                {customer?.isDelivered ? (
                  <Tag color="green">تم التسليم</Tag>
                ) : (
                  <Tag color="orange">لم يتم التسليم</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12} style={{ marginTop: "10px" }}>
          <Card title="البيانات المالية">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="المبلغ الكلي">
                {customer?.totalAmount || 0}
              </Descriptions.Item>

              <Descriptions.Item label="المدفوع">
                {customer?.paidAmount || 0}
              </Descriptions.Item>

              <Descriptions.Item label="المتبقي">
                {customer?.remainingAmount || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col> */}
        <Col span={24} style={{ marginTop: "10px" }}>
          <Card title="حالة الطلب" style={{ marginBottom: 16 }}>
            <Steps
              current={statusIndex[customer?.orderStatus] || 0}
              responsive
              items={[
                {
                  title: "جديد",
                },
                {
                  title: "المقاسات",
                },
                {
                  title: "التفصيل",
                },
                {
                  title: "التجربة",
                },
                {
                  title: "جاهز",
                },
                {
                  title: "تم التسليم",
                },
              ]}
            />
            <Select
              style={{
                width: 250,
                marginTop: 20,
              }}
              value={customer?.orderStatus}
              onChange={updateOrderStatus}
              options={[
                {
                  value: "NEW",
                  label: "جديد",
                },
                {
                  value: "MEASURED",
                  label: "تم أخذ المقاسات",
                },
                {
                  value: "IN_PROGRESS",
                  label: "تحت التنفيذ",
                },
                {
                  value: "FITTING_READY",
                  label: "جاهز للتجربة",
                },
                {
                  value: "READY",
                  label: "جاهز للتسليم",
                },
                {
                  value: "DELIVERED",
                  label: "تم التسليم",
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={24} style={{ marginTop: "10px" }}>
          <Card title="ملاحظات">{customer?.notes || "لا توجد ملاحظات"}</Card>
        </Col>
        <Col span={24} style={{ marginTop: "10px" }}>
          <Card title="مقاسات الجاكيت" style={{ marginTop: 16 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="مقاس الجاكيت">
                {customer.measurement?.jacketSize || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="طول الجاكيت">
                {customer.measurement?.jacketLength || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="طول الكم">
                {customer.measurement?.sleeveLength || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="الاسبلي">
                {customer.measurement?.armhole || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="الصدر">
                {customer.measurement?.chest || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="البطن">
                {customer.measurement?.stomach || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="مقاسات البنطلون" style={{ marginTop: 16 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="الكمر">
                {customer.measurement?.waist || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="طول البنطلون">
                {customer.measurement?.pantsLength || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="الفخذ">
                {customer.measurement?.thigh || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="السمانة">
                {customer.measurement?.calf || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="الرجل">
                {customer.measurement?.legOpening || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="نصف الهانش">
                {customer.measurement?.halfHip || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="المحيط">
                {customer.measurement?.circumference || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="الياقة" style={{ marginTop: 16 }}>
            {customer.measurement?.collarStyle ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <img
                  src={
                    customer.measurement?.collarStyle === "NOTCH"
                      ? "/images/notch-lapel.jfif"
                      : customer.measurement?.collarStyle === "PEAK"
                        ? "/images/peak-lapel.jfif"
                        : "/images/shawllapel.jpg"
                  }
                  alt="Collar"
                  style={{
                    width: 120,
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />

                <div>
                  <span
                    style={{
                      margin: 0,
                    }}
                  >
                    {collarMap[customer.measurement?.collarStyle]}
                  </span>
                </div>
              </div>
            ) : (
              "لم يتم اختيار ياقة"
            )}
          </Card>
          {customer.measurement?.vestEnabled && (
            <Card title="السديري" style={{ marginTop: 16 }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="النوع">
                  {vestCollarMap[customer.measurement?.vestCollar] || "-"}
                </Descriptions.Item>

                <Descriptions.Item label="الزراير">
                  {vestButtonsMap[customer.measurement?.vestButtons] || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {customer.measurement?.shirtEnabled && (
              <Col xs={24} md={12}>
                <Card title="القميص">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="اللون">
                      {customer.measurement?.shirtColor || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="النوع">
                      {customer.measurement?.shirtFit === "SLIM"
                        ? "سليم"
                        : "ريجولار"}
                    </Descriptions.Item>

                    <Descriptions.Item label="الإكسسوار">
                      {customer.measurement?.shirtAccessory === "TIE"
                        ? "كرافتة"
                        : "بابيون"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.bowtieEnabled && (
              <Col xs={24} md={12}>
                <Card title="البابيون">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="الخامة">
                      {materialMap[customer.measurement?.bowtieMaterial] || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="الحجم">
                      {customer.measurement?.bowtieSize === "SMALL"
                        ? "صغير"
                        : "كبير"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.tieEnabled && (
              <Col xs={24} md={12}>
                <Card title="الكرافتة">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="منديل">
                      {customer.measurement?.tiePocketSquare
                        ? "يوجد"
                        : "لا يوجد"}
                    </Descriptions.Item>

                    <Descriptions.Item label="ملاحظات">
                      {customer.measurement?.tieNotes || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.socksEnabled && (
              <Col xs={24} md={12}>
                <Card title="الشراب">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="اللون">
                      {customer.measurement?.socksColor || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.wideBeltEnabled && (
              <Col xs={24} md={12}>
                <Card title="الحزام العريض">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="الخامة">
                      {materialMap[customer.measurement?.wideBeltMaterial] ||
                        "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="اللون">
                      {customer.measurement?.wideBeltColor || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.beltEnabled && (
              <Col xs={24} md={12}>
                <Card title="الحزام العادي">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="اللون">
                      {beltColorMap[customer.measurement?.beltColor] || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="الخامة">
                      {materialMap[customer.measurement?.beltMaterial] || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.shoesStyle && (
              <Col xs={24} md={12}>
                <Card title="الشوز">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="النوع">
                      {shoesStyleMap[customer.measurement?.shoesStyle] || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="الخامة">
                      {materialMap[customer.measurement?.shoesMaterial] || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            )}
            {customer.measurement?.bouquetEnabled && (
              <Col xs={24} md={12}>
                <Card title="بوكيه الورد">
                  <div>تمت إضافته</div>
                </Card>
              </Col>
            )}
          </Row>
          <Card title="نوع القماش" style={{ marginTop: 16 }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="الفئة">
                {fabricCategoryMap[customer.measurement?.fabricCategory] || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="المنشأ">
                {fabricOriginMap[customer.measurement?.fabricOrigin] || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
