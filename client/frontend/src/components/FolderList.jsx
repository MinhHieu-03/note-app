import {
  Card,
  CardContent,
  IconButton,
  List,
  Typography,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewFolder from "./NewFolder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { graphQLRequest } from "../utils/request";
import { useNavigate } from "react-router-dom";

export default function FolderList({ folders: initialFolders }) {
  const { folderId } = useParams();
  const [activeFolderId, setActiveFolderId] = useState(folderId);
  const [hoveredId, setHoveredId] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folders, setFolders] = useState(initialFolders); // ✅ OK
  const navigate = useNavigate();


  // 🆕 thêm callback
  const handleAddFolderToList = (folder) => {
  setFolders((prev) => [folder, ...prev]);
};


  const handleRenameFolder = async (id, newName) => {
    const query = `
    mutation ($id: ID!, $name: String!) {
      renameFolder(id: $id, name: $name) {
        id
        name
      }
    }
  `;

    const { renameFolder } = await graphQLRequest({
      query,
      variables: { id, name: newName },
    });

    // ✅ cập nhật state folders
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: renameFolder.name } : folder
      )
    );
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

    // ✅ cập nhật lại danh sách folders
    setFolders((prev) => prev.filter((folder) => folder.id !== id));

    // ✅ nếu đang đứng trong folder vừa xoá, điều hướng về "/"
    if (folderId === id) {
      navigate("/");
    }
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
          <NewFolder onAddFolder={handleAddFolderToList} />
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
                  {editingFolder === id ? (
                    <TextField
                      variant="standard" // gạch chân tinh gọn
                      defaultValue={name}
                      autoFocus
                      fullWidth
                      inputProps={{
                        // cỡ chữ & đậm giống Typography
                        style: { fontSize: 16, fontWeight: "bold" },
                      }}
                      onBlur={(e) => {
                        handleRenameFolder(id, e.target.value);
                        setEditingFolder(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameFolder(id, e.target.value);
                          setEditingFolder(null);
                        }
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {/* {name} */}
                    </Typography>
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
