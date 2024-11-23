import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    headerTitle: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        fontWeight: "bold",
        borderBottom: "1px",
    },
    inputSuffix: {
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: token.colorBgTextHover,
        color: token.colorTextDisabled,
        borderRadius: "4px",
        fontSize: "12px",
    },
    inputPrefix: {
        color: token.colorTextPlaceholder,
        marginRight: "4px",
    },
    languageSwitchText: {
        color: token.colorTextSecondary,
    },
    languageSwitchIcon: {
        color: token.colorTextTertiary,
        width: "10px",
    },
    themeSwitch: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "32px",
        width: "32px",
        borderRadius: "50%",
        cursor: "pointer",
        backgroundColor: token.colorBgTextHover,
    },
    userName: {
        display: "flex !important",
        color: token.colorTextHeading,
        fontSize: "14px",
    },
    avatar: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: '20px',
    },
    titleAvatar: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    contentListConfigureFTP: {
        backgroundColor: "#f0f2f5",
        height: "100vh",
    },
    boxTableListConfigureFTP: {
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "white",
    },
    toolBox: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    customCardContent: {
        "& .ant-card-body": {
            paddingLeft: 10,
        },
    },
    customCardContentSider: {
        "& .ant-card-body": {
            padding: 0,
        },
    },
    paddingCardContent: {
        "& .ant-card-body": {
            padding: 24,
        },
    },
    collapse: {
        padding: "16px",
        paddingTop: 0,
        paddingBottom: 0,
    },
    collapseConfigureEditor: {
        borderRadius: 8,
        // marginTop: 20,
        backgroundColor: "#e6f7ff",
        padding: 0,
    },
    collapseConfigureInfo: {
        backgroundColor: "#e6f7ff",
        borderRadius: 8,
        marginTop: 20,
    },
    footerDrawer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "16px",
    },
    addPanel: {
        display: "flex",
        padding: "12px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        border: "1px solid #DDDDDD",
    },
    buttonSave: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "16px",
    },
    centered: {
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
        justifyContent: "space-between",
    },
}));
