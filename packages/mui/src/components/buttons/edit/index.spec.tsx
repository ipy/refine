import React from "react";
import { Route, Routes } from "react-router-dom";
import { act, fireEvent, render, TestWrapper } from "@test";
import { EditButton } from "./";

describe("Edit Button", () => {
    const edit = jest.fn();

    beforeAll(() => {
        jest.spyOn(console, "warn").mockImplementation(jest.fn());
        jest.useFakeTimers();
    });

    it("should render button successfuly", async () => {
        const { container, getByText } = render(
            <EditButton onClick={() => edit()} />,
            {
                wrapper: TestWrapper({}),
            },
        );

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        getByText("Edit");
    });

    it("should render text by children", async () => {
        const { container, getByText } = render(
            <EditButton>refine</EditButton>,
            {
                wrapper: TestWrapper({}),
            },
        );

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        getByText("refine");
    });

    it("should render without text show only icon", async () => {
        const { container, queryByText } = render(<EditButton hideText />, {
            wrapper: TestWrapper({}),
        });

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        expect(queryByText("Edit")).not.toBeInTheDocument();
    });

    it("should be disabled when user not have access", async () => {
        const { container, getByText } = render(<EditButton>Edit</EditButton>, {
            wrapper: TestWrapper({
                accessControlProvider: {
                    can: () => Promise.resolve({ can: false }),
                },
            }),
        });

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        expect(getByText("Edit").closest("button")).toBeDisabled();
    });

    it("should be disabled when recordId not allowed", async () => {
        const { container, getByText } = render(
            <EditButton recordItemId="1">Edit</EditButton>,
            {
                wrapper: TestWrapper({
                    accessControlProvider: {
                        can: ({ params }) => {
                            if (params.id === "1") {
                                return Promise.resolve({ can: false });
                            }
                            return Promise.resolve({ can: true });
                        },
                    },
                }),
            },
        );

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        expect(getByText("Edit").closest("button")).toBeDisabled();
    });

    it("should skip access control", async () => {
        const { container, getByText } = render(
            <EditButton ignoreAccessControlProvider>Edit</EditButton>,
            {
                wrapper: TestWrapper({
                    accessControlProvider: {
                        can: () => Promise.resolve({ can: false }),
                    },
                }),
            },
        );

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        expect(getByText("Edit").closest("button")).not.toBeDisabled();
    });

    it("should successfully return disabled button custom title", async () => {
        const { container, getByText } = render(<EditButton>Edit</EditButton>, {
            wrapper: TestWrapper({
                accessControlProvider: {
                    can: () =>
                        Promise.resolve({
                            can: false,
                            reason: "Access Denied",
                        }),
                },
            }),
        });

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        expect(container).toBeTruthy();

        expect(getByText("Edit").closest("button")).toBeDisabled();
        expect(getByText("Edit").closest("button")?.getAttribute("title")).toBe(
            "Access Denied",
        );
    });

    it("should render called function successfully if click the button", async () => {
        const { getByText } = render(<EditButton onClick={() => edit()} />, {
            wrapper: TestWrapper({}),
        });

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        await act(async () => {
            fireEvent.click(getByText("Edit"));
        });

        expect(edit).toHaveBeenCalledTimes(1);
    });

    it("should redirect with custom route called function successfully if click the button", async () => {
        const { getByText } = render(
            <Routes>
                <Route
                    path="/:resource"
                    element={
                        <EditButton
                            resourceNameOrRouteName="custom-route-posts"
                            recordItemId={1}
                        />
                    }
                />
            </Routes>,
            {
                wrapper: TestWrapper({
                    resources: [
                        {
                            name: "posts",
                            options: { route: "custom-route-posts" },
                        },
                        { name: "posts" },
                    ],
                    routerInitialEntries: ["/posts"],
                }),
            },
        );

        await act(async () => {
            jest.advanceTimersToNextTimer(1);
        });

        await act(async () => {
            fireEvent.click(getByText("Edit"));
        });

        expect(window.location.pathname).toBe("/custom-route-posts/edit/1");
    });
});
