import Review from '../model/ReviewModel.js';
import redisClient from '../database/Redis.js';

export const createReview = async(req,res) => {
  const { user_id, event_id, review_text } = req.body;

  try {
      const review = await Review.createReview(user_id, event_id, review_text);

      // Invalidate Redis cache
      await redisClient.del(`event_reviews:${event_id}`);

      res.status(201).json({ message: "Review added", review });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add review" });
  }
}

export const getEventReviews = async(req,res) => {
  const event_id = req.params.id;

  try {
      // Check cache
      const cachedReviews = await redisClient.get(`event_reviews:${event_id}`);
      if (cachedReviews) {
          return res.json({ message: "Reviews from cache", reviews: JSON.parse(cachedReviews) });
      }

      // Fetch from DB
      const reviews = await Review.getReviewsByEventId(event_id);

      // Store in Redis
      if (reviews && reviews.length > 0) {
        await redisClient.set(`event_reviews:${event_id}`, JSON.stringify(reviews));
    }
    
      res.json({ message: "Reviews from DB", reviews });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch reviews" });
  }
}