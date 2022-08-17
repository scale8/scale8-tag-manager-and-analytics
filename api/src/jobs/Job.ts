import { setupChecks } from './SetupChecks';
import { testJob } from './TestJob';
import { stripeSetup } from './StripeSetup';
import { trackingSchemaUpdate } from './TrackingSchemaUpdate';
import { trialStatusEmail } from './TrialStatusEmail';
import { stripeSync } from './StripeSync';
import { serviceTermination } from './ServiceTermination';

export interface Job {
    name: string;
    job: () => void | Promise<void>;
}

export const getJobs = () => [
    setupChecks,
    testJob,
    stripeSetup,
    stripeSync,
    trackingSchemaUpdate,
    trialStatusEmail,
    serviceTermination,
];

export const findJob = (jobs: Job[], name: string): Job | undefined =>
    jobs.find((_) => _.name === name);
