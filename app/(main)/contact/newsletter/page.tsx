"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, Users, Heart, Calendar, Camera } from "lucide-react"
import Link from "next/link"

export default function NewsletterPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    interests: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "already_subscribed">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const subscribeToNewsletter = useMutation(api.newsletter.subscribeToNewsletter)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      if (!formData.email.trim()) {
        throw new Error("Please enter your email address")
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      await subscribeToNewsletter({
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        interests: formData.interests.length > 0 ? formData.interests : undefined,
        source: "newsletter_form"
      })

      setSubmitStatus("success")
      setFormData({
        email: "",
        name: "",
        interests: []
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes("already subscribed")) {
        setSubmitStatus("already_subscribed")
      } else {
        setSubmitStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const interestOptions = [
    { id: "rescue_updates", label: "Rescue Updates", icon: Heart, description: "Latest rescue stories and updates" },
    { id: "events", label: "Events & Tours", icon: Calendar, description: "Upcoming events and tour opportunities" },
    { id: "volunteer", label: "Volunteer Opportunities", icon: Users, description: "Ways to help and get involved" },
    { id: "photography", label: "Photo Stories", icon: Camera, description: "Beautiful photos and stories of our horses" },
  ]

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Newsletter Subscription</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with the latest news, rescue stories, and ways to help our wild horses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Form */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Our Newsletter</CardTitle>
              <CardDescription>
                Get monthly updates delivered straight to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus === "success" && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Thank you for subscribing! Please check your email to confirm your subscription.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "already_subscribed" && (
                <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    This email is already subscribed to our newsletter.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="mt-1"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mt-1"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">What interests you? (optional)</Label>
                  <p className="text-sm text-gray-600 mb-4">Select the topics you'd like to hear about most.</p>
                  <div className="space-y-4">
                    {interestOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={option.id}
                            checked={formData.interests.includes(option.id)}
                            onCheckedChange={(checked) => handleInterestChange(option.id, checked as boolean)}
                            disabled={isSubmitting}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4 text-blue-600" />
                              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to receive emails from us. You can unsubscribe at any time.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Newsletter Info */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">What You'll Receive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Rescue Stories</p>
                    <p className="text-blue-800 text-sm">Heartwarming stories of horses we've helped</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Event Announcements</p>
                    <p className="text-blue-800 text-sm">First access to tours, volunteer days, and special events</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Volunteer Opportunities</p>
                    <p className="text-blue-800 text-sm">Ways to get involved and make a difference</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Camera className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Exclusive Photos</p>
                    <p className="text-blue-800 text-sm">Beautiful images you won't see anywhere else</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">Email (HTML)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unsubscribe:</span>
                  <span className="font-medium">Anytime</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Privacy:</span>
                  <span className="font-medium">100% Protected</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Have questions about our newsletter or need assistance with your subscription?
                </p>
                <Link href="/contact/form">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}