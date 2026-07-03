import {
  Card,
  Form,
  Row,
  Col,
  InputNumber,
  Input,
  Button,
  notification,
  Radio,
  Checkbox,
  Select,
} from "antd";

import { useRouter } from "next/router";
import api from "@/services/api";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState } from "react";
import withAuth from "@/hoc/withAuth";
const { TextArea } = Input;

export default function MeasurementsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  const getMeasurement = async () => {
    try {
      const res = await api.get(`/customers/${router.query.id}`);

      setCustomer(res.data);

      if (res.data?.measurement) {
        form.setFieldsValue(res.data.measurement);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      getMeasurement();
    }
  }, [router.query.id]);

  const onFinish = async (values) => {
    console.log(values);
    // try {
    //   setLoading(true);

    //   await api.post(`/customers/${router.query.id}/measurement`, values);

    //   notification.success({
    //     message: "تم حفظ المقاسات",
    //   });
    // } catch (error) {
    //   notification.error({
    //     message: "حدث خطأ",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[
          {
            title: "العملاء",
            href: "/customers",
          },
          {
            title: `${customer?.name}`,
            href: `/customers/${router?.query.id}`,
          },
          {
            title: "المقاسات",
          },
        ]}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="مقاسات الجاكيت" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="jacketSize" label="مقاس الجاكيت">
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="jacketLength" label="طول الجاكيت">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="sleeveLength" label="طول الكم">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="armhole" label="الاسبلي">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="chest" label="الصدر">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="stomach" label="البطن">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="jacketNotes" label="ملاحظات الجاكيت">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="مقاسات البنطلون" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="waist" label="مقاس الكمر">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="pantsLength" label="طول البنطلون">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="thigh" label="الفخذ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="zipper" label="السوستة">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="calf" label="السمانة">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="legOpening" label="الرجل">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="halfHip" label="نصف الهانش">
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="circumference" label="المحيط">
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          title="نوع الياقة"
          style={{
            marginBottom: 16,
          }}
        >
          <Form.Item
            name="collarStyle"
            rules={[
              {
                required: true,
                message: "اختر نوع الياقة",
              },
            ]}
          >
            <Radio.Group
              style={{
                width: "100%",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Radio value="NOTCH">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <img
                        src="/images/notch-lapel.jfif"
                        alt="Notch Lapel"
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                      <span>Notch Lapel</span>
                    </div>
                  </Radio>
                </Col>

                <Col xs={24} md={8}>
                  <Radio value="PEAK">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <img
                        src="/images/peak-lapel.jfif"
                        alt="Peak Lapel"
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                      <span>Peak Lapel</span>
                    </div>
                  </Radio>
                </Col>

                <Col xs={24} md={8}>
                  <Radio value="SHAWL">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <img
                        src="/images/shawllapel.jpg"
                        alt="Shawl Lapel"
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                      <span>Shawl Lapel</span>
                    </div>
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
        </Card>
        <Card
          title="السديري"
          style={{
            marginBottom: 16,
          }}
        >
          <Form.Item name="vestEnabled" valuePropName="checked">
            <Checkbox>إضافة سديري</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("vestEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="vestCollar" label="نوع السديري">
                      <Select
                        options={[
                          {
                            label: "بياقة",
                            value: "WITH_COLLAR",
                          },
                          {
                            label: "بدون ياقة",
                            value: "WITHOUT_COLLAR",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="vestButtons" label="الزراير">
                      <Select
                        options={[
                          {
                            label: "صف واحد",
                            value: "SINGLE",
                          },
                          {
                            label: "صفين",
                            value: "DOUBLE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
        </Card>
        <Card
          title="الإكسسوارات"
          style={{
            marginBottom: 16,
          }}
        >
          <Form.Item name="shirtEnabled" valuePropName="checked">
            <Checkbox>قميص</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("shirtEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item name="shirtColor" label="لون القميص">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item name="shirtFit" label="نوع القميص">
                      <Select
                        options={[
                          {
                            label: "سليم",
                            value: "SLIM",
                          },
                          {
                            label: "ريجولار",
                            value: "REGULAR",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item name="shirtAccessory" label="الإكسسوار">
                      <Select
                        options={[
                          {
                            label: "كرافتة",
                            value: "TIE",
                          },
                          {
                            label: "بابيون",
                            value: "BOWTIE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
          <Form.Item name="bowtieEnabled" valuePropName="checked">
            <Checkbox>بابيون</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("bowtieEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="bowtieMaterial" label="الخامة">
                      <Select
                        options={[
                          {
                            label: "ستان",
                            value: "SATIN",
                          },
                          {
                            label: "شمواه",
                            value: "SUEDE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="bowtieSize" label="الحجم">
                      <Select
                        options={[
                          {
                            label: "صغير",
                            value: "SMALL",
                          },
                          {
                            label: "كبير",
                            value: "LARGE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
          <Form.Item name="bouquetEnabled" valuePropName="checked">
            <Checkbox>بوكيه ورد</Checkbox>
          </Form.Item>
          <Form.Item name="socksEnabled" valuePropName="checked">
            <Checkbox>شراب</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("socksEnabled") ? (
                <Form.Item name="socksColor" label="لون الشراب">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item name="tieEnabled" valuePropName="checked">
            <Checkbox>كرافتة</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("tieEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="tiePocketSquare" valuePropName="checked">
                      <Checkbox>بمنديل</Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="tieNotes" label="ملاحظات الكرافتة">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
          <Form.Item name="wideBeltEnabled" valuePropName="checked">
            <Checkbox>حزام عريض</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("wideBeltEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="wideBeltMaterial" label="الخامة">
                      <Select
                        options={[
                          {
                            label: "ستان",
                            value: "SATIN",
                          },
                          {
                            label: "شمواه",
                            value: "SUEDE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="wideBeltColor" label="اللون">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
          <Form.Item name="beltEnabled" valuePropName="checked">
            <Checkbox>حزام عادي</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("beltEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="beltColor" label="اللون">
                      <Select
                        options={[
                          {
                            label: "أسود",
                            value: "BLACK",
                          },
                          {
                            label: "بني",
                            value: "BROWN",
                          },
                          {
                            label: "جملي",
                            value: "CAMEL",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="beltMaterial" label="الخامة">
                      <Select
                        options={[
                          {
                            label: "طبيعي",
                            value: "GENUINE",
                          },
                          {
                            label: "صناعي",
                            value: "SYNTHETIC",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
          <Form.Item name="shoesEnabled" valuePropName="checked">
            <Checkbox>شوز</Checkbox>
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("shoesEnabled") ? (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="shoesStyle" label="نوع الشوز">
                      <Select
                        options={[
                          {
                            label: "عادي",
                            value: "NORMAL",
                          },
                          {
                            label: "هاف",
                            value: "HALF",
                          },
                          {
                            label: "بوت",
                            value: "BOOTS",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="shoesMaterial" label="الخامة">
                      <Select
                        options={[
                          {
                            label: "جلد طبيعي",
                            value: "GENUINE",
                          },
                          {
                            label: "جلد صناعي",
                            value: "SYNTHETIC",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }
          </Form.Item>
        </Card>
        <Card
          title="نوع القماش"
          style={{
            marginBottom: 16,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="fabricCategory" label="نوع القماش">
                <Select
                  options={[
                    { label: "سادة", value: "PLAIN" },
                    { label: "كاروهات", value: "CHECKED" },
                    { label: "مألم", value: "STRIPED" },
                    { label: "مشبح", value: "TEXTURED" },
                    { label: "كتان", value: "LINEN" },
                    { label: "صوف إنجليزي", value: "ENGLISH_WOOL" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="fabricOrigin" label="المنشأ">
                <Select
                  options={[
                    { label: "تركي", value: "TURKISH" },
                    { label: "إيطالي", value: "ITALIAN" },
                    { label: "إسباني", value: "SPANISH" },
                    { label: "بريطاني", value: "BRITISH" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Button type="primary" htmlType="submit" loading={loading}>
          حفظ المقاسات
        </Button>
      </Form>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
