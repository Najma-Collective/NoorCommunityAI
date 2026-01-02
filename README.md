

#  Noor AI Tutor - RAG System Documentation

## Overview

The Noor AI Tutor now features a **Retrieval Augmented Generation (RAG)** system that enables:

1. **Customizable Lessons**: Load XML lesson files to teach any topic while preserving all pedagogical features
2. **Student Progress Tracking**: Upload JSON files containing years of student learning history
3. **Personalized Teaching**: AI reads student progress and adapts teaching based on strengths, weaknesses, and preferences
4. **Semantic Search**: Uses Google Gemini's embedding API to retrieve relevant context from student history

---

## Architecture

### Three-Part Modular Prompt System

```
FINAL_PROMPT = BASE_PROMPT + LESSON_PROMPT + STUDENT_CONTEXT
```

1. **BASE_PROMPT** (Constant)
   - Noor's identity and personality
   - Privacy guidelines and trauma-informed practices
   - All 9 HTML visual components (carousel, cards, dialogue boxes, etc.)
   - All 12 pedagogical principles (ZPD, scaffolding, error correction, Socratic questioning, etc.)
   - Tracker control instructions
   - Conversation principles

2. **LESSON_PROMPT** (Variable - Loaded from XML)
   - Lesson metadata (title, level, duration, topic)
   - Learning objectives
   - 9-stage lesson plan (Lead-in → Feedback)
   - Dialogue scripts
   - Grammar explanations
   - Pronunciation focus
   - Vocabulary bank
   - Common errors to watch for
   - Cultural context

3. **STUDENT_CONTEXT** (Variable - Generated via RAG)
   - Relevant session history (last 3-5 sessions)
   - Vocabulary mastery
   - Grammar points covered
   - Current strengths and weaknesses
   - Learning preferences
   - Interests for contextualization

---

## Getting Started

### Prerequisites

**Google Gemini API Key Required**

Noor AI Tutor uses Google's Gemini 2.5 Flash model for AI interactions and embeddings. You'll need a free API key to use the tutor.

**How to Get a Free Gemini API Key:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. When you open Noor AI Tutor, paste your API key in the welcome modal

**Note:** Google's free tier includes generous usage limits suitable for personal learning. Your API key is stored only in your browser's local storage and is never sent anywhere except Google's Gemini API.

### Optional: Enable Safe Image Integration

**Pexels API Key (Optional)**

Noor can enhance lessons with relevant, educational images from Pexels. This feature is completely optional and includes built-in content safety filtering.

**How to Enable Image Features:**

