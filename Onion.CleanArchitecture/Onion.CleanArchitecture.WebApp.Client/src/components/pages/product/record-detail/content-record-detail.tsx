import { IProduct } from "@routes/products";
import { Layout } from "antd";
import Discussion from "@components/discussion";
import ProductInfor from "./product-info";
const { Content } = Layout;
const ContentRecordDetail: React.FC<{
  productInfo: IProduct | undefined;
}> = ({ productInfo }) => {
  return (
    <Content style={{ marginRight: 5 }}>
      <ProductInfor productInfo={productInfo} />
      <Discussion info={productInfo} typeRoute={"PRODUCT"} />
    </Content >
  )
}
export default ContentRecordDetail
