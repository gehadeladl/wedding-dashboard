import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Row,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
  Upload,
  notification,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import Cropper from "react-easy-crop";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";
import withAuth from "@/hoc/withAuth";
import api from "@/services/api";

const { Text } = Typography;

// ========= helper: اعمل crop للصورة وارجعها base64 =========
const getCroppedImage = (imageSrc, croppedAreaPixels) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    image.onerror = reject;
  });

export default function WebsiteSlidersPage() {
  const [sliders, setSliders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const getSliders = async () => {
    try {
      const res = await api.get("/website/sliders");
      setSliders(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getSliders();
  }, []);

  // ========= لما المستخدم يختار صورة — افتح الـ cropper =========
  const onFileSelected = (file) => {
    if (sliders.length >= 6) {
      notification.warning({ message: "لا يمكن إضافة أكثر من 6 صور" });
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    return false; // منع antd من الرفع التلقائي
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // ========= بعد ما المستخدم يضغط "رفع" في الـ modal =========
  const handleUploadCropped = async () => {
    if (!croppedAreaPixels || !rawImageSrc) return;

    try {
      setUploading(true);

      const croppedBase64 = await getCroppedImage(
        rawImageSrc,
        croppedAreaPixels,
      );

      const uploadRes = await api.post("/upload", { image: croppedBase64 });
      const imageUrl = uploadRes.data.url;

      await api.post("/website/sliders", { imageUrl });

      notification.success({ message: "تمت إضافة الصورة إلى السلايدر" });

      setCropModalOpen(false);
      setRawImageSrc(null);
      getSliders();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "حدث خطأ أثناء رفع الصورة",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setRawImageSrc(null);
  };

  // ========= حذف =========
  const deleteSlider = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/website/sliders/${id}`);
      notification.success({ message: "تم حذف الصورة" });
      getSliders();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "حدث خطأ أثناء الحذف",
      });
    } finally {
      setLoading(false);
    }
  };

  // ========= تفعيل / إخفاء =========
  const toggleSliderStatus = async (slider) => {
    try {
      setActionLoadingId(slider.id);
      await api.put(`/website/sliders/${slider.id}`, {
        isActive: !slider.isActive,
      });
      notification.success({
        message: slider.isActive
          ? "تم إخفاء الصورة من السلايدر"
          : "تم تفعيل الصورة في السلايدر",
      });
      getSliders();
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "حدث خطأ أثناء التعديل",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // ========= تغيير الترتيب =========
  const moveSlider = async (slider, direction) => {
    const currentIndex = sliders.findIndex((item) => item.id === slider.id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sliders.length) return;

    const currentSlider = sliders[currentIndex];
    const targetSlider = sliders[targetIndex];

    try {
      setActionLoadingId(slider.id);
      await Promise.all([
        api.put(`/website/sliders/${currentSlider.id}`, {
          sortOrder: targetSlider.sortOrder,
        }),
        api.put(`/website/sliders/${targetSlider.id}`, {
          sortOrder: currentSlider.sortOrder,
        }),
      ]);
      notification.success({ message: "تم تحديث ترتيب الصور" });
      getSliders();
    } catch (error) {
      notification.error({
        message:
          error?.response?.data?.message || "حدث خطأ أثناء تغيير الترتيب",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumb={[{ title: "إدارة الموقع" }, { title: "السلايدر" }]}
      />

      {/* هيدر الصفحة */}
      {fetching ? <PageLoader /> : <>
      <Card style={{ marginBottom: 20, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Text
              strong
              style={{
                fontSize: 16,
                marginBottom: "5px",
                display: "inline-block",
              }}
            >
              صور السلايدر الرئيسية
            </Text>
            <br />
            <Text type="secondary">
              الحد الأقصى 6 صور فقط — الحالي: {sliders.length} / 6
            </Text>
          </Col>
          <Col>
            <Upload
              showUploadList={false}
              beforeUpload={onFileSelected}
              disabled={sliders.length >= 6 || uploading}
              accept="image/*"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                loading={uploading}
                disabled={sliders.length >= 6}
              >
                إضافة صورة
              </Button>
            </Upload>
          </Col>
        </Row>
      </Card>

      {/* قائمة الصور */}
      <Row gutter={[16, 16]}>
        {sliders.map((slider, index) => (
          <Col xs={24} sm={12} lg={8} key={slider.id}>
            <Card
              hoverable
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: slider.isActive
                  ? "1px solid #e5e7eb"
                  : "1px solid #fecaca",
                opacity: slider.isActive ? 1 : 0.8,
              }}
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    src={slider.imageUrl}
                    alt="slider"
                    style={{
                      height: 240,
                      objectFit: "cover",
                      width: "100%",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Tag color="gold">ترتيب #{slider.sortOrder}</Tag>
                    {slider.isActive ? (
                      <Tag color="green">مفعلة</Tag>
                    ) : (
                      <Tag color="red">مخفية</Tag>
                    )}
                  </div>
                </div>
              }
            >
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text strong>ظهور الصورة في السلايدر</Text>
                  <Switch
                    checked={slider.isActive}
                    loading={actionLoadingId === slider.id}
                    onChange={() => toggleSliderStatus(slider)}
                    checkedChildren={<EyeOutlined />}
                    unCheckedChildren={<EyeInvisibleOutlined />}
                  />
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button
                    icon={<ArrowUpOutlined />}
                    onClick={() => moveSlider(slider, "up")}
                    disabled={index === 0 || actionLoadingId === slider.id}
                  >
                    لأعلى
                  </Button>
                  <Button
                    icon={<ArrowDownOutlined />}
                    onClick={() => moveSlider(slider, "down")}
                    disabled={
                      index === sliders.length - 1 ||
                      actionLoadingId === slider.id
                    }
                  >
                    لأسفل
                  </Button>
                  <Popconfirm
                    title="حذف الصورة؟"
                    okText="نعم"
                    cancelText="لا"
                    onConfirm={() => deleteSlider(slider.id)}
                  >
                    <Button danger icon={<DeleteOutlined />} loading={loading}>
                      حذف
                    </Button>
                  </Popconfirm>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {!sliders.length && (
        <Card style={{ marginTop: 16, textAlign: "center", borderRadius: 16 }}>
          لا توجد صور في السلايدر حتى الآن
        </Card>
      )}

      {/* ========= Modal الـ Cropper ========= */}
      </>}
      <Modal
        // title="اقص الصورة وحدد الجزء المطلوب"
        open={cropModalOpen}
        onCancel={handleCropCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCropCancel}>
            إلغاء
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUploadCropped}
          >
            رفع الصورة
          </Button>,
        ]}
      >
        {/* منطقة الـ Crop */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 340,
            background: "#111",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {rawImageSrc && (
            <Cropper
              image={rawImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        {/* Zoom slider */}
        <div style={{ marginTop: 20 }}>
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            تكبير / تصغير الصورة
          </Text>
          <Row align="middle" gutter={12}>
            <Col>
              <ZoomOutOutlined style={{ fontSize: 18, color: "#888" }} />
            </Col>
            <Col flex={1}>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={setZoom}
                tooltip={{ formatter: (v) => `${Math.round(v * 100)}%` }}
              />
            </Col>
            <Col>
              <ZoomInOutlined style={{ fontSize: 18, color: "#888" }} />
            </Col>
          </Row>
        </div>

        <Text
          type="secondary"
          style={{ fontSize: 12, marginTop: 8, display: "block" }}
        >
          حرك الصورة بالماوس أو الإصبع لتحديد الجزء المطلوب — النسبة ثابتة 16:9
        </Text>
      </Modal>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
