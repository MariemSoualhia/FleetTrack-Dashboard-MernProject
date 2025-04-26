import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs";

const { Option } = Select;
const Alert = MuiAlert;

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriversAndTrucks = async () => {
    try {
      const token = localStorage.getItem("token");
      const [driversRes, trucksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/drivers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/trucks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDrivers(driversRes.data);
      setTrucks(trucksRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDriversAndTrucks();
  }, []);

  const onFinish = async (values) => {
    const token = localStorage.getItem("token");

    const payload = {
      ...values,
      startTime: values.startTime.toISOString(),
      endTime: values.endTime.toISOString(),
    };

    try {
      if (editingTrip) {
        await axios.put(
          `http://localhost:5000/api/trips/${editingTrip._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlertSeverity("success");
        setAlertMessage("Trip updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/trips", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlertSeverity("success");
        setAlertMessage("Trip added successfully!");
      }

      setSnackbarOpen(true);
      setIsModalOpen(false);
      fetchTrips();
      setEditingTrip(null);
      form.resetFields();
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || "Error while saving trip"
      );
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
    form.setFieldsValue({
      driverId: trip.driverId?._id || trip.driverId,
      truckId: trip.truckId?._id || trip.truckId,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      startTime: dayjs(trip.startTime),
      endTime: dayjs(trip.endTime),
      distanceDriven: trip.distanceDriven,
      fuelUsed: trip.fuelUsed,
      deliveryStatus: trip.deliveryStatus,
      delayReason: trip.delayReason || undefined,
    });
  };

  const handleDelete = async (tripId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertSeverity("success");
      setAlertMessage("Trip deleted successfully!");
      setSnackbarOpen(true);
      fetchTrips();
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error.response?.data?.message || "Error while deleting trip"
      );
      setSnackbarOpen(true);
    }
  };

  const columns = [
    {
      title: "Driver",
      dataIndex: ["driverId", "name"],
      key: "driver",
      render: (_, record) => record.driverId?.name || "Unknown",
    },
    {
      title: "Truck",
      dataIndex: ["truckId", "plateNumber"],
      key: "truck",
      render: (_, record) => record.truckId?.plateNumber || "Unknown",
    },
    {
      title: "Start Location",
      dataIndex: "startLocation",
      key: "startLocation",
    },
    {
      title: "End Location",
      dataIndex: "endLocation",
      key: "endLocation",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Distance Driven (km)",
      dataIndex: "distanceDriven",
      key: "distanceDriven",
    },
    {
      title: "Fuel Used (L)",
      dataIndex: "fuelUsed",
      key: "fuelUsed",
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
    },
    {
      title: "Delay Reason",
      dataIndex: "delayReason",
      key: "delayReason",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this trip?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Trips Management</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: "16px" }}
        onClick={() => {
          setEditingTrip(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        Add Trip
      </Button>

      <Table
        columns={columns}
        dataSource={trips}
        loading={loading}
        rowKey="_id"
      />

      {/* Modal Form for Add/Edit Trip */}
      <Modal
        title={editingTrip ? "Edit Trip" : "Add Trip"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="driverId"
            label="Driver"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select driver">
              {drivers.map((driver) => (
                <Option key={driver._id} value={driver._id}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="truckId" label="Truck" rules={[{ required: true }]}>
            <Select placeholder="Select truck">
              {trucks.map((truck) => (
                <Option key={truck._id} value={truck._id}>
                  {truck.plateNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="startLocation"
            label="Start Location"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter start location" />
          </Form.Item>

          <Form.Item
            name="endLocation"
            label="End Location"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter end location" />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="distanceDriven"
            label="Distance Driven (km)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="fuelUsed"
            label="Fuel Used (L)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="deliveryStatus"
            label="Delivery Status"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value) => {
                if (value === "delayed") {
                  form.setFields([
                    {
                      name: "delayReason",
                      errors: ["Please enter delay reason!"],
                    },
                  ]);
                }
              }}
            >
              <Option value="on-time">On-Time</Option>
              <Option value="delayed">Delayed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="delayReason" label="Delay Reason">
            <Input placeholder="Enter reason if delayed" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingTrip ? "Update Trip" : "Add Trip"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Snackbar Notifications */}
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

export default TripsPage;
