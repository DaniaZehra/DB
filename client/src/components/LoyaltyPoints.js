import React, { useState } from "react";
import Cookies from "js-cookie";
import IconButton from "@mui/material/IconButton";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Unstable_Popup as BasePopup } from "@mui/base";
import { styled } from "@mui/material/styles";

function LoyaltyPoints() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(null); // Store points here
  const [open, setOpen] = useState(false); // Control popup visibility
  const [anchor, setAnchor] = useState(null); // Reference for the popup position

  const handleLoyaltyOpen = async (event) => {
    if (open) {
        setOpen(false);
        setAnchor(null);
        return;
      }
    try {
      setAnchor(event.currentTarget); 
      setOpen(true); 
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/customer/loyalty-points`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cust_id: parseInt(Cookies.get("userId"), 10) }),
          credentials: "include",
        }
      );
      const data = await response.json();
      const points = data?.loyalty_points?.[0]?.[0]?.loyalty_points ?? 0;
      setLoyaltyPoints(points); 
    } catch (error) {
      console.error("Failed to fetch loyalty points:", error);
      setLoyaltyPoints("Error fetching points"); 
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="view loyalty points"
        color="inherit"
        onClick={handleLoyaltyOpen}
      >
        <EmojiEventsIcon />
      </IconButton>
      <BasePopup id="loyalty-popup" open={open} anchor={anchor}>
        <PopupBody>
          {loyaltyPoints !== null
            ? `${loyaltyPoints} loyalty points!`
            : "Fetching loyalty points..."}
        </PopupBody>
      </BasePopup>
    </>
  );
}

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const PopupBody = styled("div")(
  ({ theme }) => `
    width: max-content;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    box-shadow: ${
      theme.palette.mode === "dark"
        ? `0px 4px 8px rgb(0 0 0 / 0.7)`
        : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 0.875rem;
    z-index: 1;
  `
);

export default LoyaltyPoints;
