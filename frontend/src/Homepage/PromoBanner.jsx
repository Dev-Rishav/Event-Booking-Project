import virat from '../assets/virat.jpeg';

const PromoBanner = () => {
    return (
      <div className="max-w-full mx-8 my-8 bg-cover bg-center rounded-lg overflow-hidden px-6 py-8 flex flex-wrap justify-between items-center"
        style={{
          backgroundColor: "red",  // ✅ Correct way to use imported image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center space-x-2 text-white">
          <img
            src="https://example.com/bookmyshow-logo.png" // Replace with actual logo
            alt="BookMyShow Stream"
            className="h-20"
          />
          <h2 className="text-white text-2xl font-bold">STREAM</h2>
        </div>
  
        <h3 className="text-white text-xl font-semibold">
          Endless Entertainment Anytime. Anywhere!
        </h3>
      </div>
    );
};

export default PromoBanner;
