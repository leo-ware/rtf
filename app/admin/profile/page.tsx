"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ImageUpload } from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  User,
  Camera,
  Save,
  Mail,
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  Shield,
  Crown
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const AdminProfilePage = () => {
  const currentUser = useQuery(api.users.currentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Initialize form data when user loads
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
      setSelectedImage(currentUser.image || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      await updateProfile({
        name: formData.name,
        image: selectedImage || undefined,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 5000); // Clear error message after 5 seconds
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (imageData: { url: string }) => {
    setSelectedImage(imageData.url);
    setIsImageDialogOpen(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "AD";
  };

  const formatJoinDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "dev":
        return {
          icon: Crown,
          label: "Developer",
          description: "Full system access including user management and system configuration",
          badgeClass: "bg-purple-100 text-purple-800 border-purple-200"
        };
      case "admin":
        return {
          icon: Shield,
          label: "Administrator",
          description: "Administrative access to content management and user oversight",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "authorized":
        return {
          icon: User,
          label: "Authorized User",
          description: "Basic access to view and manage assigned content",
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200"
        };
      default:
        return {
          icon: User,
          label: "User",
          description: "Limited access permissions",
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const hasChanges =
    formData.name !== (currentUser.name || "") ||
    selectedImage !== (currentUser.image || "");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Upload a profile picture to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={selectedImage || currentUser.image || "/placeholder-avatar.jpg"}
                    alt={currentUser.name || currentUser.email || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(currentUser.name, currentUser.email)}
                  </AvatarFallback>
                </Avatar>

                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Picture
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Profile Picture</DialogTitle>
                      <DialogDescription>
                        Choose an image from your library or upload a new one
                      </DialogDescription>
                    </DialogHeader>
                    <ImageUpload
                      onImageUploaded={handleImageUpload}
                      multiple={false}
                      maxSizeInMB={5}
                    />
                  </DialogContent>
                </Dialog>

                {selectedImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage("")}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove Picture
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{currentUser.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">{formatJoinDate(currentUser._creationTime)}</span>
                </div>

                {/* Role Display */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">Role & Permissions:</span>
                  </div>
                  {(() => {
                    const roleInfo = getRoleDisplay(currentUser.role || 'authorized');
                    const RoleIcon = roleInfo.icon;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${roleInfo.badgeClass} border flex items-center space-x-1.5 px-3 py-1.5`}>
                            <RoleIcon className="h-4 w-4" />
                            <span className="font-medium">{roleInfo.label}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {roleInfo.description}
                        </p>

                        {/* Current Role Debug Info */}
                        <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                          <strong>Current Role Value:</strong> <code className="bg-gray-200 px-1 rounded">{currentUser.role || 'undefined (defaults to authorized)'}</code>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your display name"
                  />
                  <p className="text-xs text-gray-500">
                    This name will be displayed in the admin interface and on content you create.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Email address cannot be changed. Contact an administrator if you need to update this.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {saveStatus === "success" && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Profile updated successfully!</span>
                        </div>
                      )}
                      {saveStatus === "error" && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Failed to update profile. Please try again.</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving || !hasChanges}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Password</h4>
                      <p className="text-xs text-gray-500">Change your account password</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Change Password
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default AdminProfilePage;