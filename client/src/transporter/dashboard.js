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
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import "./dashboard.css";
import AnalyticsCard from "./analyticsComponent";

function Dashboard() {
  const [transporterData, setTransporterData] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const divisions = ["Route", "Vehicle", "Bookings"];
  const [openFormDialog, setOpenFormDialog] = useState(false);
const [formType, setFormType] = useState(""); // 'route' or 'vehicle'
const [formData, setFormData] = useState({});
const [isUpdate, setIsUpdate] = useState(false); // True if updating

// Open form dialog
const openForm = (type, item = null) => {
  setFormType(type);
  setIsUpdate(!!item); // True if updating
  setFormData(item || {}); // Pre-fill form for update
  setOpenFormDialog(true);
};

// Handle input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};

// Handle form submission
const handleFormSubmit = async () => {
  const endpoint = formType === "route" ? "/routes" : "/vehicle";
  const method = isUpdate ? "POST" : "PUT";

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${endpoint}/${isUpdate ? "update" : "add"}`,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transporter_id:Cookies.get("userId")
        }),
        credentials: "include",
      }
    );

    if (response.ok) {
      alert(`${formType.charAt(0).toUpperCase() + formType.slice(1)} ${isUpdate ? "updated" : "added"} successfully.`);
      setOpenFormDialog(false);
      retrieveMenu(formType.charAt(0).toUpperCase() + formType.slice(1));
    } else {
      alert("Failed to process the form.");
    }
  } catch (error) {
    alert(error.message);
  }
};


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

  const handleUpdate = async () => {

  }

  // Handle the deletion of an item (vehicle or route) with separate API calls
  const handleDelete = async () => {
    try {
      let endpoint = "";
      let identifier = null;

      // Determine if the selected item is a vehicle or a route based on its properties
      if (selectedItem.vehicle_id) {
        endpoint = "/vehicle/delete";
        identifier = selectedItem.vehicle_id; // Vehicle-specific identifier
      } else if (selectedItem.route_id) {
        endpoint = "/routes/delete";
        identifier = selectedItem.route_id; // Route-specific identifier
      } else {
        alert("Invalid item type for deletion.");
        return;
      }

      // Make the API call to the correct endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: identifier }),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Item deleted successfully.");
        setTransporterData((prev) =>
          prev.filter((item) => item.vehicle_id !== identifier && item.route_id !== identifier)
        );
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
            <IconButton color="primary" onClick={() => openForm("route")}>
              <AddIcon /> Add Route
            </IconButton>
            <IconButton color="primary" onClick={() => openForm("vehicle")}>
              <AddIcon /> Add Vehicle
            </IconButton>
          </Stack>

          {transporterData.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
                Search Results <AddIcon sx={{ ml: 1 }}/>
              </Typography>
              <Stack spacing={2}>
                {transporterData.map((item, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h6">
                        {item.vehicle_id || item.route_id || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {Object.entries(item)
                          .filter(([key]) => !["vehicle_id", "route_id"].includes(key))
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button onClick={() => openForm(item.route_id ? "route" : "vehicle", item)}>
                          Update
                        </Button>
                        <Button variant="contained" color="error" onClick={() => confirmDelete(item)}>
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
        <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
          <DialogTitle>{isUpdate ? `Update ${formType}` : `Add New ${formType}`}</DialogTitle>
          <DialogContent>
            {formType === "route" ? (
              <>
                <TextField
                  label="Stops"
                  name="stops"
                  value={formData.stops || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Origin"
                  name="origin"
                  value={formData.origin || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Destination"
                  name="destination"
                  value={formData.destination || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </>
            ) : (
              <>
                <TextField
                  label="Vehicle Name"
                  name="vehicle_name"
                  value={formData.vehicle_name || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={formData.vehicle_number || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Route ID"
                  name="route_id"
                  value={formData.route_id || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit} color="primary">
              {isUpdate ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        <AnalyticsCard></AnalyticsCard>
      </div>
    </div>
  );
}

export default Dashboard;
