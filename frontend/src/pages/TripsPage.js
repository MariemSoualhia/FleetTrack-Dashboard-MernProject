// 🔁 Imports essentiels
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
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs";
import TripMapModal from "./TripMapModal"; // 📌 Import custom map component

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
  const [form] = Form.useForm();
  const { user } = useAuth();

  const [filterDriver, setFilterDriver] = useState("");
  const [filterTruck, setFilterTruck] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartLocation, setFilterStartLocation] = useState("");

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedTripCoords, setSelectedTripCoords] = useState({
    start: null,
    end: null,
  });

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(res.data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlertMessage("Trip updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/trips", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlertMessage("Trip added successfully!");
      }
      setAlertSeverity("success");
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
    form.setFieldsValue({
      ...trip,
      startTime: dayjs(trip.startTime),
      endTime: dayjs(trip.endTime),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertSeverity("success");
      setAlertMessage("Trip deleted successfully!");
      setSnackbarOpen(true);
      fetchTrips();
    } catch (err) {
      setAlertSeverity("error");
      setAlertMessage("Error while deleting trip");
      setSnackbarOpen(true);
    }
  };

  const geocode = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();
    if (data.length === 0) throw new Error("Location not found");
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  const filteredTrips = trips.filter((trip) => {
    return (
      (!filterDriver || trip.driverId?.name === filterDriver) &&
      (!filterTruck || trip.truckId?.plateNumber === filterTruck) &&
      (!filterStatus || trip.deliveryStatus === filterStatus) &&
      (!filterStartLocation ||
        trip.startLocation
          ?.toLowerCase()
          .includes(filterStartLocation.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>Trips Management</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 16,
          alignItems: "flex-end",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Driver</label>
          <Select
            placeholder="Select Driver"
            style={{ width: 180 }}
            allowClear
            value={filterDriver}
            onChange={setFilterDriver}
          >
            {drivers.map((d) => (
              <Option key={d._id} value={d.name}>
                {d.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Truck</label>
          <Select
            placeholder="Select Truck"
            style={{ width: 180 }}
            allowClear
            value={filterTruck}
            onChange={setFilterTruck}
          >
            {trucks.map((t) => (
              <Option key={t._id} value={t.plateNumber}>
                {t.plateNumber}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Status</label>
          <Select
            placeholder="Select Status"
            style={{ width: 180 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="on-time">On-Time</Option>
            <Option value="delayed">Delayed</Option>
          </Select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            Start Location
          </label>
          <Input
            placeholder="Enter Start Location"
            style={{ width: 180 }}
            value={filterStartLocation}
            onChange={(e) => setFilterStartLocation(e.target.value)}
          />
        </div>

        <div>
          <Tooltip title="Reset Filters">
            <Button
              shape="circle"
              icon={<ReloadOutlined />}
              onClick={() => {
                setFilterDriver("");
                setFilterTruck("");
                setFilterStatus("");
                setFilterStartLocation("");
              }}
            />
          </Tooltip>
        </div>

        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Trip
          </Button>
        </div>
      </div>

      <Table
        columns={[
          { title: "Driver", render: (_, r) => r.driverId?.name || "-" },
          { title: "Truck", render: (_, r) => r.truckId?.plateNumber || "-" },
          { title: "Start", dataIndex: "startLocation" },
          { title: "End", dataIndex: "endLocation" },
          {
            title: "Start Time",
            render: (_, r) => dayjs(r.startTime).format("YYYY-MM-DD HH:mm"),
          },
          {
            title: "End Time",
            render: (_, r) => dayjs(r.endTime).format("YYYY-MM-DD HH:mm"),
          },
          { title: "Distance (km)", dataIndex: "distanceDriven" },
          { title: "Fuel (L)", dataIndex: "fuelUsed" },
          { title: "Status", dataIndex: "deliveryStatus" },
          { title: "Reason", dataIndex: "delayReason" },
          {
            title: "Map",
            render: (_, r) => (
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={async () => {
                  setSelectedTripCoords({
                    start: r.startLocation,
                    end: r.endLocation,
                  });
                  setIsMapVisible(true);
                }}
              />
            ),
          },
          {
            title: "Actions",
            render: (_, r) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleEdit(r)}
                />
                <Popconfirm
                  title="Delete trip?"
                  onConfirm={() => handleDelete(r._id)}
                >
                  <Button icon={<DeleteOutlined />} type="text" danger />
                </Popconfirm>
              </div>
            ),
          },
        ]}
        dataSource={filteredTrips}
        rowKey="_id"
        loading={loading}
      />

      {/* 🗺️ Modal Carte */}
      <Modal
        open={isMapVisible}
        onCancel={() => setIsMapVisible(false)}
        footer={null}
        title="Trip Route Map"
        width={800}
      >
        <div style={{ height: 500 }}>
          {selectedTripCoords.start && selectedTripCoords.end && (
            <TripMapModal
              startLocation={selectedTripCoords.start}
              endLocation={selectedTripCoords.end}
            />
          )}
        </div>
      </Modal>

      {/* ✅ Notifications */}
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
