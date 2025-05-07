import { useEffect, useState } from "react";
import { Card, Table, Button, message, Spin } from "antd";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ApproveUsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = res.data.filter(
        (u) => !u.isApproved && u.role !== "manager"
      );
      setUsers(pending);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("User approved!");
      fetchUsers(); // Refresh list
    } catch (error) {
      message.error("Approval failed");
    }
  };

  useEffect(() => {
    if (user?.role === "manager") {
      fetchUsers();
    }
  }, [user]);

  if (loading) return <Spin style={{ display: "block", margin: "auto" }} />;

  if (user?.role !== "manager") {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>Access denied</div>
    );
  }

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="primary" onClick={() => approveUser(record._id)}>
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Pending User Approvals">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default ApproveUsersPage;
