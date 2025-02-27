import { renderHook } from "@testing-library/react-hooks";

import { TestWrapper } from "@test";

import { useDataGrid } from "./";
import { CrudFilters } from "@pankod/refine-core";
import { act } from "react-dom/test-utils";

describe("useDataGrid Hook", () => {
    it("controlled filtering with 'onSubmit' and 'onSearch'", async () => {
        type SearchVariables = { title: string; status: string };

        const { result, waitFor } = renderHook(
            () =>
                useDataGrid<any, any, SearchVariables>({
                    resource: "posts",
                    onSearch: (values) => {
                        const filters: CrudFilters = [];

                        filters.push(
                            {
                                field: "title",
                                operator: "contains",
                                value: values.title,
                            },
                            {
                                field: "status",
                                operator: "eq",
                                value: values.status,
                            },
                        );

                        return filters;
                    },
                }),
            {
                wrapper: TestWrapper({}),
            },
        );

        await waitFor(() => {
            return !result.current.tableQueryResult?.isLoading;
        });

        await act(async () => {
            result.current.search({ title: "test", status: "draft" });
        });

        expect(result.current.filters).toEqual([
            {
                field: "title",
                operator: "contains",
                value: "test",
            },
            {
                field: "status",
                operator: "eq",
                value: "draft",
            },
        ]);
        expect(result.current.current).toEqual(1);
    });

    it("with no pagination", async () => {
        const { result, waitFor } = renderHook(
            () =>
                useDataGrid<any, any>({
                    resource: "posts",
                    hasPagination: false,
                }),
            {
                wrapper: TestWrapper({}),
            },
        );

        await waitFor(() => {
            return !result.current.tableQueryResult?.isLoading;
        });

        expect(result.current.current).toBeUndefined();
        expect(result.current.pageSize).toBeUndefined();
        expect(result.current.pageCount).toBeUndefined();
    });
});