1. Visit [Pexels API](https://www.pexels.com/api/)
2. Sign up for a free API key
3. Open `index.html` in a text editor
4. Find the line `const PEXELS_API_KEY = '';` (around line 1020)
5. Paste your API key between the quotes: `const PEXELS_API_KEY = 'your_key_here';`

**Content Safety Features:**
- Automatic filtering of inappropriate search terms
- Blocklist prevents searches for personal/intimate content
- Queries are automatically sanitized to add "professional" context
- Only educational, workplace, and nature-focused images are used
- If an unsafe query is detected, no image is shown

**Image Usage Guidelines:**
- Noor will only use images when they genuinely enhance learning
- All images include proper attribution to photographers
- Images are limited to 1-2 per lesson stage
- Focus on objects, places, and activities rather than people

---

##  How to Use

### Step 1: Load a Lesson (XML)

1. Click **"Choose Lesson File"** in the sidebar
2. Select an XML lesson file (samples provided in `/lessons/` folder)
3. The lesson will load and chat will reset
4. Noor will greet you and begin the lesson

**Sample Lessons Included:**
- `lesson-present-perfect-b1.xml` - Present Perfect for life experiences (B1)
- `lesson-future-forms-a2.xml` - Future plans and predictions (A2)
- `lesson-conditionals-b2.xml` - Mixed conditionals (B2)

### Step 2: Load Student Progress (JSON)

1. Click **"Choose Progress File"** in the sidebar
2. Select a JSON progress file (template: `sample-student-progress.json`)
3. Noor will process the data using semantic search
4. Teaching will be personalized based on student history

**What Happens:**
- System generates embeddings for recent sessions
- When you chat, relevant context is retrieved using semantic similarity
- Noor references your past performance, vocabulary, and preferences

### Step 3: Chat with Personalized Learning

- Noor adapts to your level based on progress data
- Avoids re-teaching mastered vocabulary
- Focuses on weaknesses identified in history
- Uses your interests to contextualize examples
- Respects your preferred pace and learning style

---

##  XML Lesson File Format

### Complete Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lesson version="1.0">
  <metadata>
    <title>Lesson Title</title>
    <level>A1|A2|B1|B2|C1</level>
    <duration>60</duration>
    <topic>Grammar, Vocabulary, Functional Language, etc.</topic>
    <keywords>comma, separated, keywords</keywords>
  </metadata>

  <objectives>
    <objective>Learning objective 1</objective>
    <objective>Learning objective 2</objective>
  </objectives>

  <lessonPlan>
    <stage name="Lead-in" order="1">
      <description>
        Somatic grounding + lesson introduction
      </description>
    </stage>

    <stage name="Pre task A (Activate)" order="2">
      <description>
        Prior knowledge activation using Socratic questions
      </description>
    </stage>

    <stage name="Pre task B (Model)" order="3">
      <dialogue>
        <title>Dialogue Title</title>
        <context>Setting and scenario</context>
        <speaker name="Person A">
          Dialogue text for speaker A
        </speaker>
        <speaker name="Person B">
          Dialogue text for speaker B
        </speaker>
      </dialogue>
      <conceptChecks>
        Questions to check understanding
      </conceptChecks>
    </stage>

    <stage name="Pre task C (Lang Focus)" order="4">
      <grammarFocus>
        Detailed grammar explanation with examples, rules, and notice boxes
      </grammarFocus>
    </stage>

    <stage name="Pre task D (Pron)" order="5">
      <pronunciationFocus>
        Pronunciation features, weak forms, connected speech
      </pronunciationFocus>
    </stage>

    <stage name="Task Prep" order="6">
      <taskSetup>
        Scenario, roles, thinking time, sentence stems, vocabulary support
      </taskSetup>
    </stage>

    <stage name="Main Task" order="7">
      <activity>
        Main communicative activity description
      </activity>
    </stage>

    <stage name="Reporting" order="8">
      <reflection>
        Metacognitive reflection questions
      </reflection>
    </stage>

    <stage name="Feedback" order="9">
      <feedbackGuidance>
        Correction strategies, focus areas, praise, goals
      </feedbackGuidance>
    </stage>
  </lessonPlan>

  <vocabularyBank>
    <word context="category">word1, word2, word3</word>
  </vocabularyBank>

  <commonErrors>
    <error>Common error pattern to watch for</error>
  </commonErrors>

  <culturalContext>
    Cultural sensitivity notes and context
  </culturalContext>
</lesson>
```

### Key Features

- **All 9 stages preserved**: Noor follows the full TBL (Task-Based Learning) methodology
- **Rich dialogue support**: Multi-speaker conversations with context
- **Detailed grammar**: Explanations formatted with cards, notice boxes, examples
- **Pronunciation guidance**: Weak forms, connected speech, stress patterns
- **Scaffolding**: Sentence stems, vocabulary support, thinking time
- **Cultural awareness**: Notes on inclusive, trauma-informed teaching

---

##  JSON Student Progress Format

### Complete Structure

```json
{
  "studentId": "unique_identifier",
  "profile": {
    "name": "Student Name (or Anonymous)",
    "currentLevel": "A1|A2|B1|B2|C1|C2",
    "nativeLanguage": "Arabic|Spanish|Chinese|etc.",
    "learningGoals": [
      "Goal 1",
      "Goal 2"
    ]
  },
  "sessions": [
    {
      "sessionId": "session_001",
      "date": "2024-11-15T14:30:00Z",
      "lessonTitle": "Lesson Name",
      "duration": 45,
      "stagesCompleted": [
        {
          "name": "Lead-in",
          "completed": true,
          "timeSpent": 5,
          "performance": "strong|moderate|challenging"
        }
      ],
      "vocabularyLearned": [
        {
          "word": "vocabulary_item",
          "context": "Example sentence",
          "mastery": 0.8,
          "reviewCount": 3
        }
      ],
      "grammarPracticed": [
        {
          "point": "grammar-point-id",
          "accuracy": 0.75,
          "errors": ["error pattern 1", "error pattern 2"]
        }
      ],
      "assessmentScores": {
        "fluency": 7,
        "accuracy": 6,
        "complexity": 6,
        "pronunciation": 7
      }
    }
  ],
  "cumulativeProgress": {
    "totalSessions": 24,
    "totalHours": 18.5,
    "vocabularySize": 342,
    "grammarPointsMastered": ["point1", "point2"],
    "grammarPointsInProgress": ["point3"],
    "currentWeaknesses": ["weakness1", "weakness2"],
    "currentStrengths": ["strength1", "strength2"]
  },
  "personalizations": {
    "preferredPace": "slow|moderate|fast",
    "respondsWellTo": ["visual prompts", "real-life examples"],
    "avoidsTriggersRelatedTo": [],
    "culturalBackground": "Description",
    "interests": ["travel", "technology", "food"],
    "learningStyle": {
      "visualLearner": true,
      "auditoryLearner": false,
      "kinestheticLearner": false,
      "needsExtraTime": false,
      "prefersStructure": true
    }
  }
}
```

### How Progress Data is Used

**Semantic Search with Embeddings:**
1. Recent sessions (last 5) are converted to text summaries
2. Google Gemini Embedding API generates vector embeddings
3. When you start a lesson, query = lesson title + topic
4. Top 3 most relevant sessions are retrieved via cosine similarity
5. Context is injected into the system prompt

**Result:**
- Noor says things like: "I remember you struggled with irregular past tense in session 2"
- Avoids re-teaching vocabulary you've mastered
- Adapts difficulty based on past performance
- Uses your interests for examples

---

## 🔧 Technical Details

### Client-Side RAG Implementation

- **No backend required**: All processing happens in the browser
- **Privacy-first**: Student data never leaves the device
- **localStorage**: Loaded lesson and progress persist across sessions
- **Embedding API**: Google Gemini `text-embedding-004` model
- **Cosine similarity**: Measures relevance between query and session data
- **Threshold**: 0.3 similarity score for inclusion

### API Calls

**Embedding Generation:**
```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent
```

**Chat Completion:**
```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### Performance

- **Initial load**: ~2-3 seconds to process 5 sessions
- **Per-message overhead**: ~200ms for context retrieval
- **Storage**: ~5-10MB for typical progress file in localStorage

---

##  Use Cases

### For Teachers/Curriculum Designers

1. **Create Custom Lessons**
   - Design XML lessons for any topic
   - Distribute as files to students
   - Maintain full pedagogical framework
   - Update lessons without changing code

2. **Track Student Progress**
   - Students export progress JSON after each session
   - Teacher imports to see cumulative learning
   - Identify patterns across students
   - Personalize 1-on-1 tutoring

### For Students

1. **Continuous Learning Journey**
   - Load progress file at start of each session
   - Noor remembers what you've learned
   - Seamless progression across lessons
   - Export updated progress when done

2. **Portable Data**
   - Own your learning data as a JSON file
   - Transfer between devices
   - Share with teachers if desired
   - Years of history in one file

### For Organizations

1. **Standardized Curriculum**
   - Create lesson library (XML files)
   - Distribute via learning management system
   - Ensure consistent pedagogy
   - Update centrally

2. **Learning Analytics**
   - Aggregate student progress data
   - Identify effective lessons
   - Track cohort performance
   - Improve curriculum iteratively

---

##  Future Enhancements

Potential improvements to the RAG system:

1. **Automatic Progress Export**
   - Auto-generate updated JSON after each session
   - Include chat transcript
   - Track new vocabulary automatically

2. **Vector Database Backend**
   - Move from client-side to server
   - Support larger datasets (100+ sessions)
   - Cross-student analytics

3. **Lesson Recommendations**
   - Suggest next lesson based on progress
   - Adaptive curriculum paths
   - Spaced repetition scheduling

4. **Multimedia Lessons**
   - Embed images, audio, video in XML
   - Interactive exercises
   - Gamification elements

5. **Collaborative Features**
   - Student cohorts
   - Peer comparison (anonymized)
   - Teacher dashboards

---

## Creating Your Own Lessons

### Step-by-Step Guide

1. **Copy a sample lesson** as a template
2. **Edit metadata** (title, level, topic)
3. **Define 3-5 clear objectives**
4. **Write lesson plan** for all 9 stages:
   - Lead-in: Somatic + intro
   - Pre-task A: Prior knowledge
   - Pre-task B: Model dialogue
   - Pre-task C: Language focus (grammar/vocabulary)
   - Pre-task D: Pronunciation
   - Task Prep: Scaffold main task
   - Main Task: Communicative activity
   - Reporting: Reflection
   - Feedback: Error correction + praise
5. **Add vocabulary bank** (categorized)
6. **List common errors** to watch for
7. **Include cultural context** notes
8. **Test with Noor** - upload and chat!

### Best Practices

- **Be specific**: Detailed guidance helps Noor teach better
- **Use examples**: Include 3-5 examples for each grammar point
- **Scaffold heavily**: Provide sentence stems, vocabulary support
- **Cultural sensitivity**: Note potential triggers or assumptions
- **Realistic timing**: Allocate time based on 60-minute sessions
- **Varied activities**: Mix individual, pair, and reflection moments

---

##  Troubleshooting

### Lesson Won't Load

- Check XML is valid (use validator: https://www.xmlvalidation.com/)
- Ensure all required tags are present
- Check for special characters (use `&amp;` for `&`, etc.)

### Progress File Error

- Validate JSON syntax (use: https://jsonlint.com/)
- Ensure all required fields are present
- Check date format is ISO 8601: `2024-11-15T14:30:00Z`

### Noor Doesn't Use Progress Data

- Wait 2-3 seconds after upload for embeddings to generate
- Check browser console for errors
- Ensure you have an active internet connection (needed for Embedding API)
- Try refreshing the page

### Context Not Relevant

- Check that lesson topic is specific enough for matching
- Increase `maxChunks` parameter in `retrieveRelevantContext()` (default: 3)
- Lower similarity threshold in code (line ~1241: currently 0.3)

---

##  Support

For questions, issues, or feature requests:
- GitHub Issues: https://github.com/Najma-Collective/NoorCommunityAI/issues
- Community Forum: [Coming Soon]

---

## Contributing

We welcome contributions!

**Lesson Library:**
- Submit XML lessons via Pull Request to `/lessons/`
- Follow the sample lesson format
- Include clear metadata and objectives

**Code Improvements:**
- RAG system enhancements
- UI/UX improvements
- Documentation updates

---
**Student data privacy:** All student progress JSON files are the property of the student. No data is sent to servers (except Google Gemini API for embeddings and chat, per their privacy policy).

