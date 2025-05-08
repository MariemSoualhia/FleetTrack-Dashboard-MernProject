import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const { Option } = Select;
const Alert = MuiAlert;

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const onFinish = async (values) => {
    const token = localStorage.getItem("token");
    try {
      if (editingDriver) {
        await axios.put(
          `http://localhost:5000/api/drivers/${editingDriver._id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlertSeverity("success");
        setAlertMessage("Driver updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/drivers", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlertSeverity("success");
        setAlertMessage("Driver added successfully!");
      }
      setSnackbarOpen(true);
      setIsModalOpen(false);
      fetchDrivers();
      setEditingDriver(null);
      form.resetFields();
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || "Error while saving driver"
      );
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      hireDate: driver.hireDate ? driver.hireDate.split("T")[0] : "",
      status: driver.status,
    });
  };

  const handleDelete = async (driverId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/drivers/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertSeverity("success");
      setAlertMessage("Driver deleted successfully!");
      setSnackbarOpen(true);
      fetchDrivers();
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || "Error while deleting driver"
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Drivers Management</h2>

      {/* 🔍 Filtres */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <label style={{ fontWeight: "500" }}>Search by name</label>
          <Input
            placeholder="e.g. ali"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "500" }}>Filter by status</label>
          <Select
            placeholder="Select status"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            style={{ width: 200 }}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDriver(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Driver
        </Button>
      </div>

      {/* 📋 Tableau */}
      <Table
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "License Number",
            dataIndex: "licenseNumber",
            key: "licenseNumber",
          },
          {
            title: "Hire Date",
            dataIndex: "hireDate",
            key: "hireDate",
            render: (date) => new Date(date).toLocaleDateString(),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (status === "active" ? "Active" : "Inactive"),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this driver?"
                  onConfirm={() => handleDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            ),
          },
        ]}
        dataSource={drivers.filter((driver) => {
          const nameMatch = driver.name
            .toLowerCase()
            .includes(searchName.toLowerCase());
          const statusMatch = filterStatus
            ? driver.status === filterStatus
            : true;
          return nameMatch && statusMatch;
        })}
        loading={loading}
        rowKey="_id"
      />

      {/* ➕ / ✏️ Modal */}
      <Modal
        title={editingDriver ? "Edit Driver" : "Add Driver"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Driver Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter driver name" />
          </Form.Item>

          <Form.Item
            name="licenseNumber"
            label="License Number"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter license number" />
          </Form.Item>

          <Form.Item
            name="hireDate"
            label="Hire Date"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingDriver ? "Update Driver" : "Add Driver"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ✅ Snackbar */}
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

export default DriversPage;
