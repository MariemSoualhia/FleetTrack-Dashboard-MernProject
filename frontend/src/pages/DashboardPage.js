import { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Typography, Spin, message, Calendar } from "antd";
import {
  CarOutlined,
  AlertOutlined,
  TeamOutlined,
  LineChartOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useAuth } from "../context/AuthContext";

dayjs.locale("fr");

const { Title, Text } = Typography;

function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/kpis/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKpis(res.data);
      } catch (error) {
        message.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const todayStr = dayjs().format("dddd D MMMM YYYY");
  const userName = user?.name || "User";
  const userRole = user?.role || "Unknown Role";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={3}>👋 Welcome, {userName}</Title>
            <Text strong>{userRole}</Text>
            <br />
            <Text type="secondary">Today is {todayStr}</Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ maxWidth: 350, height: 200 }}>
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>

      <Title level={2} style={{ color: "#1890ff", marginTop: 32 }}>
        Fleet Overview
      </Title>
      <Text type="secondary">
        Real-time overview of your fleet performance and operations.
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col span={6}>
          <Card bordered hoverable>
            <DashboardOutlined style={{ fontSize: 32, color: "#722ed1" }} />
            <Title level={4}>{kpis.totalTrips}</Title>
            <Text>Total Trips</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <LineChartOutlined style={{ fontSize: 32, color: "#13c2c2" }} />
            <Title level={4}>{kpis.totalDistanceDriven} km</Title>
            <Text>Total Distance Driven</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <TeamOutlined style={{ fontSize: 32, color: "#52c41a" }} />
            <Title level={4}>{kpis.totalDrivers}</Title>
            <Text>Total Drivers</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <CarOutlined style={{ fontSize: 32, color: "#1890ff" }} />
            <Title level={4}>{kpis.totalTrucks}</Title>
            <Text>Total Trucks</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <CarOutlined style={{ fontSize: 32, color: "#faad14" }} />
            <Title level={4}>{kpis.availableTrucks}</Title>
            <Text>Available Trucks</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <CarOutlined style={{ fontSize: 32, color: "#f5222d" }} />
            <Title level={4}>{kpis.inMaintenanceTrucks}</Title>
            <Text>Trucks in Maintenance</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <AlertOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
            <Title level={4}>{kpis.delayedTrips}</Title>
            <Text>Delayed Trips</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <AlertOutlined style={{ fontSize: 32, color: "#52c41a" }} />
            <Title level={4}>{kpis.onTimeTrips}</Title>
            <Text>On-Time Trips</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
