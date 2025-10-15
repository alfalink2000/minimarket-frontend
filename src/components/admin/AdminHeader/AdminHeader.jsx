// components/admin/AdminHeader/AdminHeader.jsx
import "./AdminHeader.css";

const AdminHeader = ({ children }) => (
  <header className="admin-header">
    <div className="admin-header__container">{children}</div>
  </header>
);

export default AdminHeader;
