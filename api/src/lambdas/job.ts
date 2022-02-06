import { APIGatewayProxyResult } from 'aws-lambda';
import { findJob, getJobs } from '../jobs/Job';

const runJob = async (name: string): Promise<APIGatewayProxyResult> => {
    const success = (payload: Record<string, any> = { success: true }) => {
        return {
            statusCode: 200,
            body: JSON.stringify(payload),
        };
    };
    const failure = (payload: Record<string, any> = { success: false }) => {
        return {
            statusCode: 500,
            body: JSON.stringify(payload),
        };
    };

    const jobs = getJobs();
    const job = findJob(jobs, name);
    if (job !== undefined) {
        try {
            const result = job.job();
            if (result instanceof Promise) {
                await result;
            }
            return success();
        } catch (e: any) {
            return failure({ error: e.message });
        }
    } else {
        return failure({ error: 'Job not found' });
    }
};

export const lambdaHandler = async (event: { job_name: string }): Promise<APIGatewayProxyResult> =>
    runJob(event.job_name);
