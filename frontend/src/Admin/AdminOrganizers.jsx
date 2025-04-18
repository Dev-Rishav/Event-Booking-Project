import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrganizers } from '../redux/slices/adminslice/adminActions';
import { useNavigate } from 'react-router-dom';

const AdminOrganizers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { organizers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrganizers());
  }, [dispatch]);

  const handleViewDetails = (email) => {
    navigate(`/admin/organizers/${email}`);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">All Registered Organizers</h2>

      {loading && <p className="text-center text-blue-500">Loading Organizers...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && organizers.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizers.map((organizer) => (
                <tr key={organizer.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{organizer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{organizer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{organizer.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewDetails(organizer.email)}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">No organizer found.</p>
      )}
    </div>
  );
};

export default AdminOrganizers;
