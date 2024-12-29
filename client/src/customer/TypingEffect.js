import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TypingEffect = () => {
  const [index, setIndex] = useState(0); // Track the current character index
  const fullText = "UrbanHub";

  useEffect(() => {
    if (index < fullText.length) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => prevIndex + 1);
      }, 200); // Add a new character every 200ms

      return () => clearInterval(interval); // Clear interval when component unmounts or index changes
    }
  }, [index, fullText.length]); // Depend on index and text length

  return (
    <Box
      sx={{
        display: "flex", // Use flexbox for centering
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        backgroundColor: "#f5f5f5", // Light background color
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: "monospace",
          color: "#44A1A0",
          fontWeight: "bold",
        }}
      >
        {fullText.slice(0, index)}{/* Display characters up to the current index */}
        {index < fullText.length && ( // Only show the blinking cursor while typing
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: "10px",
              height: "40px",
              backgroundColor: "#44A1A0",
              animation: "blink 0.8s step-start infinite",
              marginLeft: "5px",
              "@keyframes blink": {
                "0%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0,
                },
                "100%": {
                  opacity: 1,
                },
              },
            }}
          />
        )}
      </Typography>
    </Box>
  );
};

export default TypingEffect;
