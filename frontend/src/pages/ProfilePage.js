import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Spin,
} from "antd";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const Alert = MuiAlert;

function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        position: user.position,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔄 On met à jour via login() pour que le useEffect se déclenche
      login(res.data.user, res.data.token);

      setAlertSeverity("success");
      setAlertMessage("Profile updated successfully.");
    } catch (err) {
      setAlertSeverity("error");
      setAlertMessage("Error updating profile.");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/users/${user.id}/change-password`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertSeverity("success");
      setAlertMessage("Password changed successfully.");
      passwordForm.resetFields();
    } catch (err) {
      setAlertSeverity("error");
      setAlertMessage(
        err.response?.data?.message || "Error changing password."
      );
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      login(res.data.user, res.data.token);
      setAlertSeverity("success");
      setAlertMessage("Profile photo updated.");
    } catch (err) {
      setAlertSeverity("error");
      setAlertMessage("Error updating profile photo.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        User Profile
      </Title>

      <Row gutter={32}>
        <Col span={8}>
          <Card title="Profile Photo">
            <div style={{ textAlign: "center" }}>
              <img
                src={`http://localhost:5000${user?.profileImage}`}
                alt="Profile"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 16,
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="primary"
                onClick={handleImageUpload}
                style={{ marginTop: 8 }}
                disabled={!selectedFile}
              >
                Update Photo
              </Button>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Profile Information" style={{ marginBottom: 24 }}>
            <Form form={form} layout="vertical" onFinish={handleProfileUpdate}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>

              <Form.Item name="company" label="Company">
                <Input />
              </Form.Item>

              <Form.Item name="position" label="Position">
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Change Password" style={{ marginBottom: 24 }}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Divider />

          {/* <div style={{ textAlign: "center" }}>
            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          </div> */}
        </Col>
      </Row>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertSeverity}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ProfilePage;
