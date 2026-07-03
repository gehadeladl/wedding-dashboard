import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Spin,
  Switch,
  Upload,
} from "antd";
import withAuth from "@/hoc/withAuth";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import api from "@/services/api";
import PageHeader from "@/components/PageHeader";

const { TextArea } = Input;

const websiteSectionOptions = [
  { label: "بدل", value: "SUITS" },
  { label: "قمصان", value: "SHIRTS" },
  { label: "أحزمة", value: "BELTS" },
  { label: "بابيون وكرافتات", value: "TIES_BOWTIES" },
  { label: "شوز", value: "SHOES" },
  { label: "تيشيرتات وبلوفرات", value: "TSHIRTS_PULLOVERS" },
];

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getProduct = async () => {
    if (!id) return;

    try {
      setFetching(true);
      const res = await api.get(`/products/${id}`);
      const product = res.data;

      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        showOnHome: product.showOnHome,
        showPrice: product.showPrice ?? true,
        websiteSection: product.websiteSection,
        displayOrder: product.displayOrder ?? 0,
      });

      setCurrentImage(product.images?.[0]?.imageUrl || null);
    } catch (error) {
      notification.error({ message: "حدث خطأ أثناء تحميل بيانات المنتج" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      let uploadedImage = null;

      if (fileList.length) {
        const file = fileList[0];
        const base64 = await getBase64(file.originFileObj);

        const uploadRes = await api.post("/upload", { image: base64 });
        uploadedImage = uploadRes.data;
      }

      await api.put(`/products/${id}`, {
        ...values,
        price:
          values.price === undefined ||
          values.price === null ||
          values.price === ""
            ? null
            : Number(values.price),
        displayOrder: values.displayOrder || 0,
        image: uploadedImage,
      });

      notification.success({ message: "تم تحديث المنتج" });
      router.push("/products");
    } catch (error) {
      console.log(error);
      notification.error({ message: "حدث خطأ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[
          { title: "المنتجات", href: "/products" },
          { title: "تعديل منتج" },
        ]}
      />

      <Card>
        <Spin spinning={fetching}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              {/* 1. الصورة الحالية / تغيير الصورة */}
              <Col xs={24}>
                <Form.Item label="الصورة الحالية / تغيير الصورة">
                  {currentImage && !fileList.length ? (
                    <div style={{ marginBottom: 12 }}>
                      <img
                        src={currentImage}
                        alt="product"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 12,
                          border: "1px solid #eee",
                        }}
                      />
                    </div>
                  ) : null}

                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {fileList.length < 1 && "+ تغيير الصورة"}
                  </Upload>
                </Form.Item>
              </Col>

              {/* 2. اسم المنتج + سكشن الموقع */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="اسم المنتج"
                  name="name"
                  rules={[{ required: true, message: "أدخل اسم المنتج" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="سكشن الموقع"
                  name="websiteSection"
                  rules={[{ required: true, message: "اختر سكشن الموقع" }]}
                >
                  <Select
                    placeholder="اختر سكشن الموقع"
                    options={websiteSectionOptions}
                  />
                </Form.Item>
              </Col>

              {/* 3. السعر + إظهار السعر */}
              <Col xs={24} md={12}>
                <Form.Item label="السعر" name="price">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="اختياري"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="إظهار السعر"
                  name="showPrice"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>

              {/* 4. إعدادات العرض */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="يظهر في الصفحة الرئيسية"
                  name="showOnHome"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="ترتيب الظهور" name="displayOrder">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* 5. الوصف في الآخر */}
              <Col xs={24}>
                <Form.Item label="الوصف" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" loading={loading}>
              حفظ التعديلات
            </Button>
          </Form>
        </Spin>
      </Card>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
