import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, fetchAllOrganizers } from '../redux/slices/adminslice/adminActions';

const AdminHome = () => {
  const dispatch = useDispatch();
  const { users, organizers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrganizers());
  }, [dispatch]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
    </div>
  );
};

export default AdminHome;
