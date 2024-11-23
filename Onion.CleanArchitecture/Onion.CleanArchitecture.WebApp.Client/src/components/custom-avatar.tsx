import { FC, memo } from "react";

import type { AvatarProps } from "antd";
import { Avatar as AntdAvatar, Avatar } from "antd";

import { getNameInitials, getRandomColorFromString } from "@utilities/index";
import { AvatarSize } from "antd/es/avatar/AvatarContext";

type Props = AvatarProps & {
    name?: string;
    sizeAvatar?: AvatarSize;
};

const CustomAvatarComponent: FC<Props> = ({ name = "", sizeAvatar, style, ...rest }) => {
    return (
        <>
            <Avatar
                style={{
                    backgroundColor: getRandomColorFromString(name),
                    verticalAlign: 'middle',
                    position: 'absolute',
                }}
                size={sizeAvatar || 'default'} >
                {getNameInitials(name)}
            </Avatar>
            <AntdAvatar
                alt={name}
                size={sizeAvatar || 'default'}
                style={{
                    backgroundColor: rest?.src
                        ? "transparent"
                        : getRandomColorFromString(name),
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                    ...style,
                }}
                {...rest}
            >
                {getNameInitials(name)}
            </AntdAvatar>
        </>

    );
};

export const CustomAvatar = memo(
    CustomAvatarComponent,
    (prevProps, nextProps) => {
        return (
            prevProps.name === nextProps.name && prevProps.src === nextProps.src
        );
    },
);
