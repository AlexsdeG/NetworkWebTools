import { useQuery } from '@tanstack/react-query';
import { toolsApi, IpInfo } from '../api/tools';

export const useIpInfo = () => {
  return useQuery<IpInfo, Error>({
    queryKey: ['ipInfo'],
    queryFn: async () => {
      return await toolsApi.getIpInfo();
    },
  });
};