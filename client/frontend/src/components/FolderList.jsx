import { Card, CardContent, IconButton, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewFolder from "./NewFolder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FolderList({ folders }) {
  const { folderId } = useParams();
  console.log({ folderId });
  const [activeFolderId, setActiveFolderId] = useState(folderId);
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "#7D9D9C",
        height: "100%",
        padding: "10px",
        textAlign: "left",
        overflowY: "auto",
      }}
      subheader={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "white" }}>
            Folders
          </Typography>
          <NewFolder />
        </Box>
      }
    >
      {folders.map(({ id, name }) => {
        const isActive = id === activeFolderId;
        const isHovered = id === hoveredId;

        return (
          <Box
            key={id}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            sx={{ position: "relative" }}
          >
            <Link
              key={id}
              to={`folders/${id}`}
              style={{
                textDecoration: "none",
              }}
              onClick={() => setActiveFolderId(id)}
            >
              <Card
                sx={{
                  mb: "5px",
                  backgroundColor: isActive ? "rgb(255 211 140)" : null,
                  transition: "background-color 0.2s",
                }}
              >
                <CardContent
                  sx={{ "&:last-child": { pb: "10px" }, padding: "10px" }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    {name}
                  </Typography>

                  {isHovered && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        display: "flex",
                        gap: 1,
                      }}
                      onClick={(e) => e.preventDefault()} // Ngăn Link bị click khi bấm icon
                    >
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Link>
          </Box>
        );
      })}
    </List>
  );
}
