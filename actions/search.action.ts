'use server';

import { ActionResponse } from "@/type/types";
import { SearchApiResponse, SearchService } from "@/services/SearchService";
import { withAccessToken } from "@/lib/auth-action";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function searchEntities(
    keyword: string,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
): Promise<ActionResponse<SearchApiResponse>> {
    const normalizedKeyword = keyword.trim();

    if (normalizedKeyword.length < 1 || normalizedKeyword.length > 100) {
        return {
            success: false,
            statusCode: 422,
            message: "keyword must be between 1 and 100 characters",
        };
    }

    const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : DEFAULT_PAGE;
    const normalizedLimit = Number.isFinite(limit)
        ? Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)))
        : DEFAULT_LIMIT;

    return withAccessToken(async (accessToken) => {
        const response = await SearchService.search(
            accessToken,
            normalizedKeyword,
            normalizedPage,
            normalizedLimit,
        );

        if (response.success) {
            return {
                success: true,
                statusCode: response.statusCode,
                message: "Search completed",
                data: response.data,
            };
        }

        return {
            success: false,
            statusCode: response.statusCode,
            message: response.message,
        };
    });
}
