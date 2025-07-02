import { Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const navigate = useNavigate();

  // lấy user & hàm signOut từ Context
  const { user, signOut } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut();           // gọi hàm signOut có sẵn trong context
    handleClose();             // đóng menu
    navigate('/login', { replace: true }); // chuyển về trang Login
  };

  // Nếu chưa đăng nhập thì ẩn menu
  if (!user) return null;

  return (
    <>
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={handleClick}
      >
        <Typography sx={{ mr: 1 }}>{user.displayName}</Typography>
        <Avatar
          alt="avatar"
          src={user.photoURL}
          sx={{ width: 24, height: 24 }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
