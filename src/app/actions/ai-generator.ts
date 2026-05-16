"use server"

import { withRole } from "@/lib/safe-action"

// In a real app, this would call OpenAI/Gemini
export const generateCourseOutline = withRole(["TEACHER", "ADMIN"], async (user, { topic, level }: { topic: string, level: string }) => {
  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 2500))

  // Mocked curriculum-aware generation
  const outlines: Record<string, any[]> = {
    "English": [
      {
        title: "Unit 1: Lifestyle and Consumption",
        lessons: [
          { title: "Vocabulary: Food and Drink", type: "TEXT" },
          { title: "Grammar: Countable and Uncountable", type: "TEXT" },
          { title: "Pronunciation: Suffixes", type: "VIDEO" },
          { title: "Quiz: Lifestyle Basics", type: "QUIZ" }
        ]
      },
      {
        title: "Unit 2: Safety First",
        lessons: [
          { title: "Reading: Consumer Safety", type: "TEXT" },
          { title: "Vocabulary: Adjectives", type: "TEXT" },
          { title: "Video: Emergency Procedures", type: "VIDEO" }
        ]
      }
    ],
    "Physics": [
      {
        title: "Module 1: Mechanics",
        lessons: [
          { title: "Introduction to Motion", type: "VIDEO" },
          { title: "Newton's First Law", type: "TEXT" },
          { title: "Newton's Second Law", type: "TEXT" },
          { title: "Quiz: Laws of Motion", type: "QUIZ" }
        ]
      },
      {
        title: "Module 2: Energy and Work",
        lessons: [
          { title: "Kinetic Energy", type: "TEXT" },
          { title: "Potential Energy", type: "TEXT" },
          { title: "Video: Energy Transformation", type: "VIDEO" }
        ]
      }
    ]
  }

  // Try to find a match or return a generic one
  const matchedKey = Object.keys(outlines).find(k => topic.toLowerCase().includes(k.toLowerCase()))
  const modules = matchedKey ? outlines[matchedKey] : [
    {
      title: `Introduction to ${topic}`,
      lessons: [
        { title: `Overview of ${topic}`, type: "VIDEO" },
        { title: "Core Concepts", type: "TEXT" },
        { title: "Practical Examples", type: "TEXT" },
        { title: "First Quiz", type: "QUIZ" }
      ]
    },
    {
      title: "Advanced Applications",
      lessons: [
        { title: "Historical Context", type: "TEXT" },
        { title: "Future Trends", type: "VIDEO" }
      ]
    }
  ]

  return { success: true, modules }
})
