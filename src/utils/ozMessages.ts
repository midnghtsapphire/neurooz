import { NotificationType, OzCharacter } from './notificationEngine';

const messages = {
  dorothy: {
    morning: [
      "Good morning! Your journey down the Yellow Brick Road begins now. Let's see what's on your Short List today!",
      "It's a beautiful day in Oz! The sun is shining, and your path is clear. Let's tackle today's adventure together.",
      "Ready to start your adventure? Your Yellow Brick Road awaits!",
    ],
  },
  scarecrow: {
    hourly: [
      "I've been thinking... it's a good time to check your Short List and make sure we're still on the right path.",
      "Let's take a moment to think. Are we working on the most important thing right now?",
      "Time for a quick brain check! Is your focus where it needs to be?",
    ],
  },
  tin_man: {
    interruption_recovery: [
      "It's easy to get a little rusty when you're interrupted. Let's get you oiled up and moving again. What were we working on?",
      "Welcome back! It takes heart to return to a task. I'm proud of you for coming back.",
      "Have a heart-to-heart with your Short List. It knows what to do.",
    ],
  },
  lion: {
    evening: [
      "You showed true courage today! Let's look back at the fearsome tasks you conquered on your Short List.",
      "ROAR! You tamed the beast of procrastination today! An amazing effort.",
      "Well, I guess I'm not a coward anymore! And neither are you. Great work today!",
    ],
  },
  glinda: {
    weekly_review: [
      "It's time for your weekly review, my dear. Let's look at the path you've traveled and the road that lies ahead.",
      "You've had the power all along! Look at all you've accomplished this week.",
      "Time to wave your magic wand over your weekly plan.",
    ],
  },
  oz: {
    gentle_nudge: [
      "The Great and Powerful Oz has noticed that this task has been waiting for a while. Perhaps it's time to act?",
      "Do not arouse the wrath of the Great and Powerful Oz! (Just kidding. But maybe check on that task?)",
      "The Wizard is watching. (In a friendly, supportive way, of course!)",
    ],
  },
  tornado: {
    celebration: [
      "A twister of applause! You've just completed a major milestone!",
      "Hold on to your hat! You've just leveled up!",
      "WHOOSH! You're a force of nature!",
    ],
  },
  toto: {
    general: [
      "Woof! Got it.",
      "*Happy bark*",
      "*Tail wag* Ready for your command!",
    ],
  },
};

export function getOzMessage(
  type: NotificationType,
  character: OzCharacter,
  context?: any
): string {
  const characterMessages = messages[character];
  if (!characterMessages) return "Let's get back on track!";

  const typeMessages = characterMessages[type as keyof typeof characterMessages];
  if (!typeMessages || !Array.isArray(typeMessages)) {
    return "You've got this!";
  }

  // Random selection
  const randomIndex = Math.floor(Math.random() * typeMessages.length);
  let message = typeMessages[randomIndex];

  // Context substitution
  if (context) {
    message = message.replace(/\[Task Name\]/g, context.taskName || 'this task');
    message = message.replace(/\[Project Name\]/g, context.projectName || 'this project');
  }

  return message;
}
