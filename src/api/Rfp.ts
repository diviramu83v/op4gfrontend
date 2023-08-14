import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

const postCreateBid = async (formData: FormData): Promise<HttpResponseCreateBid> => {
  // for (const [key, value] of formData.entries()) {
  //   console.log(`Key: ${key}, Value: ${value}`);
  // }
  try {
    const response: AxiosResponse<HttpResponseCreateBid> = await instance.post(
      `${domain}/rfp/bid_details`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    console.log(response.data.options);
    return response.data;
  } catch (error: any) {
    console.log('Error' + error.response.data);
    throw error;
  }
};

const putCreateBid = async (data: any): Promise<HttpResponseCreateBid> => {
  // for (const [key, value] of formData.entries()) {
  //   console.log(`Key: ${key}, Value: ${value}`);
  // }
  try {
    const response: AxiosResponse<HttpResponseCreateBid> = await instance.put(
      `${domain}/rfp/bid_details/${data.rfpId}`,
      data.formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    console.log(response.data.options.message);
    return response.data;
  } catch (error: any) {
    console.log('Error' + error.response.data);
    throw error;
  }
};

const putCreateCountry = async (data: any): Promise<HttpResponseCreateBid> => {
  console.dir(data);
  try {
    const response: AxiosResponse<HttpResponseCreateBid> = await instance.put(
      `${domain}/rfp/targetings/${data.rfpId}`,
      data.data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data.options.message);
    return response.data;
  } catch (error: any) {
    console.log('Error' + error.response.data);
    throw error;
  }
};

const postAPITargetingCriteria = async (data: any) => {
  try {
    const response: AxiosResponse<HttpResponseCreateTarget> = await instance.post(
      `${domain}/rfp/targetings`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data.options.message);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to post data');
  }
};

const putSubmitBid = async (rfpId: number) => {
  const response: AxiosResponse<HttpResponseSubmit> = await instance.put(
    `${domain}/rfp/bids_requests/${rfpId}`
  );
  console.log(response.data.options.message);
  return response.data;
};

const fetchAPILandingInternal = async (
  pageNumber: number,
  vendorID?: number
): Promise<HttpResponseLandingPageInternal> => {
  const url = `${domain}/rfp?page=${pageNumber}${
    vendorID !== 0 ? `&vendor=${vendorID}` : ''
  }`;
  const response: AxiosResponse<HttpResponseLandingPageInternal> = await instance.get(
    url
  );
  return response.data;
};

const fetchAPILandingExternal = async (
  vendorID: number,
  pageNumber: number
): Promise<HttpResponseLandingPageExternal> => {
  const response: AxiosResponse<HttpResponseLandingPageExternal> = await instance.get(
    `${domain}/rfp/bids_requests/${vendorID}?page=${pageNumber}`
  );
  return response.data;
};

const fetchAPIResult = async (rfpid: number): Promise<HttpResponseResult> => {
  const response: AxiosResponse<HttpResponseResult> = await instance.get(
    `${domain}/rfp/${rfpid}/result/`
  );
  return response.data;
};

const putTotalResult = async (data: any): Promise<HttpResponseCreateBid> => {
  try {
    const response: AxiosResponse<HttpResponseCreateBid> = await instance.put(
      `${domain}/rfp/${data.rfpid}/result/`,
      {...data.payload},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data.options.message);
    return response.data;
  } catch (error: any) {
    console.log('Error' + error.response.data);
    throw error;
  }
};


export {
  fetchAPILandingExternal,
  fetchAPILandingInternal,
  fetchAPIResult,
  postAPITargetingCriteria,
  postCreateBid,
  putCreateBid,
  putCreateCountry,
  putSubmitBid,
  putTotalResult
};

interface HttpResponseLandingPageInternal {
  code: number;
  success: string;
  payload: PayloadInternal;
  options?: any;
}

interface PayloadInternal {
  items: LandingPageInternalItem[];
  total: number;
  perpage: number;
}

interface LandingPageInternalItem {
  wo: number;
  clientName: string;
  projectName: string;
  vendorsInvited: number;
  vendorsResponded: number;
  assignedTo: string;
  bidDueDate: string;
}

interface HttpResponseLandingPageExternal {
  code: number;
  success: string;
  payload: PayloadExternal;
  options?: any;
}

interface PayloadExternal {
  items: Item;
  total: number;
  per_page: number;
}

interface Item {
  id: number;
  name: string;
  rfpList: LandingPageExternalItem[];
}

interface LandingPageExternalItem {
  rfpId: number;
  wo: number;
  projectName: string;
  totalNSize: number;
  bidDueDate: string;
}

interface HttpResponseCreateTarget {
  code: number;
  success: boolean;
  payload: {
    rfpId: number;
  };
  options?: any;
}

interface HttpResponseSubmit {
  code: number;
  success: boolean;
  payload: any;
  options?: any;
}

interface HttpResponseCreateBid {
  code: number;
  success: boolean;
  payload: ITargetingCriteria;
  options?: any;
}

interface ITargetResponse {
  id: number;
  name: string;
}

interface IRfpCountriesResponse {
  id: number;
  countryName: string;
  targets: ITargetResponse[];
}

interface ITargetingCriteria {
  rfpId: number;
  rfpCountries: IRfpCountriesResponse[];
}

interface HttpResponseResult {
  code: number;
  success: boolean;
  payload: result;
  options?: any;
}

interface Target {
  id: number;
  name: string;
  fields: [];
}

interface rfpCountries {
  id: number;
  countryName: string;
  targets: Target[];
}

interface result {
  id: number;
  wo: number;
  projectName: string;
  bidDueDate: string;
  rfpCountries: rfpCountries[];
}
