"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

const DonationFormHelpDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>About Donation Forms</DialogTitle>
                    <DialogDescription>
                        Learn how to configure Salsa Labs donation forms
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-gray-600">
                    <p>
                        Donation forms allow you to embed Salsa Labs donation widgets throughout the site.
                        Each form configuration requires two IDs from Salsa Labs:
                    </p>

                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Form ID (tId)</h4>
                        <p>
                            The unique identifier for the specific donation form. This is found in the
                            widget URL as the <code className="bg-gray-100 px-1 py-0.5 rounded">tId</code> parameter.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Form Template ID</h4>
                        <p>
                            The template identifier used to render the form. This is found in the
                            widget URL path, typically after <code className="bg-gray-100 px-1 py-0.5 rounded">/api/widget/template/</code>.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Quick Tip</h4>
                        <p>
                            When creating or editing a form, you can paste the full Salsa Labs widget URL
                            into the &quot;Source URL&quot; field and both IDs will be automatically extracted.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">
                            Example URL format:<br />
                            <code className="text-xs">https://default.salsalabs.org/api/widget/template/&#123;templateId&#125;/?tId=&#123;formId&#125;</code>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DonationFormHelpDialog
