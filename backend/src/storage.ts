import { 
  users, 
  tasks, 
  roleRequests, 
  notifications,
  type User, 
  type InsertUser, 
  type Task, 
  type InsertTask,
  type RoleRequest,
  type InsertRoleRequest,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: string): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getUserTasks(userId: number): Promise<Task[]>;
  getTeamTasks(managerId: number): Promise<Task[]>;
  getAllTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Role request methods
  getRoleRequest(id: number): Promise<RoleRequest | undefined>;
  getUserRoleRequests(userId: number): Promise<RoleRequest[]>;
  getAllRoleRequests(): Promise<RoleRequest[]>;
  getPendingRoleRequests(): Promise<RoleRequest[]>;
  createRoleRequest(request: InsertRoleRequest): Promise<RoleRequest>;
  updateRoleRequest(id: number, updates: Partial<RoleRequest>): Promise<RoleRequest>;

  // Notification methods
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;

  // Stats methods
  getStats(): Promise<{
    totalUsers: number;
    pendingRequests: number;
    activeTasks: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedToId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTeamTasks(managerId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.createdById, managerId))
      .orderBy(desc(tasks.createdAt));
  }

  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({
        ...task,
        updatedAt: new Date(),
      })
      .returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Role request methods
  async getRoleRequest(id: number): Promise<RoleRequest | undefined> {
    const [request] = await db.select().from(roleRequests).where(eq(roleRequests.id, id));
    return request || undefined;
  }

  async getUserRoleRequests(userId: number): Promise<RoleRequest[]> {
    return await db
      .select()
      .from(roleRequests)
      .where(eq(roleRequests.userId, userId))
      .orderBy(desc(roleRequests.createdAt));
  }

  async getAllRoleRequests(): Promise<RoleRequest[]> {
    return await db.select().from(roleRequests).orderBy(desc(roleRequests.createdAt));
  }

  async getPendingRoleRequests(): Promise<RoleRequest[]> {
    return await db
      .select()
      .from(roleRequests)
      .where(eq(roleRequests.status, "PENDING"))
      .orderBy(desc(roleRequests.createdAt));
  }

  async createRoleRequest(request: InsertRoleRequest): Promise<RoleRequest> {
    const [newRequest] = await db
      .insert(roleRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateRoleRequest(id: number, updates: Partial<RoleRequest>): Promise<RoleRequest> {
    const [request] = await db
      .update(roleRequests)
      .set(updates)
      .where(eq(roleRequests.id, id))
      .returning();
    return request;
  }

  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  // Stats methods
  async getStats(): Promise<{
    totalUsers: number;
    pendingRequests: number;
    activeTasks: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [requestCount] = await db
      .select({ count: count() })
      .from(roleRequests)
      .where(eq(roleRequests.status, "PENDING"));
    const [taskCount] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.status, "TODO"),
        eq(tasks.status, "IN_PROGRESS")
      ));

    return {
      totalUsers: userCount.count,
      pendingRequests: requestCount.count,
      activeTasks: taskCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
