import { v } from "convex/values";

// keep in sync with convex/models/articleMetadataManager.ts
export const topicNameList = [
    "homepage",
    "conservation",
    "sanctuary",
    "advocacy",
    "education",
    "herd_management",
    "population_management",
    "roundups",
    "horse_slaughter",
    "spirit",
    "about",
] as const;
export const convexTopicEnum = v.union(
    ...topicNameList.map(topic => v.literal(topic))
);
export type TopicNameType = (typeof topicNameList)[number];

export const topicNameToAttributeName = (topic: TopicNameType) => (`topic_${topic}` as const);
export const attributeNameToTopicName = (attribute: TopicAttributeType) => {
    return attribute.replace("topic_", "") as TopicNameType;
}
export const topicAttributeList = topicNameList.map(topicNameToAttributeName)
export type TopicAttributeType = (typeof topicAttributeList)[number];