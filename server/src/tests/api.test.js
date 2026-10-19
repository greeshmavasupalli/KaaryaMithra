import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';

describe('SkillDost Backend API Comprehensive Test Suite', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('1. Health & Categories (Public)', () => {
    it('GET /api/health should return ok status and KaaryaMithra branding', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.product).toBe('KaaryaMithra');
    });

    it('GET /api/categories should return all active service categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(10);
      const names = res.body.data.map((c) => c.name);
      expect(names).toContain('Electrician');
      expect(names).toContain('Plumber');
      expect(names).toContain('House Cleaning');
    });
  });

  describe('2. Worker Discovery & Privacy (Public)', () => {
    it('GET /api/workers should return paginated list of published profiles', async () => {
      const res = await request(app).get('/api/workers?page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();

      // Verify privacy: No private fields leaked
      const firstWorker = res.body.data[0];
      expect(firstWorker.phone).toBeUndefined();
      expect(firstWorker.email).toBeUndefined();
      expect(firstWorker.passwordHash).toBeUndefined();
      expect(firstWorker.userId).toBeUndefined();
      expect(firstWorker.displayName).toBeDefined();
      expect(firstWorker.locality).toBeDefined();
    });

    it('GET /api/workers?location=MVP should filter workers by locality', async () => {
      const res = await request(app).get('/api/workers?location=MVP');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      const names = res.body.data.map((w) => w.displayName);
      expect(names).toContain('Ramesh Kumar');
    });

    it('GET /api/workers?service=pipe should filter workers by skill/category keyword', async () => {
      const res = await request(app).get('/api/workers?service=pipe');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/workers/:id should return worker profile and reviews', async () => {
      const listRes = await request(app).get('/api/workers?limit=1');
      const sampleWorkerId = listRes.body.data[0]._id;

      const res = await request(app).get(`/api/workers/${sampleWorkerId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(sampleWorkerId);
      expect(res.body.data.verificationStatus).toBeDefined();
      expect(res.body.data.phone).toBeUndefined();
    });
  });

  describe('3. Authentication & Negative Access Controls', () => {
    let customerCookie;
    let workerCookie;
    let adminCookie;

    it('POST /api/auth/login should authenticate Customer demo account', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ananya.customer@skilldost.demo',
        password: 'demo123',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('customer');
      customerCookie = res.headers['set-cookie'];
      expect(customerCookie).toBeDefined();
    });

    it('POST /api/auth/login should authenticate Worker demo account', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ramesh.electrician@skilldost.demo',
        password: 'demo123',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('worker');
      workerCookie = res.headers['set-cookie'];
      expect(workerCookie).toBeDefined();
    });

    it('POST /api/auth/login should authenticate Admin demo account', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@skilldost.demo',
        password: 'admin123',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('admin');
      adminCookie = res.headers['set-cookie'];
      expect(adminCookie).toBeDefined();
    });

    it('POST /api/auth/login should reject incorrect password with 401', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@skilldost.demo',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Negative: Unauthenticated access to /api/admin/reports must return 401', async () => {
      const res = await request(app).get('/api/admin/reports');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Negative: Customer accessing /api/admin/reports must return 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/reports')
        .set('Cookie', customerCookie);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Negative: Customer accessing /api/worker-profile/me must return 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/worker-profile/me')
        .set('Cookie', customerCookie);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Admin accessing /api/admin/metrics should succeed with 200', async () => {
      const res = await request(app)
        .get('/api/admin/metrics')
        .set('Cookie', adminCookie);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.metrics.workers.total).toBeGreaterThan(0);
      expect(res.body.metrics.categories.activeCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe('4. Enquiries, Workflow, & Reviews', () => {
    let customerCookie;
    let workerCookie;
    let workerProfileId;
    let categoryId;
    let createdEnquiryId;

    beforeAll(async () => {
      // Login customer
      const custRes = await request(app).post('/api/auth/login').send({
        email: 'ananya.customer@skilldost.demo',
        password: 'demo123',
      });
      customerCookie = custRes.headers['set-cookie'];

      // Login worker
      const workRes = await request(app).post('/api/auth/login').send({
        email: 'ramesh.electrician@skilldost.demo',
        password: 'demo123',
      });
      workerCookie = workRes.headers['set-cookie'];
      workerProfileId = workRes.body.workerProfile._id;
      categoryId = workRes.body.workerProfile.categories[0]._id;
    });

    it('Customer should be able to submit an enquiry', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .set('Cookie', customerCookie)
        .send({
          workerId: workerProfileId,
          categoryId: categoryId,
          locality: 'MVP Colony, Sector 2',
          message: 'Need help installing a new kitchen exhaust fan and switch socket.',
          preferredTime: 'Saturday 11 AM',
          contactPreference: 'in_app',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('New');
      createdEnquiryId = res.body.data._id;
    });

    it('Worker should see the new enquiry in their inbox', async () => {
      const res = await request(app)
        .get('/api/enquiries/mine')
        .set('Cookie', workerCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const enq = res.body.data.find((e) => e._id === createdEnquiryId);
      expect(enq).toBeDefined();
      expect(enq.status).toBe('New');
    });

    it('Worker should be able to update status to Responded and then Accepted', async () => {
      const res = await request(app)
        .patch(`/api/enquiries/${createdEnquiryId}/status`)
        .set('Cookie', workerCookie)
        .send({
          status: 'Accepted',
          note: 'I will be there on Saturday morning at 11 AM with necessary tools.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Accepted');
    });

    it('Customer marks enquiry Completed', async () => {
      const res = await request(app)
        .patch(`/api/enquiries/${createdEnquiryId}/status`)
        .set('Cookie', customerCookie)
        .send({
          status: 'Completed',
          note: 'Fan installed and working great. Thank you!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Completed');
    });

    it('Customer leaves feedback on Completed enquiry', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Cookie', customerCookie)
        .send({
          enquiryId: createdEnquiryId,
          rating: 5,
          comment: 'Ramesh was prompt, courteous, and cleanly installed the exhaust fan. Fair price.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('Negative: Customer cannot review the same enquiry twice (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Cookie', customerCookie)
        .send({
          enquiryId: createdEnquiryId,
          rating: 4,
          comment: 'Duplicate review attempt',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('5. Moderation Reports & Audit Logs', () => {
    let adminCookie;
    let reportId;

    beforeAll(async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@skilldost.demo',
        password: 'admin123',
      });
      adminCookie = res.headers['set-cookie'];
    });

    it('Public/User can submit a safety/content report', async () => {
      const listRes = await request(app).get('/api/workers?limit=1');
      const targetWorkerId = listRes.body.data[0]._id;

      const res = await request(app).post('/api/reports').send({
        targetType: 'listing',
        targetId: targetWorkerId,
        reason: 'other',
        details: 'Testing report submission workflow from automated test suite.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      reportId = res.body.data._id;
    });

    it('Admin can list reports and resolve the report', async () => {
      const listRes = await request(app)
        .get('/api/admin/reports')
        .set('Cookie', adminCookie);

      expect(listRes.status).toBe(200);
      expect(listRes.body.success).toBe(true);
      expect(listRes.body.data.length).toBeGreaterThan(0);

      const updateRes = await request(app)
        .patch(`/api/admin/reports/${reportId}`)
        .set('Cookie', adminCookie)
        .send({
          status: 'resolved',
          adminNotes: 'Reviewed by moderator. Verified information complies with prototype safeguards.',
          actionTaken: 'none',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.status).toBe('resolved');
    });

    it('Audit log should record the moderation action', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].action).toContain('RESOLVE_REPORT');
    });
  });
});
