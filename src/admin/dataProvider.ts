import type { DataProvider, RaRecord } from "react-admin";
import { API_BASE } from "../services/types";

type AdminRecord = RaRecord & Record<string, unknown>;

const resourceEndpoints: Record<string, string> = {
  products: "products-admin",
  posts: "posts-admin",
  categories: "categories",
};

class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken() {
  return localStorage.getItem("admin_token");
}

async function requestJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}/${url}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? "detail" in data &&
          data.detail &&
          typeof data.detail === "object" &&
          "message" in data.detail
          ? String(data.detail.message)
          : "message" in data
            ? String(data.message)
            : response.statusText
        : response.statusText;
    throw new ApiError(message || "Request failed", response.status);
  }
  return data as T;
}

function endpointFor(resource: string) {
  const endpoint = resourceEndpoints[resource];
  if (!endpoint) {
    throw new Error(`Unsupported admin resource: ${resource}`);
  }
  return endpoint;
}

async function fetchRecords(resource: string): Promise<AdminRecord[]> {
  const response = await requestJson<unknown>(endpointFor(resource));
  if (!Array.isArray(response)) {
    throw new Error(`Expected a list of ${resource} from the API`);
  }
  return response as AdminRecord[];
}

function applyListParams(
  records: AdminRecord[],
  params: {
    filter?: Record<string, unknown>;
    pagination: { page: number; perPage: number };
    sort: { field: string; order: string };
  },
) {
  const filter = params.filter ?? {};
  const query = String(filter.q ?? "")
    .trim()
    .toLocaleLowerCase();
  const filtered = records.filter((record) => {
    if (
      query &&
      !["title", "slug", "sku", "excerpt"].some((field) =>
        String(record[field] ?? "")
          .toLocaleLowerCase()
          .includes(query),
      )
    ) {
      return false;
    }
    return Object.entries(filter).every(([field, value]) => {
      if (field === "q" || value === undefined || value === null || value === "") {
        return true;
      }
      return String(record[field] ?? "")
        .toLocaleLowerCase()
        .includes(String(value).toLocaleLowerCase());
    });
  });

  const direction = params.sort.order === "DESC" ? -1 : 1;
  const sorted = [...filtered].sort((left, right) => {
    const first = left[params.sort.field];
    const second = right[params.sort.field];
    if (typeof first === "number" && typeof second === "number") {
      return (first - second) * direction;
    }
    return (
      String(first ?? "").localeCompare(String(second ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      }) * direction
    );
  });

  const start = (params.pagination.page - 1) * params.pagination.perPage;
  return {
    data: sorted.slice(start, start + params.pagination.perPage),
    total: filtered.length,
  };
}

async function updateRecord(
  resource: string,
  id: string | number,
  data: Record<string, unknown>,
) {
  return requestJson<AdminRecord>(
    `${endpointFor(resource)}/${encodeURIComponent(String(id))}`,
    { method: "PUT", body: JSON.stringify(data) },
  );
}

async function deleteRecord(resource: string, id: string | number) {
  await requestJson<unknown>(
    `${endpointFor(resource)}/${encodeURIComponent(String(id))}`,
    { method: "DELETE" },
  );
  return { id };
}

export const dataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord>(resource, params) => {
    const records = await fetchRecords(resource);
    const result = applyListParams(records, params);
    return { data: result.data as RecordType[], total: result.total };
  },
  getOne: async <RecordType extends RaRecord>(resource, params) => {
    const records = await fetchRecords(resource);
    const record = records.find(
      (item) => String(item.id) === String(params.id),
    );
    if (!record) {
      throw new ApiError(`${resource} ${params.id} was not found`, 404);
    }
    return { data: record as RecordType };
  },
  getMany: async <RecordType extends RaRecord>(resource, params) => {
    const ids = new Set(params.ids.map(String));
    const records = await fetchRecords(resource);
    return {
      data: records.filter((record) => ids.has(String(record.id))) as RecordType[],
    };
  },
  getManyReference: async <RecordType extends RaRecord>(resource, params) => {
    const records = await fetchRecords(resource);
    const related = records.filter(
      (record) => String(record[params.target]) === String(params.id),
    );
    const result = applyListParams(related, params);
    return { data: result.data as RecordType[], total: result.total };
  },
  create: async <
    RecordType extends Omit<RaRecord, "id"> = Omit<RaRecord, "id">,
    ResultRecordType extends RaRecord = RecordType & { id: RaRecord["id"] },
  >(resource, params) => {
    const record = await requestJson<AdminRecord>(endpointFor(resource), {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    return { data: { ...record, id: record.id } as ResultRecordType };
  },
  update: async (resource, params) => {
    const record = await updateRecord(resource, params.id, params.data);
    return {
      data: {
        ...params.previousData,
        ...record,
        ...params.data,
        id: params.id,
      },
    };
  },
  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) => updateRecord(resource, id, params.data)),
    );
    return { data: params.ids };
  },
  delete: async <RecordType extends RaRecord>(resource, params) => ({
    data: (await deleteRecord(resource, params.id)) as RecordType,
  }),
  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => deleteRecord(resource, id)));
    return { data: params.ids };
  },
};
