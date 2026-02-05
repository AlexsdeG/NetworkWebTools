import { useQuery } from '@tanstack/react-query';
import { toolsApi, IpResponse } from '../api/tools';

export const useIpInfo = () => {
  return useQuery<IpResponse, Error>({
    queryKey: ['ipInfo'],
    queryFn: async () => {
      return await toolsApi.getIpInfo();
    },
  });
};