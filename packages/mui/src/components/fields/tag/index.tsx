import React, { ReactNode } from "react";

import { Chip, ChipProps } from "@mui/material";

import { FieldProps } from "src/interfaces/field";

export type TagFieldProps = FieldProps<ReactNode> & ChipProps;

/**
 * This field lets you display a value in a tag. It uses Material UI {@link https://mui.com/material-ui/react-chip/#main-content `<Chip>`} component.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/mui/components/fields/tag} for more details.
 */
export const TagField: React.FC<TagFieldProps> = ({ value, ...rest }) => {
    return <Chip label={value?.toString()} {...rest} />;
};
