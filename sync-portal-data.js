const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://upmleglakjvykwflzsqf.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const body = JSON.parse(event.body || '{}');
    const { action, dataType, payload } = body;

    if (!action || !dataType || !payload) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: action, dataType, payload' }) };
    }

    let result;

    switch (dataType) {
      case 'student_results': {
        if (action === 'upsert') {
          result = await supabase.from('student_results').upsert({
            student_id: payload.student_id || payload.id,
            student_name: payload.student_name || payload.name,
            college: payload.college,
            subject: payload.subject,
            score: payload.score,
            grade: payload.grade,
            status: payload.status,
            note: payload.note || ''
          }).select();
        } else if (action === 'delete') {
          result = await supabase.from('student_results').delete().eq('id', payload.dbId);
        }
        break;
      }

      case 'uploaded_lectures': {
        if (action === 'upsert') {
          result = await supabase.from('uploaded_lectures').upsert({
            lecture_id: payload.id,
            title: payload.title,
            college: payload.college,
            category: payload.category,
            instructor: payload.instructor || '',
            file_name: payload.fileName || null,
            file_size: payload.fileSize || null,
            file_data: payload.fileData || null,
            upload_date: payload.date || new Date().toISOString(),
            university: payload.university || 'dongola'
          }).select();
        } else if (action === 'delete') {
          result = await supabase.from('uploaded_lectures').delete().eq('lecture_id', payload.id);
        }
        break;
      }

      case 'exam_schedule': {
        if (action === 'upsert') {
          result = await supabase.from('exam_schedule').upsert({
            schedule_id: payload.id,
            title: payload.title,
            type: payload.type,
            status: payload.status,
            exam_date: payload.date || null,
            exam_time: payload.time || null,
            venue: payload.venue || '',
            weight: payload.weight || '',
            exam_limit: payload.limit || '',
            university: payload.university || 'dongola'
          }).select();
        } else if (action === 'delete') {
          result = await supabase.from('exam_schedule').delete().eq('schedule_id', payload.id);
        }
        break;
      }

      case 'student_submissions': {
        if (action === 'insert') {
          result = await supabase.from('student_submissions').insert({
            student_name: payload.studentName || 'Student',
            student_email: payload.studentEmail || '',
            file_name: payload.fileName,
            file_data: payload.fileData || null,
            file_size: payload.fileSize || '',
            course: payload.course || 'Current Course',
            status: 'Submitted',
            university: payload.university || 'dongola',
            college: payload.college || 'medical'
          }).select();
        }
        break;
      }

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: `Unknown dataType: ${dataType}` }) };
    }

    if (result && result.error) {
      console.error('Supabase error:', result.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database operation failed', details: result.error.message })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Successfully synced ${dataType} (${action})`,
        data: result?.data || null
      })
    };

  } catch (err) {
    console.error('Sync function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: err.message })
    };
  }
};
