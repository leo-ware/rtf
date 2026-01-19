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
import type * as aggregates from "../aggregates.js";
import type * as animals from "../animals.js";
import type * as articleMetadata from "../articleMetadata.js";
import type * as articles from "../articles.js";
import type * as clerkClient from "../clerkClient.js";
import type * as contactMessages from "../contactMessages.js";
import type * as discountCodes from "../discountCodes.js";
import type * as documents from "../documents.js";
import type * as donationForms from "../donationForms.js";
import type * as education from "../education.js";
import type * as educationArticleGroups from "../educationArticleGroups.js";
import type * as educationArticleSuperGroups from "../educationArticleSuperGroups.js";
import type * as educationArticles from "../educationArticles.js";
import type * as email from "../email.js";
import type * as events from "../events.js";
import type * as externalArticles from "../externalArticles.js";
import type * as herds from "../herds.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as jobListing from "../jobListing.js";
import type * as locations from "../locations.js";
import type * as models_articleManager from "../models/articleManager.js";
import type * as models_articleMetadataManager from "../models/articleMetadataManager.js";
import type * as models_articleSearchManager from "../models/articleSearchManager.js";
import type * as models_donationFormManager from "../models/donationFormManager.js";
import type * as models_eventManager from "../models/eventManager.js";
import type * as models_externalArticleManager from "../models/externalArticleManager.js";
import type * as models_imageManager from "../models/imageManager.js";
import type * as models_locationManager from "../models/locationManager.js";
import type * as models_programManager from "../models/programManager.js";
import type * as models_resend from "../models/resend.js";
import type * as models_rsvpManager from "../models/rsvpManager.js";
import type * as newsletter from "../newsletter.js";
import type * as people from "../people.js";
import type * as programGroups from "../programGroups.js";
import type * as programs from "../programs.js";
import type * as rsvp from "../rsvp.js";
import type * as socialLinks from "../socialLinks.js";
import type * as sponsors from "../sponsors.js";
import type * as takeActionArticle from "../takeActionArticle.js";
import type * as ticketPrices from "../ticketPrices.js";
import type * as timelineItems from "../timelineItems.js";
import type * as types from "../types.js";
import type * as userInvites from "../userInvites.js";
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
  aggregates: typeof aggregates;
  animals: typeof animals;
  articleMetadata: typeof articleMetadata;
  articles: typeof articles;
  clerkClient: typeof clerkClient;
  contactMessages: typeof contactMessages;
  discountCodes: typeof discountCodes;
  documents: typeof documents;
  donationForms: typeof donationForms;
  education: typeof education;
  educationArticleGroups: typeof educationArticleGroups;
  educationArticleSuperGroups: typeof educationArticleSuperGroups;
  educationArticles: typeof educationArticles;
  email: typeof email;
  events: typeof events;
  externalArticles: typeof externalArticles;
  herds: typeof herds;
  http: typeof http;
  images: typeof images;
  jobListing: typeof jobListing;
  locations: typeof locations;
  "models/articleManager": typeof models_articleManager;
  "models/articleMetadataManager": typeof models_articleMetadataManager;
  "models/articleSearchManager": typeof models_articleSearchManager;
  "models/donationFormManager": typeof models_donationFormManager;
  "models/eventManager": typeof models_eventManager;
  "models/externalArticleManager": typeof models_externalArticleManager;
  "models/imageManager": typeof models_imageManager;
  "models/locationManager": typeof models_locationManager;
  "models/programManager": typeof models_programManager;
  "models/resend": typeof models_resend;
  "models/rsvpManager": typeof models_rsvpManager;
  newsletter: typeof newsletter;
  people: typeof people;
  programGroups: typeof programGroups;
  programs: typeof programs;
  rsvp: typeof rsvp;
  socialLinks: typeof socialLinks;
  sponsors: typeof sponsors;
  takeActionArticle: typeof takeActionArticle;
  ticketPrices: typeof ticketPrices;
  timelineItems: typeof timelineItems;
  types: typeof types;
  userInvites: typeof userInvites;
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

export declare const components: {
  aggregate: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
};
