import React, { useState } from "react";
import {
  Box,
  Grid2,
  Card,
  CardContent,
  Typography,
  Modal,
  AppBar,
  Toolbar,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  FormControl,
  InputLabel,
  TextField,
  Select,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import profile icon
import "./dashboard.css";

function Dashboard() {
  //The Dropdown menus at retrieve and the profile icon
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [retrieveMenuAnchorEl, setRetrieveMenuAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  const isRetrieveMenuOpen = Boolean(retrieveMenuAnchorEl);
  const handleProfileMenuClick = (event) => setProfileMenuAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchorEl(null);
  const handleRetrieveMenuClick = (event) => setRetrieveMenuAnchorEl(event.currentTarget);
  const handleRetrieveMenuClose = () => setRetrieveMenuAnchorEl(null);

  //Functions and Variables related to the Create, Update, Delete cards.
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
    action: "", 
  });
  const [modalContent, setModalContent] = useState("");

  const handleCardClick = (content) => {
    setModalContent(content);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType("");
    setFormData({
      name: "",
      email: "",
      details: "",
      action: "", 
    });
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(`${modalType} Form Data Submitted:`, formData);
    // You can add further processing logic here, such as API calls.
    handleCloseModal();
  }
  const handleFormChange = (e) =>{
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }


  //Create Form that shall show up when the Create Card is clicked.
  const createForm = (
    <form onSubmit={handleFormSubmit}>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
        </Grid2>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </Grid2>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={formData.details}
            onChange={handleFormChange}
            multiline
            rows={4}
            required
          />
        </Grid2>
        <Grid2 item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );

  const updateForm = (
    <form onSubmit={handleFormSubmit}>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select
              name="action"
              value={formData.action}
              onChange={handleFormChange}
              required
            >
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="modify">Modify</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={formData.details}
            onChange={handleFormChange}
            multiline
            rows={4}
            required
          />
        </Grid2>
        <Grid2 item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );

  const deleteForm = (
    <form onSubmit={handleFormSubmit}>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Name of Item to Delete"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
        </Grid2>
        <Grid2 item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Delete Item
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );


  //A drawer that only shows up on mobile
  const [mobileOpen, setMobileOpen] = useState(false); 
  const drawerWidth = 240;
  const navItems = ["Create Update Delete", "Retrieve", "Analytics"];
  const container = () => document.body; //defines container that is used at line 141. Container for the drawer.
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //Cards that shall show up.
  const crudCards = [
    { title: "Create", description: "Add new entries" },
    { title: "Update", description: "Edit existing entries" },
    { title: "Delete", description: "Remove entries" },
  ];

  //placeholder analytics data
  const analyticsData = [
    { title: "Total Deliveries", value: "125" },
    { title: "Pending Orders", value: "18" },
    { title: "Active Drivers", value: "32" },
    { title: "Revenue", value: "$12,450" },
  ];

  return (
    <div className="dashboard-container">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            {/* Menu Button for Mobile Screens */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Title */}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              MUI
            </Typography>
            {/* Profile Icon */}
            <IconButton
              color="inherit"
              onClick={handleProfileMenuClick}
              sx={{ display: { xs: "block", sm: "block" } }}
            >
              <AccountCircleIcon />
            </IconButton>
            {/* Profile Menu */}
            <Menu
              anchorEl={profileMenuAnchorEl}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleRetrieveMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleRetrieveMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ marginTop: "64px" }}></Box>
      {/* Section: CRUD Operations */}
      <div className="section section-crud">
        <Grid2 container spacing={3}>
          <Grid2 item xs={12}>
            <Typography variant="h5" gutterBottom>
              CRUD Operations
            </Typography>
          </Grid2>
          {crudCards.map((card, index) => (
            <Grid2 item xs={12} sm={6} key={index}>
              <Card className="flashcard" onClick={() => handleOpenModal(card.title)}>
                <CardContent>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="body2">{card.description}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </div>

      {/* Section: Retrieve Data */}
      <div className="section section-retrieve">
        <Grid2 container spacing={3} alignItems="center">
          <Grid2 item>
            <Typography variant="h5" gutterBottom>
              Retrieve Data
            </Typography>
          </Grid2>
          <Grid2 item>
            <Button
              id="demo-positioned-button"
              aria-controls={isRetrieveMenuOpen ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isRetrieveMenuOpen ? "true" : undefined}
              onClick={handleRetrieveMenuClick}
            >
              Select
            </Button>
            <Menu
              id="demo-positioned-menu"
              anchorEl={retrieveMenuAnchorEl}
              open={isRetrieveMenuOpen}
              onClose={handleRetrieveMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleRetrieveMenuClose}>Bookings</MenuItem>
              <MenuItem onClick={handleRetrieveMenuClose}>Vehicles</MenuItem>
            </Menu>
          </Grid2>
        </Grid2>
      </div>

      {/* Section: Analytics */}
      <div className="section section-analytics">
        <Grid2 container spacing={4}>
          <Grid2 item xs={12}>
            <Typography variant="h5" gutterBottom>
              Analytics
            </Typography>
          </Grid2>
          {analyticsData.map((box, index) => (
            <Grid2 item xs={6} sm={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{box.title}</Typography>
                  <Typography variant="h4">{box.value}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </div>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {modalType} Operation
          </Typography>
          {modalType === "Create" && createForm}
          {modalType === "Update" && updateForm}
          {modalType === "Delete" && deleteForm}
        </Box>
      </Modal>
    </div>
  );
}

export default Dashboard;
