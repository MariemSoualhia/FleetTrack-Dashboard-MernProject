// src/pages/ReportsPage.js
import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Fonction pour enregistrer un rapport dans la base
const createReportEntry = async (
  reportType,
  periodStart,
  periodEnd,
  fileUrl,
  reportName,
  fileType,
  totalRecords
) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    await axios.post(
      "http://localhost:5000/api/reports",
      {
        generatedByUserId: user.user._id,
        reportType,
        reportName,
        fileType,
        totalRecords,
        reportPeriodStart: periodStart,
        reportPeriodEnd: periodEnd,
        fileUrl,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Report saved to database");
  } catch (error) {
    console.error(
      "❌ Error saving report:",
      error.response?.data || error.message
    );
  }
};

function ReportsPage() {
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const tripsRes = await axios.get("http://localhost:5000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(tripsRes.data);

      const alertsRes = await axios.get("http://localhost:5000/api/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateTripsReport = async () => {
    const doc = new jsPDF();
    doc.text("Trips Report", 14, 20);

    const tableData = trips.map((trip) => [
      trip.startLocation,
      trip.endLocation,
      new Date(trip.startTime).toLocaleDateString(),
      new Date(trip.endTime).toLocaleDateString(),
      trip.distanceDriven,
      trip.fuelUsed,
      trip.deliveryStatus,
    ]);

    autoTable(doc, {
      head: [
        [
          "Start Location",
          "End Location",
          "Start Date",
          "End Date",
          "Distance (km)",
          "Fuel Used (L)",
          "Status",
        ],
      ],
      body: tableData,
      startY: 30,
    });

    const today = new Date();
    const reportPeriodStart = today;
    const reportPeriodEnd = today;
    const fileName = `trips_report_${today.toISOString().slice(0, 10)}.pdf`;

    doc.save(fileName);

    await createReportEntry(
      "custom",
      reportPeriodStart,
      reportPeriodEnd,
      fileName,
      "Trips Report - " + today.toLocaleDateString(),
      "pdf",
      trips.length
    );
  };

  const generateAlertsReport = async () => {
    const doc = new jsPDF();
    doc.text("Alerts Report", 14, 20);

    const tableData = alerts.map((alert) => [
      alert.type,
      alert.message,
      alert.status,
      new Date(alert.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Type", "Message", "Status", "Date Created"]],
      body: tableData,
      startY: 30,
    });

    const today = new Date();
    const reportPeriodStart = today;
    const reportPeriodEnd = today;
    const fileName = `alerts_report_${today.toISOString().slice(0, 10)}.pdf`;

    doc.save(fileName);

    await createReportEntry(
      "custom",
      reportPeriodStart,
      reportPeriodEnd,
      fileName,
      "Alerts Report - " + today.toLocaleDateString(),
      "pdf",
      alerts.length
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2
        style={{ textAlign: "center", marginBottom: "24px", color: "#1890ff" }}
      >
        Reports Management
      </h2>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={10}>
          <Card
            title="Trips Report"
            bordered={false}
            style={{ textAlign: "center", borderRadius: "12px" }}
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={generateTripsReport}
            >
              Download Trips PDF
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card
            title="Alerts Report"
            bordered={false}
            style={{ textAlign: "center", borderRadius: "12px" }}
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={generateAlertsReport}
            >
              Download Alerts PDF
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsPage;
