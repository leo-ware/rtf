/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as advisoryBoards from "../advisoryBoards.js";
import type * as animals from "../animals.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as contactMessages from "../contactMessages.js";
import type * as donations from "../donations.js";
import type * as events from "../events.js";
import type * as externalArticles from "../externalArticles.js";
import type * as herds from "../herds.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as newsletter from "../newsletter.js";
import type * as pages from "../pages.js";
import type * as people from "../people.js";
import type * as programGroups from "../programGroups.js";
import type * as programs from "../programs.js";
import type * as userManagement from "../userManagement.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as video from "../video.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  advisoryBoards: typeof advisoryBoards;
  animals: typeof animals;
  articles: typeof articles;
  auth: typeof auth;
  contactMessages: typeof contactMessages;
  donations: typeof donations;
  events: typeof events;
  externalArticles: typeof externalArticles;
  herds: typeof herds;
  http: typeof http;
  images: typeof images;
  newsletter: typeof newsletter;
  pages: typeof pages;
  people: typeof people;
  programGroups: typeof programGroups;
  programs: typeof programs;
  userManagement: typeof userManagement;
  users: typeof users;
  utils: typeof utils;
  video: typeof video;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
