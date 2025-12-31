"use client"

import { useState } from "react"
import TicketPriceEditorDialog, { TicketPriceData } from "@/app/admin/events/TicketPriceEditorDialog"
import { Button } from "@/components/ui/button"

const TicketPriceDemoPage = () => {
    const [lastResult, setLastResult] = useState<TicketPriceData | null>(null)

    const handleComplete = (ticketPrice: TicketPriceData) => {
        setLastResult(ticketPrice)
    }

    const handleReset = () => {
        setLastResult(null)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Ticket Price Editor Demo</h1>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <TicketPriceEditorDialog
                        onComplete={handleComplete}
                    >
                        <Button>
                            Create Ticket Price
                        </Button>
                    </TicketPriceEditorDialog>

                    {lastResult && (
                        <Button variant="outline" onClick={handleReset}>
                            Reset Demo
                        </Button>
                    )}
                </div>

                {lastResult && (
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Last Callback Result:</h2>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(lastResult, null, 2)}
                        </pre>
                    </div>
                )}

                {!lastResult && (
                    <p className="text-muted-foreground">
                        Click the button above to open the dialog. When you save, the result will appear here.
                    </p>
                )}
            </div>
        </div>
    )
}

export default TicketPriceDemoPage

