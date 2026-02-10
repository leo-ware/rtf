import { redirect } from "next/navigation"

export const metadata = {
    title: "Wild Horses & Burros - Return to Freedom"
}

export default function HorsesPage() {
  redirect("/horses/our-horses")
}
