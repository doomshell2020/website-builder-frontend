import { test, expect, request } from '@playwright/test';

const baseURL = 'http://localhost:3010'; // Replace with your actual base URL

test.describe('User API Endpoints', () => {
  let apiContext: any;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL,
    });
  });

  test('GET /admin/user/viewAll - should return paginated users', async () => {
    const response = await apiContext.get('/admin/user/viewAll?page=1&limit=5');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe(true);
    expect(data.result?.data).toBeInstanceOf(Array);
  });

  test('POST /admin/user/add - should create a user', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', `test${Date.now()}@example.com`);
    formData.append('password', 'Test1234');
    formData.append('mobile', '1234567890');
    formData.append('status', 'Y');
    formData.append('role', '2');

    const response = await apiContext.post('/admin/user/add', {
      multipart: true,
      form: formData as any,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe(true);
    expect(data.message).toMatch(/User (created|added)/i);
  });

  test('PUT /admin/user/update/:id - should update a user', async () => {
    // Assume user with ID 1 exists
    const formData = new FormData();
    formData.append('name', 'Updated User');
    formData.append('email', `updated${Date.now()}@example.com`);
    formData.append('mobile', '9999999999');

    const response = await apiContext.put('/admin/user/update/1', {
      multipart: true,
      form: formData as any,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe(true);
  });

  test('DELETE /admin/user/delete/:id - should delete a user', async () => {
    const response = await apiContext.delete('/admin/user/delete/1');
    expect([200, 204]).toContain(response.status());
  });

//   test('GET /admin/user/search - should return filtered users', async () => {
//     const response = await apiContext.get('/admin/user/search?page=1&limit=5&searchQuery=test');
//     expect(response.ok()).toBeTruthy();
//     const data = await response.json();
//     expect(data.status).toBe(true);
//     expect(Array.isArray(data.result?.data)).toBe(true);
//   });
});
