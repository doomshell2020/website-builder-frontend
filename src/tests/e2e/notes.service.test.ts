import { test, expect, request, APIRequestContext } from '@playwright/test';

let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await request.newContext({
    baseURL: 'http://localhost:3000', // Replace with your API base
  });
});

test('should create, fetch, update, and delete a note', async () => {
  // 1. Create note
  const createResponse = await apiContext.post('/admin/notes/add', {
    multipart: {
      title: 'Test Note',
      description: 'This is a test note.',
      user_id: '1',
      rating: '5',
      comment: 'Great note!',
      // Add file if needed: file: fs.createReadStream(...)
    },
  });
  const created = await createResponse.json();
  expect(createResponse.ok()).toBeTruthy();
  expect(created?.result?.id).toBeDefined();

  const noteId = created.result.id;

  // 2. Fetch by ID
  const getResponse = await apiContext.get(`/admin/notes/details/${noteId}`);
  const fetched = await getResponse.json();
  expect(getResponse.ok()).toBeTruthy();
  expect(fetched.result.title).toBe('Test Note');

  // 3. Update note
  const updateResponse = await apiContext.put(`/admin/notes/update/${noteId}`, {
    data: {
      rating: 4,
      comment: 'Updated comment',
      user_id: '1',
    },
  });
  const updated = await updateResponse.json();
  expect(updateResponse.ok()).toBeTruthy();
  expect(updated.status).toBe(true);

  // 4. Change status
  const statusResponse = await apiContext.put(`/admin/notes/status/${noteId}`, {
    data: {
      status: 'inactive',
    },
  });
  const statusUpdated = await statusResponse.json();
  expect(statusResponse.ok()).toBeTruthy();
  expect(statusUpdated.status).toBe('inactive');

  // 5. Delete note
  const deleteResponse = await apiContext.delete(`/admin/notes/delete/${noteId}`);
  expect(deleteResponse.ok()).toBeTruthy();
});

test('should return paginated notes list', async () => {
  const response = await apiContext.get('/admin/notes/viewAll?page=1&limit=5');
  const data = await response.json();

  expect(response.ok()).toBeTruthy();
  expect(Array.isArray(data.result.rows)).toBe(true);
  expect(data.result.rows.length).toBeLessThanOrEqual(5);
});
