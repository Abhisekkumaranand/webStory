import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  public_id: { type: String }, 
  resource_type: String,         // Cloudinary public_id for deletion (optional)
  thumbnail: { type: String },
  duration: { type: Number, default: 5000 }, // ms for images
  animation: { type: String }
}, { _id: false });

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  slides: { type: [SlideSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.model('Story', StorySchema);
export default Story;
