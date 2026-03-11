
export const roles = [
    "director",
    "staff",
    "equine",
    "storyteller",
    "ambassador",
    "photographer",
    "inMemoriam",
] as const

export type RoleType = (typeof roles)[number]

export const roleTypeToMembershipField = (roleType: RoleType) => {
    switch (roleType) {
        case "director":
            return "isDirector"
        case "staff":
            return "isStaff"
        case "equine":
            return "isEquine"
        case "storyteller":
            return "isStoryTeller"
        case "ambassador":
            return "isAmbassador"
        case "photographer":
            return "isPhotographer"
        case "inMemoriam":
            return "inMemoriam"
    }
}

export const roleTypeToLabel = (roleType: RoleType) => {
    switch (roleType) {
        case "director":
            return "Director"
        case "staff":
            return "Staff"
        case "equine":
            return "Equine"
        case "storyteller":
            return "Storyteller"
        case "ambassador":
            return "Ambassador"
        case "photographer":
            return "Photographer"
        case "inMemoriam":
            return "In Memoriam"
    }
}
