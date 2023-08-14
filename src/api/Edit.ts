import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

const fetchAPIBidResponse = async (rfpId: number): Promise<HttpBidResponse | null> => {
  if (rfpId === undefined) {
    return null;
  }
  const response: AxiosResponse<HttpBidResponse> = await instance.get(
    `${domain}/rfp/${rfpId}`
  );
  return response.data;
};

const fetchAPICountryResponse = async (data: any): Promise<HttpBidResponse | null> => {
  if (data.rfpId === undefined || data.countryId === undefined) {
    return null;
  }
  const response: AxiosResponse<HttpBidResponse> = await instance.get(
    `${domain}/rfp/${data.rfpId}/countries/${data.countryId}`
  );
  return response.data;
};

export { fetchAPIBidResponse, fetchAPICountryResponse };

interface Country {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  nonprofit_flag: boolean;
  slug: string;
}

interface AttachmentFile {
  blob_id: number;
  source: string;
}

interface RfpCountry {
  id: number;
  tblRFP_id: number;
  country_id: number;
  targetCount: number;
  country: Country;
}

interface Project {
  id: number;
  name: string;
}

interface Payload {
  id: number;
  project_id: number;
  total_n_size: number;
  no_of_countries: number;
  no_of_open_ends: number;
  pi: boolean;
  tracker: boolean;
  qualfollowup: boolean;
  additional_details: string;
  assigned_to_id: number;
  bid_due_date: string;
  status: string;
  attachmentFile: AttachmentFile;
  rfp_countries: RfpCountry[];
  project: Project;
}

interface HttpBidResponse {
  success: boolean;
  code: number;
  payload: Payload;
  options?: object; // You can define a more specific type if needed
}

interface VendorOverview {
  id: number;
  name: string;
}

interface RfpTargetQualification {
  id: number;
  tblRFP_id: number;
  target_id: number;
  field_name: string;
  field_value: string;
}

interface RfpTarget {
  id: number;
  tblRFP_id: number;
  country_id: number;
  name: string;
  ir: number | null;
  loi: number | null;
  nsize: number | null;
  quotas: number;
  vendors_overview: VendorOverview[];
  target_type: {
    id: number;
    name: string;
    description: string;
  };
  rfp_target_qualifications: RfpTargetQualification[];
}

interface Payload {
  id: number;
  tblRFP_id: number;
  country_id: number;
  rfp_targets: RfpTarget[];
}

interface HttpCoutryResponse {
  success: boolean;
  code: number;
  payload: Payload;
  options: object;
}
