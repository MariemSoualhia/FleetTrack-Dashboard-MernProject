// src/pages/AlertsPage.js
import { useEffect, useState } from "react";
import { Table, Button, Tag, Popconfirm, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";

const Alert = MuiAlert;

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const { user } = useAuth();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Data fetched:", res.data); // ✅ va s'afficher
      setAlerts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/alerts/${id}/resolve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertSeverity("success");
      setAlertMessage("Alert resolved successfully!");
      setSnackbarOpen(true);
      fetchAlerts(); // Refresh alerts
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Error resolving alert");
      setSnackbarOpen(true);
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "blue";
        if (type === "fuelOverconsumption") color = "volcano";
        else if (type === "excessiveDelay") color = "red";
        else if (type === "maintenanceNeeded") color = "orange";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "red" : "green"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "active" ? (
          <Popconfirm
            title="Mark this alert as resolved?"
            onConfirm={() => handleResolve(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<CheckCircleOutlined />} size="small">
              Resolve
            </Button>
          </Popconfirm>
        ) : (
          <span>—</span>
        ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Alerts Management</h2>

      <Table
        columns={columns}
        dataSource={alerts}
        loading={loading}
        rowKey="_id"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AlertsPage;
