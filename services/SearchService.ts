import "server-only";

import { ServiceResponse } from "@/type/types";

export interface SearchApiResult {
    entity_id: string;
    entity_type: string;
    project_id: number | null;
    title: string;
    rank: number;
}

export interface SearchApiResponse {
    keyword: string;
    total: number;
    page: number;
    total_pages: number;
    results: SearchApiResult[];
}

interface SearchValidationError {
    detail?: Array<{
        loc?: Array<string | number>;
        msg?: string;
        type?: string;
    }>;
}

export class SearchService {
    private static readonly baseUrl = process.env.BACKEND_DOMAIN ?? "http://localhost:8010";

    public static async search(
        token: string,
        keyword: string,
        page = 1,
        limit = 20,
    ): Promise<ServiceResponse<SearchApiResponse>> {
        try {
            const params = new URLSearchParams({
                keyword,
                page: String(page),
                limit: String(limit),
            });

            const response = await fetch(`${this.baseUrl}/api/v1/search/?${params.toString()}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data: SearchApiResponse = await response.json();
                return {
                    success: true,
                    statusCode: response.status,
                    data,
                };
            }

            if (response.status === 422) {
                const errorData: SearchValidationError = await response.json();
                const details = errorData.detail ?? [];
                const message = details
                    .map((item) => {
                        const path = Array.isArray(item.loc) ? item.loc.join(".") : "field";
                        return `${path}: ${item.msg ?? "Invalid value"}`;
                    })
                    .join("; ");

                return {
                    success: false,
                    statusCode: 422,
                    message: message || "Validation error while searching",
                };
            }

            const fallback = await response.json().catch(() => null);
            return {
                success: false,
                statusCode: response.status,
                message:
                    fallback?.message ||
                    fallback?.detail ||
                    `Search request failed with status ${response.status}`,
            };
        } catch (error) {
            console.error("Search service error:", error);
            return {
                success: false,
                statusCode: 500,
                message: "Unable to complete search at this time",
            };
        }
    }
}
