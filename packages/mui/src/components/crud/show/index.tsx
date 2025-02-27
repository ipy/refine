import React from "react";
import {
    useNavigation,
    useResourceWithRoute,
    useRouterContext,
    useTranslate,
    ResourceRouterParams,
    userFriendlyResourceName,
    BaseKey,
} from "@pankod/refine-core";

import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    Box,
    CardProps,
    CardHeaderProps,
    CardContentProps,
    CardActionsProps,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    DeleteButton,
    RefreshButton,
    ListButton,
    EditButton,
    Breadcrumb,
} from "@components";

export interface ShowProps {
    canEdit?: boolean;
    canDelete?: boolean;
    actionButtons?: React.ReactNode;
    isLoading?: boolean;
    resource?: string;
    recordItemId?: BaseKey;
    cardProps?: CardProps;
    cardHeaderProps?: CardHeaderProps;
    cardContentProps?: CardContentProps;
    cardActionsProps?: CardActionsProps;
    breadcrumb?: React.ReactNode;
    dataProviderName?: string;
}

/**
 * `<Show>` provides us a layout for displaying the page.
 * It does not contain any logic but adds extra functionalities like a refresh button.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/mui/components/basic-views/show} for more details.
 */
export const Show: React.FC<ShowProps> = ({
    canEdit,
    canDelete,
    actionButtons,
    isLoading = false,
    children,
    resource: resourceFromProps,
    recordItemId,
    cardProps,
    cardHeaderProps,
    cardContentProps,
    cardActionsProps,
    breadcrumb = <Breadcrumb />,
    dataProviderName,
}) => {
    const translate = useTranslate();

    const { goBack, list } = useNavigation();

    const resourceWithRoute = useResourceWithRoute();

    const { useParams } = useRouterContext();

    const {
        resource: routeResourceName,
        action: routeFromAction,
        id: idFromRoute,
    } = useParams<ResourceRouterParams>();

    const resource = resourceWithRoute(resourceFromProps ?? routeResourceName);

    const isDeleteButtonVisible = canDelete ?? resource.canDelete;

    const isEditButtonVisible = canEdit ?? resource.canEdit;

    const id = recordItemId ?? idFromRoute;

    return (
        <Card {...cardProps}>
            {breadcrumb}
            <CardHeader
                sx={{ display: "flex", flexWrap: "wrap" }}
                title={
                    <Typography variant="h5">
                        {translate(
                            `${resource.name}.titles.show`,
                            `Show ${userFriendlyResourceName(
                                resource.label ?? resource.name,
                                "singular",
                            )}`,
                        )}
                    </Typography>
                }
                avatar={
                    <IconButton onClick={routeFromAction ? goBack : undefined}>
                        <ArrowBackIcon />
                    </IconButton>
                }
                action={
                    <Box display="flex" gap="16px">
                        {!recordItemId && (
                            <ListButton
                                data-testid="show-list-button"
                                resourceNameOrRouteName={resource.route}
                            />
                        )}
                        {isEditButtonVisible && (
                            <EditButton
                                disabled={isLoading}
                                data-testid="show-edit-button"
                                resourceNameOrRouteName={resource.route}
                                recordItemId={id}
                            />
                        )}
                        {isDeleteButtonVisible && (
                            <DeleteButton
                                resourceNameOrRouteName={resource.route}
                                data-testid="show-delete-button"
                                recordItemId={id}
                                onSuccess={() =>
                                    list(resource.route ?? resource.name)
                                }
                                dataProviderName={dataProviderName}
                            />
                        )}
                        <RefreshButton
                            resourceNameOrRouteName={resource.route}
                            recordItemId={id}
                            dataProviderName={dataProviderName}
                        />
                    </Box>
                }
                {...cardHeaderProps}
            />
            <CardContent {...cardContentProps}>{children}</CardContent>
            <CardActions sx={{ padding: "16px" }} {...cardActionsProps}>
                {actionButtons ? actionButtons : null}
            </CardActions>
        </Card>
    );
};
