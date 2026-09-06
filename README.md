# Hakim's University - Sudan Higher Education Academic Portal

An all-in-one digital academic portal designed for Sudanese universities and colleges under the Ministry of Higher Education & Scientific Research.

## 🌟 Key Features

- **🏛️ Multi-University Hub**: Supports University of Khartoum, University of Dongola, Open University of Sudan, Red Sea University, and all regional university branches.
- **📚 7 Core Student Services**:
  - **Question Bank & Practice Tests**: Subject-filtered MCQs, instant grading, and explanations.
  - **Lectures & HD Video Suite**: Integrated playable educational video streams, chapter timestamps, and note-taking.
  - **Content & File Sharing**: Student lecture notes, past papers, OSCE summaries, and clinical guides.
  - **Assignment Submission**: Drag-and-drop file upload with live progress tracking.
  - **Assignments & Exams Schedule**: Live deadlines, quiz portal, and exam hall schedules.
  - **Academic Transcript & Results**: Dynamic student profile lookup, GPA calculation, and printable official transcripts.
  - **Electronic Library**: Interactive digital medical/science textbooks and full e-book reader.
- **🛡️ Administration & Examination Control Center**: Role-based access for grading addendums, grade publishing, and student verification.
- **🌐 Bilingual Arabic / English**: Instant dynamic switching with full LTR/RTL support across all modules.
- **⚡ Supabase Integration**: Live authentication, account registration, session persistence, and password reset flows.
- **📤 Real File Uploads**: Admin course materials and student assignment submissions are actually persisted to Supabase (with base64 file storage) and rendered across pages — not just UI animation.
- **📡 Offline-First Sync**: When offline, all creations and uploads are stored locally in a sync queue and automatically pushed to the cloud (via Netlify serverless functions) the moment the connection is restored.

## ⚙️ Backend Tables (Supabase)

Create these tables in your Supabase project to enable the cloud functionality:

- **`student_results`**: `student_id`, `student_name`, `college`, `subject`, `score`, `grade`, `status`, `note`
- **`uploaded_lectures`**: `lecture_id`, `title`, `college`, `category`, `instructor`, `file_name`, `file_size`, `file_data`, `upload_date`, `university`
- **`exam_schedule`**: `schedule_id`, `title`, `type`, `status`, `exam_date`, `exam_time`, `venue`, `weight`, `exam_limit`, `university`
- **`student_submissions`**: `student_name`, `student_email`, `student_id`, `file_name`, `file_data`, `file_size`, `course`, `status`, `university`, `college`
- **`student_shares`**: `student_name`, `title`, `file_name`, `file_data`, `file_size`, `university`, `college`

## 🚀 Deploying the Serverless Functions (Netlify)

The offline sync relies on two serverless functions in `netlify/functions/`:

1. `upload-assignment.js` — receives offline-captured assignment submissions and writes them to `student_submissions`.
2. `sync-portal-data.js` — receives queued changes (results, lectures, schedule) and applies them to Supabase.

To deploy:

1. Push the repo to GitHub and import it in the [Netlify dashboard](https://app.netlify.com).
2. The included `netlify.toml` configures the functions and static publish.
3. In **Site settings → Environment variables**, set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY` (service-role key from Supabase **Settings → API** — this bypasses RLS on the server)
4. Deploy. The functions are then reachable at `/.netlify/functions/upload-assignment` and `/.netlify/functions/sync-portal-data`.

> **Note:** When running locally (no Netlify), the functions won't exist, so the app gracefully falls back to pure local-first storage (all data still persists in `localStorage` and an offline queue). Deploying to Netlify enables true cloud sync.

## 🚀 Getting Started

Open `index.html` in any modern web browser or serve with a local web server (e.g. `npx serve` or Live Server).
