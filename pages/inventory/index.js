import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  notification,
} from "antd";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";
import api from "@/services/api";
import withAuth from "@/hoc/withAuth";

export default function InventoryPage() {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustType, setAdjustType] = useState("ADD");
  const [selectedItem, setSelectedItem] = useState(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  const isMobile = windowWidth < 576;
  const isMedium = windowWidth < 992;

  const [form] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const selectedType = Form.useWatch("itemType", form);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setData(res.data || []);
    } catch (error) {
      console.log(error);
      notification.error({ message: "تعذر تحميل المخزون" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  // ========= Maps =========
  const itemTypeMap = {
    SHIRT: "قميص",
    BOWTIE: "بابيون",
    TIE: "كرافتة",
    BELT: "حزام",
    WIDE_BELT: "حزام عريض",
    SOCKS: "شراب",
    SHOES: "شوز",
    TSHIRT: "تيشيرت",
    PULLOVER: "بلوفر",
  };
  const colorMap = {
    WHITE: "أبيض",
    OFF_WHITE: "أوف وايت",
    BLACK: "أسود",
    BROWN: "بني",
    CAMEL: "جملي",
  };
  const materialMap = {
    SATIN: "ستان",
    SUEDE: "شمواه",
    GENUINE: "طبيعي",
    SYNTHETIC: "صناعي",
  };
  const styleMap = {
    BOWTIE: "بابيون",
    TIE: "كرافتة",
    SMALL: "صغير",
    LARGE: "كبير",
    NORMAL: "عادي",
    HALF: "هاف",
    BOOTS: "بوت",
  };
  const shirtFitMap = { SLIM: "سليم", REGULAR: "لاجورر" };

  // ========= تصنيف العناصر =========
  const shirts = useMemo(
    () => data.filter((i) => i.itemType === "SHIRT"),
    [data],
  );
  const bowties = useMemo(
    () => data.filter((i) => i.itemType === "BOWTIE"),
    [data],
  );
  const ties = useMemo(() => data.filter((i) => i.itemType === "TIE"), [data]);
  const belts = useMemo(
    () => data.filter((i) => i.itemType === "BELT"),
    [data],
  );
  const wideBelts = useMemo(
    () => data.filter((i) => i.itemType === "WIDE_BELT"),
    [data],
  );
  const socks = useMemo(
    () => data.filter((i) => i.itemType === "SOCKS"),
    [data],
  );
  const shoes = useMemo(
    () => data.filter((i) => i.itemType === "SHOES"),
    [data],
  );
  const tshirts = useMemo(
    () => data.filter((i) => i.itemType === "TSHIRT"),
    [data],
  );
  const pullovers = useMemo(
    () => data.filter((i) => i.itemType === "PULLOVER"),
    [data],
  );

  // ========= حفظ عنصر =========
  const saveItem = async (values) => {
    try {
      setLoading(true);
      await api.post("/inventory", values);
      notification.success({ message: "تم حفظ العنصر بنجاح" });
      form.resetFields();
      setOpen(false);
      getInventory();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "حدث خطأ أثناء الحفظ",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: "تأكيد حفظ العنصر",
      content: "هل أنت متأكد من حفظ هذا العنصر في المخزون؟",
      okText: "تأكيد",
      cancelText: "إلغاء",
      onOk: async () => await saveItem(values),
    });
  };

  // ========= حذف =========
  const deleteItem = async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      notification.success({ message: "تم حذف العنصر" });
      getInventory();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "حدث خطأ أثناء الحذف",
      });
    }
  };

  // ========= فتح مودال الحركة =========
  const openAdjustModal = (item, type) => {
    setSelectedItem(item);
    setAdjustType(type);
    adjustForm.resetFields();
    setAdjustOpen(true);
  };

  // ========= خصم / إضافة كمية =========
  const submitAdjust = async (values) => {
    if (!selectedItem) return;
    const qty = Number(values.quantity || 0);

    if (!qty || qty <= 0) {
      notification.error({ message: "أدخل كمية صحيحة" });
      return;
    }
    if (adjustType === "SUBTRACT" && qty > selectedItem.quantity) {
      notification.error({
        message: "الكمية المطلوبة أكبر من المتاح في المخزون",
      });
      return;
    }

    Modal.confirm({
      title: adjustType === "ADD" ? "تأكيد إضافة كمية" : "تأكيد خصم كمية",
      content:
        adjustType === "ADD"
          ? `سيتم إضافة ${qty} إلى هذا العنصر`
          : `سيتم خصم ${qty} من هذا العنصر`,
      okText: "تأكيد",
      cancelText: "إلغاء",
      onOk: async () => {
        try {
          setAdjustLoading(true);
          await api.put(`/inventory/${selectedItem.id}`, {
            action: adjustType,
            quantity: qty,
          });
          notification.success({
            message:
              adjustType === "ADD"
                ? "تمت إضافة الكمية بنجاح"
                : "تم خصم الكمية بنجاح",
          });
          setAdjustOpen(false);
          setSelectedItem(null);
          adjustForm.resetFields();
          getInventory();
        } catch (error) {
          notification.error({
            message:
              error?.response?.data?.message || "حدث خطأ أثناء تعديل الكمية",
          });
        } finally {
          setAdjustLoading(false);
        }
      },
    });
  };

  // ========= عمود الإجراءات (دايماً في expandable) =========
  const renderActions = (row) => (
    <Space wrap style={{ marginTop: 8 }}>
      <Button onClick={() => openAdjustModal(row, "ADD")}>إضافة كمية</Button>
      <Button danger onClick={() => openAdjustModal(row, "SUBTRACT")}>
        خصم كمية
      </Button>
      <Popconfirm
        title="حذف العنصر ؟"
        okText="نعم"
        cancelText="لا"
        onConfirm={() => deleteItem(row.id)}
      >
        <Button danger type="primary">
          حذف
        </Button>
      </Popconfirm>
    </Space>
  );

  // ========= helper: بناء expandable بناءً على الحقول اللي اتحجبت =========
  const makeExpandable = (hiddenFields) => ({
    expandedRowRender: (row) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {hiddenFields.map(({ label, value }) =>
          value(row) ? (
            <p key={label} style={{ margin: 0 }}>
              <strong>{label}: </strong>
              {value(row)}
            </p>
          ) : null,
        )}
        {renderActions(row)}
      </div>
    ),
  });

  // ========= أعمدة القمصان =========
  const shirtColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    ...(!isMobile
      ? [{ title: "المقاس", dataIndex: "size", render: (v) => v || "-" }]
      : []),
    ...(!isMedium
      ? [
          {
            title: "نوع القميص",
            render: (_, row) => shirtFitMap[row.shirtFit] || "-",
          },
          { title: "الستايل", render: (_, row) => styleMap[row.style] || "-" },
        ]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const shirtExpand = makeExpandable([
    ...(isMobile ? [{ label: "المقاس", value: (r) => r.size }] : []),
    ...(isMedium
      ? [
          { label: "نوع القميص", value: (r) => shirtFitMap[r.shirtFit] },
          { label: "الستايل", value: (r) => styleMap[r.style] },
        ]
      : []),
  ]);

  // ========= أعمدة البابيون =========
  const bowtieColumns = [
    { title: "الخامة", render: (_, row) => materialMap[row.material] || "-" },
    ...(!isMedium
      ? [{ title: "الحجم", render: (_, row) => styleMap[row.style] || "-" }]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const bowtieExpand = makeExpandable([
    ...(isMedium ? [{ label: "الحجم", value: (r) => styleMap[r.style] }] : []),
  ]);

  // ========= أعمدة الكرافتات (بسيطة) =========
  const tieColumns = [
    { title: "النوع", render: () => "كرافتة" },
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const tieExpand = makeExpandable([]);

  // ========= أعمدة الأحزمة =========
  const beltColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    ...(!isMedium
      ? [
          {
            title: "الخامة",
            render: (_, row) => materialMap[row.material] || "-",
          },
        ]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const beltExpand = makeExpandable([
    ...(isMedium
      ? [{ label: "الخامة", value: (r) => materialMap[r.material] }]
      : []),
  ]);

  // ========= أعمدة الأحزمة العريضة =========
  const wideBeltColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    ...(!isMedium
      ? [
          {
            title: "الخامة",
            render: (_, row) => materialMap[row.material] || "-",
          },
        ]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const wideBeltExpand = makeExpandable([
    ...(isMedium
      ? [{ label: "الخامة", value: (r) => materialMap[r.material] }]
      : []),
  ]);

  // ========= أعمدة الشرابات =========
  const socksColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const socksExpand = makeExpandable([]);

  // ========= أعمدة الشوز =========
  const shoesColumns = [
    { title: "النوع", render: (_, row) => styleMap[row.style] || "-" },
    ...(!isMedium
      ? [
          {
            title: "الخامة",
            render: (_, row) => materialMap[row.material] || "-",
          },
        ]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const shoesExpand = makeExpandable([
    ...(isMedium
      ? [{ label: "الخامة", value: (r) => materialMap[r.material] }]
      : []),
  ]);

  // ========= أعمدة التيشيرتات =========
  const tshirtColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    ...(!isMobile
      ? [{ title: "المقاس", dataIndex: "size", render: (v) => v || "-" }]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const tshirtExpand = makeExpandable([
    ...(isMobile ? [{ label: "المقاس", value: (r) => r.size }] : []),
  ]);

  // ========= أعمدة البلوفرات =========
  const pulloverColumns = [
    { title: "اللون", render: (_, row) => colorMap[row.color] || "-" },
    ...(!isMobile
      ? [{ title: "المقاس", dataIndex: "size", render: (v) => v || "-" }]
      : []),
    { title: "الكمية", dataIndex: "quantity" },
  ];
  const pulloverExpand = makeExpandable([
    ...(isMobile ? [{ label: "المقاس", value: (r) => r.size }] : []),
  ]);

  // ========= مساعد رسم الكارد =========
  const renderTable = (title, dataSource, columns, expandable, emptyText) => (
    <Col span={24}>
      <Card title={`${title} (${dataSource.length})`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText }}
          expandable={expandable}
        />
      </Card>
    </Col>
  );

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[{ title: "المخزون" }]}
        buttonText="إضافة عنصر"
        onButtonClick={() => {
          form.resetFields();
          setOpen(true);
        }}
      />

      {fetching ? <PageLoader /> : <Row gutter={[16, 16]}>
        {renderTable(
          "القمصان",
          shirts,
          shirtColumns,
          shirtExpand,
          "لا توجد قمصان",
        )}
        {renderTable(
          "البابيون",
          bowties,
          bowtieColumns,
          bowtieExpand,
          "لا توجد بابيونات",
        )}
        {renderTable(
          "الكرافتات",
          ties,
          tieColumns,
          tieExpand,
          "لا توجد كرافتات",
        )}
        {renderTable(
          "الأحزمة",
          belts,
          beltColumns,
          beltExpand,
          "لا توجد أحزمة",
        )}
        {renderTable(
          "الأحزمة العريضة",
          wideBelts,
          wideBeltColumns,
          wideBeltExpand,
          "لا توجد أحزمة عريضة",
        )}
        {renderTable(
          "الشرابات",
          socks,
          socksColumns,
          socksExpand,
          "لا توجد شرابات",
        )}
        {renderTable("الشوز", shoes, shoesColumns, shoesExpand, "لا يوجد شوز")}
        {renderTable(
          "التيشيرتات",
          tshirts,
          tshirtColumns,
          tshirtExpand,
          "لا توجد تيشيرتات",
        )}
        {renderTable(
          "البلوفرات",
          pullovers,
          pulloverColumns,
          pulloverExpand,
          "لا توجد بلوفرات",
        )}
      </Row>}

      {/* مودال إضافة عنصر */}
      <Modal
        title="إضافة عنصر للمخزون"
        open={open}
        footer={false}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="itemType"
            label="النوع"
            rules={[{ required: true, message: "اختر النوع" }]}
          >
            <Select
              options={[
                { value: "SHIRT", label: "قميص" },
                { value: "BOWTIE", label: "بابيون" },
                { value: "TIE", label: "كرافتة" },
                { value: "BELT", label: "حزام" },
                { value: "WIDE_BELT", label: "حزام عريض" },
                { value: "SOCKS", label: "شراب" },
                { value: "SHOES", label: "شوز" },
                { value: "TSHIRT", label: "تيشيرت" },
                { value: "PULLOVER", label: "بلوفر" },
              ]}
            />
          </Form.Item>

          {selectedType === "SHIRT" && (
            <>
              <Form.Item name="color" label="اللون">
                <Select
                  options={[
                    { value: "WHITE", label: "أبيض" },
                    { value: "OFF_WHITE", label: "أوف وايت" },
                    { value: "BLACK", label: "أسود" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="size" label="المقاس">
                <Select
                  options={[
                    { value: "36", label: "36" },
                    { value: "38", label: "38" },
                    { value: "40", label: "40" },
                    { value: "42", label: "42" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="shirtFit" label="نوع القميص">
                <Select
                  options={[
                    { value: "SLIM", label: "سليم" },
                    { value: "REGULAR", label: "لاجورر" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="style" label="الستايل">
                <Select
                  options={[
                    { value: "BOWTIE", label: "بابيون" },
                    { value: "TIE", label: "كرافتة" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "BOWTIE" && (
            <>
              <Form.Item name="material" label="الخامة">
                <Select
                  options={[
                    { value: "SATIN", label: "ستان" },
                    { value: "SUEDE", label: "شمواه" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="style" label="الحجم">
                <Select
                  options={[
                    { value: "SMALL", label: "صغير" },
                    { value: "LARGE", label: "كبير" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "BELT" && (
            <>
              <Form.Item name="color" label="اللون">
                <Select
                  options={[
                    { value: "BLACK", label: "أسود" },
                    { value: "BROWN", label: "بني" },
                    { value: "CAMEL", label: "جملي" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="material" label="الخامة">
                <Select
                  options={[
                    { value: "GENUINE", label: "طبيعي" },
                    { value: "SYNTHETIC", label: "صناعي" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "WIDE_BELT" && (
            <>
              <Form.Item name="material" label="الخامة">
                <Select
                  options={[
                    { value: "SATIN", label: "ستان" },
                    { value: "SUEDE", label: "شمواه" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="color" label="اللون">
                <Select
                  options={[
                    { value: "BLACK", label: "أسود" },
                    { value: "WHITE", label: "أبيض" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "SOCKS" && (
            <Form.Item name="color" label="اللون">
              <Select
                options={[
                  { value: "BLACK", label: "أسود" },
                  { value: "BROWN", label: "بني" },
                  { value: "CAMEL", label: "جملي" },
                  { value: "WHITE", label: "أبيض" },
                  { value: "OFF_WHITE", label: "أوف وايت" },
                ]}
              />
            </Form.Item>
          )}

          {selectedType === "SHOES" && (
            <>
              <Form.Item name="style" label="النوع">
                <Select
                  options={[
                    { value: "NORMAL", label: "عادي" },
                    { value: "HALF", label: "هاف" },
                    { value: "BOOTS", label: "بوت" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="material" label="الخامة">
                <Select
                  options={[
                    { value: "GENUINE", label: "جلد طبيعي" },
                    { value: "SYNTHETIC", label: "جلد صناعي" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "TSHIRT" && (
            <>
              <Form.Item name="color" label="اللون">
                <Select
                  options={[
                    { value: "WHITE", label: "أبيض" },
                    { value: "OFF_WHITE", label: "أوف وايت" },
                    { value: "BLACK", label: "أسود" },
                    { value: "BROWN", label: "بني" },
                    { value: "CAMEL", label: "جملي" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="size" label="المقاس">
                <Select
                  options={[
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "XXL", label: "XXL" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {selectedType === "PULLOVER" && (
            <>
              <Form.Item name="color" label="اللون">
                <Select
                  options={[
                    { value: "WHITE", label: "أبيض" },
                    { value: "OFF_WHITE", label: "أوف وايت" },
                    { value: "BLACK", label: "أسود" },
                    { value: "BROWN", label: "بني" },
                    { value: "CAMEL", label: "جملي" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="size" label="المقاس">
                <Select
                  options={[
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "XXL", label: "XXL" },
                  ]}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="quantity"
            label="الكمية"
            rules={[{ required: true, message: "أدخل الكمية" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              حفظ
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setOpen(false);
              }}
            >
              إلغاء
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* مودال خصم/إضافة كمية */}
      <Modal
        title={adjustType === "ADD" ? "إضافة كمية" : "خصم كمية"}
        open={adjustOpen}
        footer={false}
        onCancel={() => {
          setAdjustOpen(false);
          setSelectedItem(null);
          adjustForm.resetFields();
        }}
      >
        <Form form={adjustForm} layout="vertical" onFinish={submitAdjust}>
          <Form.Item
            name="quantity"
            label="الكمية"
            rules={[{ required: true, message: "أدخل الكمية" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={adjustLoading}>
              تأكيد
            </Button>
            <Button
              onClick={() => {
                setAdjustOpen(false);
                setSelectedItem(null);
                adjustForm.resetFields();
              }}
            >
              إلغاء
            </Button>
          </Space>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
