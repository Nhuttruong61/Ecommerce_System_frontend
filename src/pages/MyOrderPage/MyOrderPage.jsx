import React from "react";
import * as OrderService from '../../services/OrderService'
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperListOrder, WrapperStatus } from "./style";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";


const MyOrderPage = () => {
  const user = useSelector((state) => state.user)
  const fetchMyOrder = async () => {
    if(user && user.id && user && user.access_token) {
      const res = await OrderService.getOrderByUserId(user && user.id, user && user.access_token)
      return res.data
    }
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: user && user.id && user && user.access_token
  })
  const { isLoading, data } = queryOrder
  console.log('data', data)
  return (
    <Loading isLoading={isLoading}>
      <WrapperContainer>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data && data.orderItems && data.orderItems.map((order) => {

              return (
                <WrapperItemOrder key={order && order._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</div>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán:</span>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                  <WrapperHeaderItem> 
                    <img src={order && order.image} 
                      style={{
                        width: '70px', 
                        height: '70px', 
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                      }}
                    />
                    <div style={{
                      width: 260,
                      overflow: 'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap',
                      marginLeft: '10px'
                    }}>{order && order.name}</div>
                    <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order && order.price)}</span>
                  </WrapperHeaderItem>
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(data && data.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                        // onClick={() => handleAddCard()}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(11, 116, 229)',
                            borderRadius: '4px'
                        }}
                        textbutton={'Hủy đơn hàng'}
                        styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        // onClick={() => handleAddCard()}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(11, 116, 229)',
                            borderRadius: '4px'
                        }}
                        textbutton={'Xem chi tiết'}
                        styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}
export default MyOrderPage;
