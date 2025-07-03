import { NoteAddOutlined } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Link,
  Outlet,
  useParams,
  useLoaderData,
  useSubmit,
  useNavigate,
} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NoteList() {
  const { noteId, folderId } = useParams();
  const [activeNoteId, setActiveNoteId] = useState(noteId);
  const { folder } = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  console.log("[NoteLIST]", { folder });

  useEffect(() => {
    if (noteId) {
      setActiveNoteId(noteId);
      return;
    }

    if (folder?.notes?.[0]) {
      navigate(`note/${folder.notes[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, folder.notes]);

  const handleAddNewNote = () => {
    submit(
      {
        content: "",
        folderId,
      },
      { method: "post", action: `/folders/${folderId}` }
    );
  };

  const handleDeleteNote = (id) => {
  if (!window.confirm("Delete this note?")) return;

  /* ❌  ĐỪNG navigate ở đây  */

  /* ✅ Gửi POST tới route con (đường dẫn tương đối) */
  submit(
  { intent: "delete" },           
  { method: "post", action: `note/${id}` } 
);

};


  return (
    <Grid container height="100%">
      {/* Cột danh sách ghi chú */}
      <Grid
        item
        xs={4}
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#F0EBE3",
          height: "100%",
          overflowY: "auto",
          p: 2,
          textAlign: "left",
        }}
      >
        <List
          subheader={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight="bold">Notes</Typography>
              <Tooltip title="Add Note">
                <IconButton size="small" onClick={handleAddNewNote}>
                  <NoteAddOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          {folder.notes.map(({ id, content, updatedAt }) => {
            const isActive = id === activeNoteId;
            const isHovered = id === hoveredId;

            return (
              <Box
                key={id}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{ position: "relative" }}
              >
                <Link
                  to={`note/${id}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setActiveNoteId(id)}
                >
                  <Card
                    sx={{
                      mb: 0.5,
                      bgcolor: isActive ? "rgb(255 211 140)" : undefined,
                    }}
                  >
                    <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                      <div
                        style={{ fontSize: 14, fontWeight: "bold" }}
                        dangerouslySetInnerHTML={{
                          __html: content.substring(0, 30) || "Empty",
                        }}
                      />
                      <Typography fontSize={10}>
                        {moment(updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
                      </Typography>

                      {isHovered && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            display: "flex",
                            gap: 1,
                          }}
                          /* Ngăn Link bị kích hoạt khi bấm icon */
                          onClick={(e) => e.preventDefault()}
                        >
                          {/* <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditNote(id)}
                          >
                            <EditIcon fontSize="small" />{" "}
                            {/* ✅ fontSize chứ không phải fonSize */}
                          {/* </IconButton> */} 

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteNote(id)}
                          >
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
      </Grid>

      {/* Khu vực hiển thị nội dung ghi chú */}
      <Grid item xs={8}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
