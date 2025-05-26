import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { 
  loginSchema, 
  registerSchema, 
  insertTaskSchema,
  insertRoleRequestSchema,
  type User 
} from "@shared/schema";

// Simple session management
interface Session {
  userId: number;
  user: User;
}

const sessions = new Map<string, Session>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getSession(req: any): Session | null {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  return sessionId ? sessions.get(sessionId) || null : null;
}

function requireAuth(req: any, res: any, next: any) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: "Authentication required" });
  }
  req.user = session.user;
  next();
}

function requireRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin user if none exists
  app.post("/api/init", async (req, res) => {
    try {
      const adminExists = await storage.getAllUsers().then(users => 
        users.some(user => user.role === "ADMIN")
      );
      
      if (adminExists) {
        return res.status(400).json({ error: "Admin user already exists" });
      }

      const { username, email, password } = registerSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: "ADMIN",
      });

      res.json({ message: "Admin user created successfully", user: { ...admin, password: undefined } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: "USER",
      });

      res.json({ message: "User registered successfully", user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const sessionId = generateSessionId();
      sessions.set(sessionId, { userId: user.id, user });

      res.json({ 
        token: sessionId, 
        user: { ...user, password: undefined } 
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: { ...req.user, password: undefined } });
  });

  // User routes
  app.get("/api/users", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Task routes
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      let tasks;
      if (req.user.role === "ADMIN") {
        tasks = await storage.getAllTasks();
      } else if (req.user.role === "MANAGER") {
        const userTasks = await storage.getUserTasks(req.user.id);
        const teamTasks = await storage.getTeamTasks(req.user.id);
        tasks = [...userTasks, ...teamTasks];
      } else {
        tasks = await storage.getUserTasks(req.user.id);
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/team", requireAuth, requireRole(["MANAGER", "ADMIN"]), async (req, res) => {
    try {
      const tasks = req.user.role === "ADMIN" 
        ? await storage.getAllTasks()
        : await storage.getTeamTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team tasks" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({
        ...taskData,
        createdById: req.user.id,
      });
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  app.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Check permissions
      if (req.user.role === "USER" && task.assignedToId !== req.user.id) {
        return res.status(403).json({ error: "Can only update your own tasks" });
      }

      const updates = req.body;
      const updatedTask = await storage.updateTask(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Check permissions
      if (req.user.role === "USER" && task.createdById !== req.user.id) {
        return res.status(403).json({ error: "Can only delete your own tasks" });
      }

      await storage.deleteTask(taskId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Role request routes
  app.get("/api/role-requests", requireAuth, async (req, res) => {
    try {
      let requests;
      if (req.user.role === "ADMIN") {
        requests = await storage.getAllRoleRequests();
      } else {
        requests = await storage.getUserRoleRequests(req.user.id);
      }
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch role requests" });
    }
  });

  app.get("/api/role-requests/pending", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
    try {
      const requests = await storage.getPendingRoleRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending requests" });
    }
  });

  app.post("/api/role-requests", requireAuth, async (req, res) => {
    try {
      // Check if user already has a pending request
      const existingRequests = await storage.getUserRoleRequests(req.user.id);
      const hasPendingRequest = existingRequests.some(request => request.status === "PENDING");
      
      if (hasPendingRequest) {
        return res.status(400).json({ error: "You already have a pending role request" });
      }

      const requestData = insertRoleRequestSchema.parse(req.body);
      const roleRequest = await storage.createRoleRequest({
        ...requestData,
        userId: req.user.id,
        currentRole: req.user.role,
      });

      res.json(roleRequest);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  app.put("/api/role-requests/:id/approve", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getRoleRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: "Role request not found" });
      }

      if (request.status !== "PENDING") {
        return res.status(400).json({ error: "Request has already been processed" });
      }

      // Update the role request
      const updatedRequest = await storage.updateRoleRequest(requestId, {
        status: "APPROVED",
        reviewedById: req.user.id,
        reviewedAt: new Date(),
      });

      // Update the user's role
      await storage.updateUserRole(request.userId, request.requestedRole);

      // Create notification
      await storage.createNotification({
        userId: request.userId,
        title: "Role Request Approved",
        message: `Your request for ${request.requestedRole} role has been approved.`,
        type: "SUCCESS",
      });

      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve role request" });
    }
  });

  app.put("/api/role-requests/:id/reject", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getRoleRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: "Role request not found" });
      }

      if (request.status !== "PENDING") {
        return res.status(400).json({ error: "Request has already been processed" });
      }

      const updatedRequest = await storage.updateRoleRequest(requestId, {
        status: "REJECTED",
        reviewedById: req.user.id,
        reviewedAt: new Date(),
      });

      // Create notification
      await storage.createNotification({
        userId: request.userId,
        title: "Role Request Rejected",
        message: `Your request for ${request.requestedRole} role has been rejected.`,
        type: "ERROR",
      });

      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject role request" });
    }
  });

  // Notification routes
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Stats route
  app.get("/api/stats", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
