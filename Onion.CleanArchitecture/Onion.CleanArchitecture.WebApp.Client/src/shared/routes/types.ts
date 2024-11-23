
export interface IRoute {
  path: string
  fallback?: any
  resource?: string
  children?: IRouteChildren[]
}
interface IRouteChildren {
  index?: boolean
  path?: string
  action: string
  element: any
}