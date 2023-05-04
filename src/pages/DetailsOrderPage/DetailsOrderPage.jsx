import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'

import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../component/LoadingComponet/LoadingComponet'
import { useQuery } from 'react-query'

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state && state.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { isLoading, data } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data && data.orderItems && data.orderItems.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[data])
// console.log('data',data)
  return (
   <Loading isLoading={isLoading}>
     <div style={{width: '100%', height: '100vh', background: '#f5f5fa'}}>
      <div style={{ width: '1270px', margin: '0 auto'}}>
        <h4>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data && data.shippingAddress && data.shippingAddress.fullName}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${data && data.shippingAddress && data.shippingAddress.address} ${data && data.shippingAddress && data.shippingAddress.city}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data && data.shippingAddress && data.shippingAddress.phone}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {data && data.shippingPrice}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[data && data.paymentMethod]}</div>
              <div className='status-payment'>{data && data.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {data && data.orderItems && data.orderItems.map((order) => {
            return (
              <WrapperProduct>
                <WrapperNameProduct>
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
                    marginLeft: '10px',
                    height: '70px',
                  }}>{order && order.name}</div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order && order.price)}</WrapperItem>
                <WrapperItem>{order && order.amount}</WrapperItem>
                <WrapperItem>{order && order.discount ? convertPrice( priceMemo * order && order.discount / 100) : '0 VND'}</WrapperItem>
              </WrapperProduct>
            )
          })}

          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{convertPrice(data && data.shippingPrice)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem><WrapperItem>{convertPrice(data && data.totalPrice)}</WrapperItem></WrapperItem>
          </WrapperAllPrice>
          
          </WrapperStyleContent>
      </div>
    </div>
   </Loading>
  )
}

export default DetailsOrderPage