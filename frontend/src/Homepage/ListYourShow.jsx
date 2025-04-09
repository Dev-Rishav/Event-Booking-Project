import { useNavigate } from "react-router-dom";

const ListYourShow = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="max-w-full mx-8 my-16 bg-gray-900 text-white px-6 py-12 flex justify-between items-center rounded-md">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <span className="text-xl">🎪</span> {/* Icon */}
        <div>
          <h3 className="text-lg font-semibold">
            <span className="text-white">List your Show</span>
          </h3>
          <p className="text-gray-300 text-sm">
            Got a show, event, activity, or a great experience? Partner with us & get listed on BookMyShow.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <button
        onClick={handleButtonClick}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Connect Us
    </button>
    </div>
  );
};

export default ListYourShow;
