import dotenv from 'dotenv';
import container from './container/IOC.config';
import BaseLogger from './backends/logging/abstractions/BaseLogger';
import TYPES from './container/IOC.types';
import Shell from './mongo/database/Shell';
import GenericError from './errors/GenericError';
import { LogPriority } from './enums/LogPriority';
import { findJob, getJobs, Job } from './jobs/Job';

//register .env as soon as possible...
dotenv.config();

const exit = async (success: boolean) => {
    //kill connections...
    const mongo = container.get<Shell>(TYPES.Shell);
    await mongo.disconnect();
    process.exit(success ? 0 : 1);
};

const runJobArg = process.argv.find((value) => value.startsWith('--run-job='));

if (runJobArg !== undefined) {
    const jobName = runJobArg.split('=')[1].trim();
    const jobs = getJobs();
    const job = findJob(jobs, jobName);
    if (job !== undefined) {
        const logger = container.get<BaseLogger>(TYPES.BackendLogger);

        const handleError = (e: string | Error) => {
            console.error(e);
            const msg = typeof e === 'string' ? e : e.message;
            const previous = typeof e === 'string' ? undefined : e;
            logger
                .logError(
                    new GenericError(
                        `Job ${job.name} has failed to execute: ${msg}`,
                        LogPriority.ERROR,
                        undefined,
                        previous,
                    ),
                )
                .then();
            exit(false).then();
        };

        const runJob = (job: Job) => {
            return (async () => {
                const handleSuccess = () => {
                    logger.info(`Job ${job.name} has completed`).then();
                };
                try {
                    const res = job.job();
                    if (res instanceof Promise) {
                        await res;
                        handleSuccess();
                    } else {
                        handleSuccess();
                    }
                    await exit(true);
                } catch (e: any) {
                    handleError(e);
                }
            })();
        };
        (async () => {
            try {
                await runJob(job);
            } catch (e: any) {
                handleError(e);
            }
        })();
    } else {
        console.error(`Job '${jobName}' not found. Valid jobs: -`);
        jobs.forEach((_) => console.log(`   -> ${_.name}`));
        exit(false).then();
    }
} else {
    console.error('Expecting --run-job=JobName to be provided.');
    exit(false).then();
}
