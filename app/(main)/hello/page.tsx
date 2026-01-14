import UpcomingEventsWidget from "@/components/UpcomingEventsWidget"

const HelloPage = () => {
    return (
        <div className="w-full h-[2000px] p-8">
            <div className="resize overflow-auto border p-4">
                <UpcomingEventsWidget />
            </div>
        </div>
    )
}

export default HelloPage