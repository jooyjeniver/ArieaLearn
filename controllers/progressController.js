const Progress = require('../models/Progress');
const Module = require('../models/Module');

// Get user's overall progress
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id })
      .populate('modules.moduleId', 'title description');

    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this user' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update lesson progress
exports.updateLessonProgress = async (req, res) => {
  try {
    const { moduleId, lessonId, completed, timeSpent } = req.body;

    let progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      progress = new Progress({ user: req.user.id, modules: [] });
    }

    let moduleProgress = progress.modules.find(m => m.moduleId.toString() === moduleId);
    
    if (!moduleProgress) {
      moduleProgress = {
        moduleId,
        completed: false,
        timeSpent: 0,
        lessons: []
      };
      progress.modules.push(moduleProgress);
    }

    let lessonProgress = moduleProgress.lessons.find(l => l.lessonId === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: false,
        timeSpent: 0
      };
      moduleProgress.lessons.push(lessonProgress);
    }

    lessonProgress.completed = completed;
    lessonProgress.timeSpent += timeSpent;
    lessonProgress.lastAccessed = new Date();

    // Update module progress
    moduleProgress.timeSpent += timeSpent;
    moduleProgress.lastAccessed = new Date();
    moduleProgress.completed = moduleProgress.lessons.every(l => l.completed);

    // Update total time spent
    progress.totalTimeSpent += timeSpent;
    progress.lastActive = new Date();

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add emotional data
exports.addEmotionalData = async (req, res) => {
  try {
    const { moduleId, lessonId, emotion, confidence, imageUrl, notes } = req.body;

    let progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      progress = new Progress({ user: req.user.id, modules: [] });
    }

    let moduleProgress = progress.modules.find(m => m.moduleId.toString() === moduleId);
    
    if (!moduleProgress) {
      moduleProgress = {
        moduleId,
        completed: false,
        timeSpent: 0,
        lessons: []
      };
      progress.modules.push(moduleProgress);
    }

    let lessonProgress = moduleProgress.lessons.find(l => l.lessonId === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: false,
        timeSpent: 0,
        emotionalData: []
      };
      moduleProgress.lessons.push(lessonProgress);
    }

    // Add emotional data
    lessonProgress.emotionalData.push({
      emotion,
      confidence,
      imageUrl,
      notes
    });

    // Update emotional summary
    await progress.updateEmotionalSummary(emotion);

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error adding emotional data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get emotional summary
exports.getEmotionalSummary = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id })
      .select('emotionalSummary');

    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this user' });
    }

    res.json(progress.emotionalSummary);
  } catch (error) {
    console.error('Error fetching emotional summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 