"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Save, ArrowLeft, Loader2 } from "lucide-react";
import {
  getWhatsAppLink,
  updateWhatsAppLink,
  isValidWhatsAppLink,
} from "@/lib/whatsapp-service";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Hard-coded password
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadWhatsAppLink();
    }
  }, []);

  const loadWhatsAppLink = async () => {
    setLoading(true);
    try {
      const link = await getWhatsAppLink();
      setWhatsappLink(link);
    } catch (error) {
      console.error("Error loading WhatsApp link:", error);
      setMessage("Failed to load WhatsApp link. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      loadWhatsAppLink();
      setMessage("");
    } else {
      setMessage("Invalid password. Please try again.");
      setMessageType("error");
    }
  };

  const handleSaveWhatsAppLink = async () => {
    if (!whatsappLink.trim()) {
      setMessage("Please enter a valid WhatsApp link.");
      setMessageType("error");
      return;
    }

    // Validate WhatsApp link format using Firebase service
    if (!isValidWhatsAppLink(whatsappLink)) {
      setMessage(
        "Please enter a valid WhatsApp link (e.g., https://wa.me/1234567890)"
      );
      setMessageType("error");
      return;
    }

    setSaving(true);
    try {
      const success = await updateWhatsAppLink(whatsappLink);

      if (success) {
        setMessage(
          "WhatsApp link updated successfully! Changes are now live for all users."
        );
        setMessageType("success");
      } else {
        setMessage("Failed to update WhatsApp link. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error saving WhatsApp link:", error);
      setMessage("An error occurred while saving. Please try again.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setPassword("");
    setWhatsappLink("");
    setMessage("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Enter your password to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {message && messageType === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/")}
                className="text-sm text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Website
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Configuration</CardTitle>
              <CardDescription>
                Manage the WhatsApp contact link that appears on your website.
                Changes are saved globally and visible to all users instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-link">WhatsApp Link</Label>
                <Input
                  id="whatsapp-link"
                  type="url"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="https://wa.me/1234567890"
                  className="font-mono"
                  disabled={loading || saving}
                />
                <p className="text-sm text-gray-600">
                  Format: https://wa.me/[phone_number] (e.g.,
                  https://wa.me/1234567890)
                </p>
              </div>

              {message && (
                <Alert
                  variant={messageType === "error" ? "destructive" : "default"}
                >
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSaveWhatsAppLink}
                className="w-full sm:w-auto"
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save WhatsApp Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Active WhatsApp Link:</Label>
                <div className="p-3 bg-gray-100 rounded-md font-mono text-sm break-all">
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    whatsappLink || "No link configured"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
