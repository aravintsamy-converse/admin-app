import { ApiQueryParams, ApiResponse, BulkActionApi, TableData, TableMetadata } from "@/Types/Table/tableTypes";
import { api } from "@/services/api";
import { metaData } from "@/mock-data/tableMockDataForUser";
import { tableData } from "@/mock-data/tableData";

// Fetch Users API
export async function fetchTableData(url: string, params: ApiQueryParams): Promise<ApiResponse<TableData>> {
  const payloadObj: Record<string, any> = {};
  if (params.view) payloadObj.view = params.view;
  if (params.columnFilter) payloadObj.columnFilter = params.columnFilter;
  if (params.sorting) payloadObj.sorting = params.sorting;
  if (params.page) payloadObj.page = params.page;
  if (params.perPage) payloadObj.perPage = params.perPage;
  if (params.quickSearch) payloadObj.quickSearch = params.quickSearch;

  try {
    // const response = await api.get<ApiResponse<TableData>>(`${url}?payload=${payloadStr}`);
    return tableData as ApiResponse<TableData>;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Bulk Actions API
export async function bulkActionsApi(url: string, params: BulkActionApi) {
  try {
    const response = await api.patch(`${url}`, params, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error performing bulk actions:", error);
    throw error;
  }
}

// Delete User API
export const deleteApi = async (url: string,rowId: string) => {
  try {
    const response = await api.delete(`${url}?Id=${rowId}`);
    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// More Action API
export const moreActionApi = async (url: string, params: { rowId: string; action: string }) => {
  try {
    const response = await api.post(`${url}`, params, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error performing more action:", error);
    throw error;
  }
};

export const updateFavoriteStatus = async (favoriteState: boolean) => {
  try {
    const response = await api.patch('/api/user/preferences/favorite', {
      favorite_screens: favoriteState
    });
    return response.data;
  } catch (error) {
    console.error('Error updating favorite status:', error);
    throw error;
  }
};

export const updateView = async (url: string, view: string) => {
  try {
    const response = await api.patch(`${url}`, {
      view: view
    });
    return response.data;
  } catch (error) {
    console.error('Error updating view:', error);
    throw error;
  }
};
// below commened code is for real API call
// export async function fetchColumnData() {
//   try{
//     const response = await api.get(`/users-screen/user-columnheaders`);
//     return response.data
//   } catch(error) {
//     console.log("Error performing fetchColumnData", error);
//     throw error;
//   }
// }

export async function fetchMetaData(view?: string): Promise<TableMetadata> {
  try {
    // Simulating an API response using the mock data
    return metaData.data;
  } catch (error) {
    console.log("Error performing fetchColumnData", error);
    throw error;
  }
}

export const updateCellData = async ( url: string,data: { rowId: string; columnName: string; value: string | string[]; tableName?: string; associatedId?: string }) => {
  const response = await fetch(`${url}/${data.rowId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update cell");
  return response.json();
};


export const fetchDropDownData = async (queryString: string) => {
  try {
    const response = await api.get(`https://tourwebsite-backend-9b849485b804.herokuapp.com/users-screen/dropdown-data?${queryString}`,);
    return response.data;
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    throw error;
  }
}


