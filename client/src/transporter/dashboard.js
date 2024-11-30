import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import "./dashboard.css";
import AnalyticsCard from "./analyticsComponent";

function Dashboard() {
  const [transporterData, setTransporterData] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // For deletion target

  const divisions = ["Route", "Vehicle", "Bookings"];

  const retrieveMenu = async (menuOption) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/transporter/get`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table_name: menuOption,
            userId: Cookies.get("userId"),
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.result[0] && Array.isArray(data.result[0]) && data.result[0].length > 0) {
          setTransporterData(data.result[0]);
          setNoResult(false);
        } else {
          setTransporterData([]);
          setNoResult(true);
        }
      } else {
        setNoResult(true);
        alert("Failed to fetch data.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdate = (item) => {
    // Logic to handle update (e.g., open a modal or navigate to update page)
    console.log("Update clicked for", item);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/transporter/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedItem.id, // Use the appropriate unique identifier
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Item deleted successfully.");
        setTransporterData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      } else {
        alert("Failed to delete item.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const confirmDelete = (item) => {
    setSelectedItem(item);
    setOpenConfirmDialog(true);
  };

  return (
    <div>
    <div className="CRUD-Container">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {divisions.map((division, index) => (
            <Button key={index} variant="contained" onClick={() => retrieveMenu(division)}>
              {division}
            </Button>
          ))}
        </Stack>

        {transporterData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
              Search Results <AddIcon sx={{ ml: 1 }} />
            </Typography>
            <Stack spacing={2}>
              {transporterData.map((item, index) => (
                <Card key={index}>
                  <CardContent>
                    <Typography variant="h6">
                      {item.vehicle_id || item.route_id || item.booking_id || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {Object.entries(item)
                        .filter(([key]) => !["vehicle_id", "route_id", "booking_id"].includes(key))
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(item)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => confirmDelete(item)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {noResult && transporterData.length === 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
            No results found.
          </Typography>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <AnalyticsCard></AnalyticsCard>
    </div>
    </div>
  );
}

export default Dashboard;
