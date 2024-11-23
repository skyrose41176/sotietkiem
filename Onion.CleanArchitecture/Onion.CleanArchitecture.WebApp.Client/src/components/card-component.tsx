import { Card } from 'antd'
import React, { ReactNode } from 'react'
interface CardComponentProps {
  title: ReactNode | string,
  extra?: any,
  className: string,
  style?: any,
  cover?: any
  bordered?: boolean
}
export const CardComponent: React.FC<React.PropsWithChildren<CardComponentProps>> =
  ({ title, extra, className, children, style, cover, bordered }) => {
    return (
      <Card bordered={bordered} title={title} className={className} extra={extra} style={style} hoverable cover={cover}>
        {children}
      </Card>
    )
  }
