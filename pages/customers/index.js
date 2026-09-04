import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  notification,
  Dropdown,
  Menu,
  Popover,
  Select,
  Tag,
} from "antd";

import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";
import api from "@/services/api";
import withAuth from "@/hoc/withAuth";
import locale from "antd/lib/date-picker/locale/ar_EG";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
const { TextArea } = Input;

export default function CustomersPage() {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [form] = Form.useForm();
  const totalAmount = Form.useWatch("totalAmount", form);
  const paidAmount = Form.useWatch("paidAmount", form);

  const isMobile = windowWidth < 576;
  const isMedium = windowWidth < 992;

  const getCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      notification.success({
        message: "تم حذف العميل",
      });
      getCustomers();
    } catch {
      notification.error({
        message: "حدث خطأ",
      });
    }
  };

  const updateDeliveryStatus = async (row) => {
    try {
      await api.put(`/customers/${row.id}`, {
        isDelivered: !row.isDelivered,
      });
      getCustomers();
      notification.success({
        message: "تم تحديث الحالة",
      });
    } catch {
      notification.error({
        message: "حدث خطأ",
      });
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await api.post("/customers", {
        ...values,
        remainingAmount: (values.totalAmount || 0) - (values.paidAmount || 0),
        deliveryDate: values.deliveryDate?.toISOString(),
      });
      notification.success({
        message: "تم إضافة العميل",
      });
      form.resetFields();
      setOpen(false);
      getCustomers();
    } catch (error) {
      notification.error({
        message: "حدث خطأ",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    NEW: "جديد",
    MEASURED: "تم أخذ المقاسات",
    IN_PROGRESS: "تحت التنفيذ",
    FITTING_READY: "جاهز للتجربة",
    READY: "جاهز للتسليم",
    DELIVERED: "تم التسليم",
  };

  const columns = [
    {
      title: "اسم العميل",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
      onCell: () => ({
        style: {
          minWidth: 200,
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    },

    // رقم الهاتف → يظهر في md و lg فقط (مش في sm)
    ...(!isMobile
      ? [
          {
            title: "رقم الهاتف",
            render: (_, row) => {
              const content = (
                <Space direction="vertical">
                  <a href={`tel:${row.phone}`}>📞 اتصال</a>
                  <a
                    href={`https://wa.me/2${row.phone}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 واتساب
                  </a>
                </Space>
              );
              return (
                <Popover content={content} trigger="click">
                  <Button type="link">{row.phone}</Button>
                </Popover>
              );
            },
          },
        ]
      : []),

    // موعد الاستلام → يظهر في lg فقط (≥992)
    ...(!isMedium
      ? [
          {
            title: "موعد الاستلام",
            render: (_, row) => dayjs(row.deliveryDate).format("YYYY-MM-DD"),
          },
        ]
      : []),

    // حالة الطلب → يظهر دايماً
    {
      title: "حالة الطلب",
      render: (_, row) => {
        const colors = {
          NEW: "default",
          MEASURED: "gold",
          IN_PROGRESS: "orange",
          FITTING_READY: "gold",
          READY: "green",
          DELIVERED: "success",
        };
        return (
          <Tag color={colors[row.orderStatus]}>
            {statusMap[row.orderStatus]}
          </Tag>
        );
      },
    },

    // ❌ عمود الإجراءات اتشال من هنا — دايماً في expandable
  ];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search);
    const matchesStatus = !statusFilter || item.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[
          {
            title: "العملاء",
          },
        ]}
        buttonText="إضافة عميل"
        onButtonClick={() => setOpen(true)}
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8} style={{ marginBottom: 10 }} className="searchName">
          <Input
            placeholder="بحث باسم العميل"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col xs={24} md={6} style={{ marginBottom: 10 }}>
          <Select
            style={{ width: "100%" }}
            placeholder="حالة الطلب"
            allowClear
            onChange={setStatusFilter}
            options={[
              { value: "NEW", label: "جديد" },
              { value: "MEASURED", label: "تم أخذ المقاسات" },
              { value: "IN_PROGRESS", label: "تحت التنفيذ" },
              { value: "FITTING_READY", label: "جاهز للتجربة" },
              { value: "READY", label: "جاهز للتسليم" },
              { value: "DELIVERED", label: "تم التسليم" },
            ]}
          />
        </Col>
      </Row>

      {fetching ? (
        <PageLoader />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (row) => (
              <div>
                {/* رقم الهاتف → في expandable لما يكون sm */}
                {isMobile && (
                  <p>
                    <strong>رقم الهاتف : </strong>

                    <Popover
                      trigger="click"
                      content={
                        <Space direction="vertical">
                          <a href={`tel:${row.phone}`}>📞 اتصال</a>

                          <a
                            href={`https://wa.me/2${row.phone}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            💬 واتساب
                          </a>
                        </Space>
                      }
                    >
                      <Button
                        type="link"
                        style={{
                          padding: 0,
                          height: "auto",
                          fontWeight: 600,
                        }}
                      >
                        {row.phone}
                      </Button>
                    </Popover>
                  </p>
                )}
                <p>
                  <strong>تاريخ الحجز : </strong>
                  {dayjs(row.bookingDate).format("YYYY-MM-DD")}
                </p>

                {/* موعد الاستلام → في expandable لما يكون md أو sm */}
                {isMedium && (
                  <p>
                    <strong>موعد الاستلام : </strong>
                    {dayjs(row.deliveryDate).format("YYYY-MM-DD")}
                  </p>
                )}

                <p>
                  <strong>المبلغ الكلي : </strong> {row.totalAmount || 0}
                </p>

                <p>
                  <strong>المدفوع : </strong> {row.paidAmount || 0}
                </p>

                <p>
                  <strong>المتبقي : </strong> {row.remainingAmount || 0}
                </p>

                {row.notes && (
                  <p>
                    <strong>ملاحظات : </strong> {row.notes}
                  </p>
                )}

                {/* الإجراءات دايماً في expandable في كل الشاشات */}
                <Space style={{ marginTop: 10 }}>
                  <Link href={`/customers/${row.id}`}>
                    <Button type="primary">عرض التفاصيل</Button>
                  </Link>

                  <Popconfirm
                    title="حذف العميل ؟"
                    okText="نعم"
                    cancelText="لا"
                    onConfirm={() => deleteCustomer(row.id)}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      حذف
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            ),
          }}
        />
      )}

      <Modal
        title="إضافة عميل"
        open={open}
        footer={false}
        width={800}
        onCancel={() => setOpen(false)}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="اسم العميل"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="رقم الهاتف"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="deliveryDate"
                label="موعد الاستلام"
                rules={[{ required: true }]}
              >
                <DatePicker
                  locale={locale}
                  placeholder="اختر موعد الاستلام"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="totalAmount" label="المبلغ الكلي">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="paidAmount" label="المبلغ المدفوع">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="المبلغ المتبقي">
                <InputNumber
                  disabled
                  value={(totalAmount || 0) - (paidAmount || 0)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="ملاحظات">
            <TextArea rows={4} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              حفظ
            </Button>
            <Button onClick={() => setOpen(false)}>إلغاء</Button>
          </Space>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
