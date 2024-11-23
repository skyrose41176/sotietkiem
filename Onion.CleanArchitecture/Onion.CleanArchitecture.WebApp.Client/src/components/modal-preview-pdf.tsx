import { Button, Modal } from 'antd'
import React from 'react'

export const ModalPreviewPdf: React.FC<{
    visible: boolean,
    isImage: boolean,
    title: string,
    handleClose: () => void,
    previewImage: string | undefined
}> = ({
    visible,
    isImage,
    title,
    handleClose,
    previewImage
}) => {
        return (
            <Modal
                open={visible}
                title={title}
                footer={[
                    <Button key="close" onClick={handleClose}>
                        Close
                    </Button>,
                ]}
                onCancel={handleClose}
                style={
                    isImage
                        ? {
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            padding: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }
                        : { top: "0" }
                }
                width={isImage ? "auto" : "90vw"}
                height={isImage ? "auto" : "80vh"}
                centered={false}
            >
                {isImage ? (
                    <img
                        alt="example"
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                        }}
                        src={previewImage}
                    />
                ) : (
                    <iframe
                        title={title}
                        src={previewImage}
                        style={{ width: "100%", height: "calc(100vh - 40px)" }}
                    ></iframe>
                )}
            </Modal>
        )
    }
