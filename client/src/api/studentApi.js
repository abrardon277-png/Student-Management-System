const BASE_URL = '/api/students';

// Fetch all students with optional filters
export async function fetchStudents(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'All') query.append(key, value);
  });
  const url = query.toString() ? `${BASE_URL}?${query}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch students');
  }
  return res.json();
}

// Fetch dashboard statistics
export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// Fetch single student by ID
export async function fetchStudent(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch student');
  }
  return res.json();
}

// Create new student
export async function createStudent(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create student');
  return json;
}

// Update student
export async function updateStudent(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update student');
  return json;
}

// Delete student
export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete student');
  return json;
}
