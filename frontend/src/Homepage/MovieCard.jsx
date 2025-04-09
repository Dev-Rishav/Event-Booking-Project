const MovieCard = ({ movie }) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={movie.image}
          alt={movie.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{movie.name}</h3>
          <p className="text-gray-600">{movie.category}</p>
          {movie.likes && <p className="text-green-500 text-sm">👍 {movie.likes} Likes</p>}
          {movie.rating && <p className="text-red-500 text-sm">⭐ {movie.rating}/10 {movie.votes} Votes</p>}
        </div>
      </div>
    );
  };
  
  export default MovieCard;
  