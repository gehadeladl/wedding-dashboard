import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Upload,
  notification,
} from "antd";
import { useState } from "react";

import api from "@/services/api";
import withAuth from "@/hoc/withAuth";
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

export default function CreateProduct() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = async (values) => {
    try {
      setLoading(true);

      let uploadedImages = [];

      if (fileList.length) {
        const file = fileList[0];
        const base64 = await getBase64(file.originFileObj);

        const uploadRes = await api.post("/upload", {
          image: base64,
        });

        uploadedImages = [uploadRes.data];
      }

      await api.post("/products", {
        ...values,
        price:
          values.price === undefined ||
          values.price === null ||
          values.price === ""
            ? null
            : Number(values.price),
        displayOrder: values.displayOrder || 0,
        showOnHome: values.showOnHome ?? true,
        showPrice: values.showPrice ?? true,
        images: uploadedImages,
      });

      notification.success({
        message: "تم حفظ المنتج بنجاح",
      });

      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "حدث خطأ أثناء الحفظ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[
          { title: "المنتجات", href: "/products" },
          { title: "إضافة منتج" },
        ]}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            showOnHome: true,
            showPrice: true,
            displayOrder: 0,
          }}
        >
          <Row gutter={16}>
            {/* 1. صورة المنتج */}
            <Col xs={24}>
              <Form.Item
                label="صورة المنتج"
                extra="يسمح بصورة واحدة فقط لكل منتج"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length < 1 && "+ رفع صورة"}
                </Upload>
              </Form.Item>
            </Col>

            {/* 2. اسم المنتج */}
            <Col xs={24} md={12}>
              <Form.Item
                label="اسم المنتج"
                name="name"
                rules={[{ required: true, message: "أدخل اسم المنتج" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* 3. سكشن الموقع */}
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

            {/* 4. السعر + إظهار السعر (مرتبطين ببعض) */}
            <Col xs={24} md={12}>
              <Form.Item label="السعر" name="price">
                <InputNumber style={{ width: "100%" }} placeholder="اختياري" />
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

            {/* 5. إعدادات العرض */}
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

            {/* 6. الوصف في الآخر */}
            <Col xs={24}>
              <Form.Item label="الوصف" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" loading={loading}>
            حفظ المنتج
          </Button>
        </Form>
      </Card>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
