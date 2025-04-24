import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import PublicJobApplicationPage from '../client/src/pages/JobApplicationsPage';
import path from "path";
// API base URL for Django backend
const API_BASE_URL = "http://localhost:8000/api";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes - all prefixed with /api
  const apiRouter = express.Router();
  
  // Authentication routes
  apiRouter.post("/token/", async (req: Request, res: Response) => {
    try {
      const response = await axios.post("/token/", req.body);
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  apiRouter.post("/token/refresh/", async (req: Request, res: Response) => {
    try {
      const response = await axios.post("/token/refresh/", req.body);
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // User routes
  apiRouter.get("/users/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/users/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  apiRouter.get("/users/me/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/users/me/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.get(`/users/${id}/`, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/users/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.post("/users/", req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Leave routes
  apiRouter.get("/leaves/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/leaves/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.get("/leaves/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.get(`/leaves/${id}/`, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/leaves/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.post("/leaves/", req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.patch("/leaves/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.patch(`/leaves/${id}/`, req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/leaves/:id/approve_leave/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/leaves/${id}/approve_leave/`, {}, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/leaves/:id/reject_leave/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/leaves/${id}/reject_leave/`, {}, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Mission routes
  apiRouter.get("/missions/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/missions/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.get("/missions/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.get(`/missions/${id}/`, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/missions/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.post("/missions/", req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.patch("/missions/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.patch(`/missions/${id}/`, req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/missions/:id/complete_mission/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/missions/${id}/complete_mission/`, {}, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Work Hours routes
  apiRouter.get("/work-hours/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/work-hours/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/work-hours/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.post("/work-hours/", req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Internship routes
  apiRouter.get("/internships/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/internships/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.get("/internships/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.get(`/internships/${id}/`, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/internships/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.post("/internships/", req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.patch("/internships/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.patch(`/internships/${id}/`, req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/internships/:id/change_status/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/internships/${id}/change_status/`, req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Job Application routes
  apiRouter.get("/job-applications/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const response = await axios.get("/job-applications/", {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.get("/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.get(`/job-applications/${id}/`, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/job-applications/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      
      // For FormData handling, we need to pass the raw form data from the client directly
      const formData = req.body;
      
      // This route should work both with and without authentication
      // When someone applies via the public form, we don't require auth
      const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data'
      };
      
      // If there's authentication header, include it
      if (authHeader) {
        headers.Authorization = authHeader;
      }
      
      // Create a new form data object and append all fields
      const response = await axios.post("/job-applications/", formData, { headers });
      
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  });

  apiRouter.patch("/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.patch(`/job-applications/${id}/`, req.body, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/job-applications/:id/approve/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/job-applications/${id}/approve/`, {}, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  apiRouter.post("/job-applications/:id/reject/", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const { id } = req.params;
      const response = await axios.post(`/job-applications/${id}/reject/`, {}, {
        headers: { Authorization: authHeader }
      });
      res.json(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Mount all API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
