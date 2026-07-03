import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const getStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <DashboardLayout>
      {/* ================= العملاء ================= */}
      <Title level={4} style={{ marginBottom: 16 }}>
        إحصائيات العملاء
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="إجمالي العملاء"
              value={stats?.totalCustomers || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="عملاء جدد" value={stats?.newCustomers || 0} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="تم أخذ المقاسات"
              value={stats?.measuredCustomers || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="تحت التنفيذ"
              value={stats?.inProgressCustomers || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="جاهز للتسليم"
              value={stats?.readyCustomers || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="تم التسليم"
              value={stats?.deliveredCustomers || 0}
            />
          </Card>
        </Col>
      </Row>

      {/* ================= المخزون ================= */}
      <Title level={4} style={{ margin: "32px 0 16px" }}>
        إحصائيات الإكسسوارات / المخزون
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="إجمالي القمصان" value={stats?.shirtsCount || 0} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="إجمالي البابيون"
              value={stats?.bowtiesCount || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="إجمالي الكرافتات" value={stats?.tiesCount || 0} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="إجمالي الأحزمة" value={stats?.beltsCount || 0} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic
              title="إجمالي الأحزمة العريضة"
              value={stats?.wideBeltsCount || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="إجمالي الشرابات" value={stats?.socksCount || 0} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Statistic title="إجمالي الشوز" value={stats?.shoesCount || 0} />
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth();
