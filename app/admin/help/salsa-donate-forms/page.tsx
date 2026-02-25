import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
    title: "Salsa Labs Donation Forms - Help - RTF Admin"
}

const SalsaDonateForms = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full mx-auto lg:w-2/3 py-12 px-8 prose prose-lg">
            <div className="w-full">
                <Link
                    href="/admin/help"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 no-underline mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Help
                </Link>
                <h1 className="text-2xl font-bold">Salsa Labs Donation Forms</h1>
            </div>

            <p className="w-full text-md text-left">
                This guide explains how to create and configure donation forms that integrate with
                Salsa Labs for payment processing.
            </p>

            <h2 className="text-xl font-bold w-full">Overview</h2>

            <p className="w-full text-md text-left">
                Donation forms on the RTF website use Salsa Labs to process payments securely.
                The admin dashboard allows you to configure which Salsa Labs forms appear on the
                donation page and how they are presented to visitors.
            </p>

            <h2 className="text-xl font-bold w-full">Creating a New Donation Form</h2>

            <ol className="w-full text-md text-left list-decimal list-inside space-y-2">
                <li>Navigate to <strong>Donations → Donation Forms</strong> in the admin menu</li>
                <li>Click the <strong>New Form</strong> button</li>
                <li>Enter the Salsa Labs form ID (provided by Salsa Labs)</li>
                <li>Configure the display settings (title, description, button text)</li>
                <li>Set the form as active to display it on the public site</li>
                <li>Save your changes</li>
            </ol>

            <h2 className="text-xl font-bold w-full">Finding Your Salsa Labs Form ID</h2>

            <p className="w-full text-md text-left">
                The form ID can be found in your Salsa Labs dashboard:
            </p>

            <ol className="w-full text-md text-left list-decimal list-inside space-y-2">
                <li>Log into your Salsa Labs account</li>
                <li>Navigate to <strong>Forms → Donation Forms</strong></li>
                <li>Select the form you want to embed</li>
                <li>Look for the form ID in the URL or the embed code section</li>
            </ol>

            <h2 className="text-xl font-bold w-full">Managing Donate Pathways</h2>

            <p className="w-full text-md text-left">
                Donate Pathways are the cards shown on the donation page that guide visitors
                to different giving options. To manage these:
            </p>

            <ol className="w-full text-md text-left list-decimal list-inside space-y-2">
                <li>Navigate to <strong>Donations → Donate Pathways</strong></li>
                <li>Each pathway can link to a donation form or external URL</li>
                <li>Drag to reorder pathways on the public page</li>
                <li>Toggle visibility to show/hide individual pathways</li>
            </ol>

            <h2 className="text-xl font-bold w-full">Troubleshooting</h2>

            <p className="w-full text-md text-left">
                <strong>Form not appearing on the site?</strong> Check that the form is marked as active
                and that the Salsa Labs form ID is correct.
            </p>

            <p className="w-full text-md text-left">
                <strong>Payment errors?</strong> These are typically handled by Salsa Labs. Contact
                their support if donors report payment issues.
            </p>

            <p className="w-full text-md text-left">
                <strong>Need help?</strong> Contact the site administrator or developer for assistance
                with technical issues.
            </p>
        </div>
    )
}

export default SalsaDonateForms
