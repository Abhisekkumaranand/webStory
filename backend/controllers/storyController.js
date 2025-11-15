import Story from "../models/Story.js";
import { cloudinary } from "../middleware/upload.js";



const createStory = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    // Parse slides metadata safely
    let slidesMeta = [];
    if (req.body.slides) {
      try {
        slidesMeta = JSON.parse(req.body.slides);
      } catch (err) {
        slidesMeta = [];
      }
    }

    const files = req.files || [];
    const slides = [];

    for (const meta of slidesMeta) {
      const file = files[meta.fileIndex];
      if (!file) continue;

      const resource_type = file.mimetype.startsWith("video")
        ? "video"
        : "image";

      // Upload to Cloudinary manually
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "web-stories",
            resource_type,
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      slides.push({
        type: meta.type || resource_type,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        resource_type, // ✅ ADDED
        duration:
          meta.duration || (resource_type === "video" ? undefined : 5000),
        animation: meta.animation || null,
      });
    }

    const story = new Story({ title, category: category || "General", slides });
    await story.save();
    return res.status(201).json(story);
  } catch (err) {
    console.error("createStory error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).lean();
    return res.json(stories);
  } catch (err) {
    console.error("getStories error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    return res.json(story);
  } catch (err) {
    console.error("getStory error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const { title, category } = req.body;
    if (title) story.title = title;
    if (category) story.category = category;

    // If slides JSON provided, we can either replace or merge.
    if (req.body.slides) {
      try {
        const slidesMeta = JSON.parse(req.body.slides);
        const files = req.files || [];
        const slides = [];

        // 🔧 DELETE OLD CLOUDINARY ASSETS FIRST
        const oldPublicIds = story.slides
          .map((s) => ({ public_id: s.public_id, resource_type: s.resource_type || s.type }))
          .filter((item) => item.public_id);

        for (const { public_id, resource_type } of oldPublicIds) {
          try {
            await cloudinary.uploader.destroy(public_id, {
              invalidate: true,
              resource_type: resource_type === "video" ? "video" : "image",
            });
          } catch (err) {
            console.warn(`Failed to delete ${public_id}:`, err.message);
          }
        }

        for (const meta of slidesMeta) {
          if (typeof meta.fileIndex === "number" && files[meta.fileIndex]) {
            const file = files[meta.fileIndex];
            const resource_type = file.mimetype.startsWith("video")
              ? "video"
              : "image";

            // Upload to Cloudinary manually
            const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: "web-stories",
                  resource_type,
                  public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            });

            slides.push({
              type: meta.type || resource_type,
              url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
              resource_type, // 🔧 ADDED
              duration:
                meta.duration || (resource_type === "video" ? undefined : 5000),
              animation: meta.animation || null,
            });
          } else if (meta.url) {
            slides.push({
              type: meta.type || "image",
              url: meta.url,
              public_id: meta.public_id || undefined,
              resource_type: meta.resource_type || meta.type || "image", // 🔧 ADDED
              duration: meta.duration || 5000,
              animation: meta.animation || null,
            });
          }
        }

        story.slides = slides;
      } catch (err) {
        console.warn("Failed to parse slides JSON", err);
        return res.status(400).json({ message: "Invalid slides format" }); // 🔧 CHANGED
      }
    }

    await story.save();
    return res.json(story);
  } catch (err) {
    console.error("updateStory error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Optionally delete associated Cloudinary assets (if public_id present)
    try {
      const publicIds = story.slides.map((s) => s.public_id).filter(Boolean);
      for (const slide of story.slides) {
        if (!slide.public_id) continue;
        
        const resource_type = slide.resource_type || slide.type || "image"; // 🔧 USE STORED TYPE
        try {
          await cloudinary.uploader.destroy(slide.public_id, {
            invalidate: true,
            resource_type: resource_type === "video" ? "video" : "image",
          });
        } catch (err) {
          console.warn(`Failed to delete ${slide.public_id}:`, err.message);
        }
      }
    } catch (err) {
      console.warn("Error deleting cloudinary assets:", err);
    }

    await story.deleteOne();
    return res.json({ message: "Story deleted" });
  } catch (err) {
    console.error("deleteStory error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { createStory, getStories, getStory, updateStory, deleteStory };