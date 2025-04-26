import { Layout, Menu, Spin } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  SolutionOutlined,
  AlertOutlined,
  FileSearchOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const currentKey = location.pathname.split("/")[1] || "dashboard";

  // ⏳ Ne rien afficher tant que le user est en chargement
  if (loading) {
    return (
      <Sider
        width={200}
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </Sider>
    );
  }

  const allMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      roles: ["manager", "supervisor", "logisticsOperator", "companyOwner"],
    },
    {
      key: "drivers",
      icon: <TeamOutlined />,
      label: "Drivers",
      roles: ["manager", "logisticsOperator"],
    },
    {
      key: "trucks",
      icon: <CarOutlined />,
      label: "Trucks",
      roles: ["manager"],
    },
    {
      key: "trips",
      icon: <SolutionOutlined />,
      label: "Trips",
      roles: ["manager", "logisticsOperator"],
    },
    {
      key: "alerts",
      icon: <AlertOutlined />,
      label: "Alerts",
      roles: ["supervisor", "manager"],
    },
    {
      key: "alerts-analytics",
      icon: <AlertOutlined />,
      label: "Alerts Analytics",
      roles: ["manager", "supervisor"],
    },

    {
      key: "reports",
      icon: <FileSearchOutlined />,
      label: "Reports",
      roles: ["manager", "companyOwner"],
    },
    {
      key: "reports-history",
      icon: <FileSearchOutlined />,
      label: "Reports History",
      roles: ["manager", "supervisor"],
    },
    {
      key: "kpis",
      icon: <LineChartOutlined />,
      label: "KPIs",
      roles: ["supervisor", "manager"],
    },
  ];

  const filteredItems = allMenuItems
    .filter((item) => item.roles.includes(user?.role))
    .map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
    }));

  const handleClick = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Sider width={200} style={{ background: "#fff" }}>
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{ height: "100%", borderRight: 0 }}
        onClick={handleClick}
        items={filteredItems}
      />
    </Sider>
  );
}

export default Sidebar;
