import { Card, CardContent, IconButton, List, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewFolder from "./NewFolder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { graphQLRequest } from "../utils/request";

export default function FolderList({ folders }) {
  const { folderId } = useParams();
  console.log({ folderId });
  const [activeFolderId, setActiveFolderId] = useState(folderId);
  const [hoveredId, setHoveredId] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);

  const handleRenameFolder = async (id, newName) => {
    const query = `
    mutation ($id: ID!, $name: String!) {
      renameFolder(id: $id, name: $name) {
        id
        name
      }
    }
  `;

    await graphQLRequest({ query, variables: { id, name: newName } });
    window.location.reload(); // hoặc cập nhật local state nếu muốn nhanh hơn
  };

  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    const query = `
    mutation ($id: ID!) {
      deleteFolder(id: $id) {
        id
      }
    }
  `;

    await graphQLRequest({ query, variables: { id } });
    window.location.href = "/"; // hoặc navigate("/")
  };

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
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setEditingFolder(id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFolder(id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  {editingFolder === id && (
                    <Box sx={{ mt: 1 }}>
                      <input
                        type="text"
                        defaultValue={name}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenameFolder(id, e.target.value);
                            setEditingFolder(null);
                          }
                        }}
                      />
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
