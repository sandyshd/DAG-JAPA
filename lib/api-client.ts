// Utility function to fetch users
export async function getUsers() {
  try {
    const res = await fetch('/api/users', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

// Utility function to fetch applications
export async function getApplications(userId?: string) {
  try {
    const url = userId ? `/api/applications?userId=${userId}` : '/api/applications';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    return null;
  }
}

// Utility function to fetch modules
export async function getModules() {
  try {
    const res = await fetch('/api/modules', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch modules');
    return res.json();
  } catch (error) {
    console.error('Error fetching modules:', error);
    return null;
  }
}

// Utility function to submit application
export async function submitApplication(data: any) {
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit application');
    return res.json();
  } catch (error) {
    console.error('Error submitting application:', error);
    return null;
  }
}
