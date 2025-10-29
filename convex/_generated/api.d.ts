/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as advisoryBoards from "../advisoryBoards.js";
import type * as animals from "../animals.js";
import type * as articles from "../articles.js";
import type * as contactMessages from "../contactMessages.js";
import type * as events from "../events.js";
import type * as externalArticles from "../externalArticles.js";
import type * as herds from "../herds.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as newsletter from "../newsletter.js";
import type * as old_users from "../old_users.js";
import type * as pages from "../pages.js";
import type * as people from "../people.js";
import type * as programGroups from "../programGroups.js";
import type * as programs from "../programs.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as video from "../video.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  contactMessages: typeof contactMessages;
  events: typeof events;
  externalArticles: typeof externalArticles;
  herds: typeof herds;
  http: typeof http;
  images: typeof images;
  newsletter: typeof newsletter;
  old_users: typeof old_users;
  pages: typeof pages;
  people: typeof people;
  programGroups: typeof programGroups;
  programs: typeof programs;
  users: typeof users;
  utils: typeof utils;
  video: typeof video;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
