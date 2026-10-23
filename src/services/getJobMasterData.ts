import { GET_JOB_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';

/** Request job dropdown options from the server's shared Next.js Data Cache. */
export async function getJobMasterData() {
  const response = await fetch(`/api/proxy${GET_JOB_ENDPOINT}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to load job dropdown options.');

  const result = await response.json();
  return result?.code === CONSTANTS.STATUS_SUCCESS && result.data ? result : null;
}
