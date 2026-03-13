/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as analytics from "../analytics.js";
import type * as appointments from "../appointments.js";
import type * as cases from "../cases.js";
import type * as communications from "../communications.js";
import type * as crons from "../crons.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as jobs from "../jobs.js";
import type * as leads from "../leads.js";
import type * as notifications from "../notifications.js";
import type * as portal from "../portal.js";
import type * as reminders from "../reminders.js";
import type * as seed from "../seed.js";
import type * as seedEnhanced from "../seedEnhanced.js";
import type * as simulateWorkflow from "../simulateWorkflow.js";
import type * as statusUpdates from "../statusUpdates.js";
import type * as twilio from "../twilio.js";
import type * as users from "../users.js";
import type * as verifyMigration from "../verifyMigration.js";
import type * as verifyWorkflows from "../verifyWorkflows.js";
import type * as workflows from "../workflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  analytics: typeof analytics;
  appointments: typeof appointments;
  cases: typeof cases;
  communications: typeof communications;
  crons: typeof crons;
  documents: typeof documents;
  http: typeof http;
  jobs: typeof jobs;
  leads: typeof leads;
  notifications: typeof notifications;
  portal: typeof portal;
  reminders: typeof reminders;
  seed: typeof seed;
  seedEnhanced: typeof seedEnhanced;
  simulateWorkflow: typeof simulateWorkflow;
  statusUpdates: typeof statusUpdates;
  twilio: typeof twilio;
  users: typeof users;
  verifyMigration: typeof verifyMigration;
  verifyWorkflows: typeof verifyWorkflows;
  workflows: typeof workflows;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
