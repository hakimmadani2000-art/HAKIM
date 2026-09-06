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

    const { studentName, studentEmail, studentId, fileName, fileData, fileSize, course, university, college } = body;

    if (!fileName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required field: fileName' }) };
    }

    const { data, error } = await supabase.from('student_submissions').insert({
      student_name: studentName || 'Student',
      student_email: studentEmail || '',
      student_id: studentId || '',
      file_name: fileName,
      file_data: fileData || null,
      file_size: fileSize || '',
      course: course || 'Current Course',
      status: 'Submitted',
      university: university || 'dongola',
      college: college || 'medical'
    }).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save submission', details: error.message })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Assignment submitted successfully',
        submission: data?.[0] || null
      })
    };

  } catch (err) {
    console.error('Upload assignment error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: err.message })
    };
  }
};
