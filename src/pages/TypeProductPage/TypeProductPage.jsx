import React from 'react'

import {  Col, Pagination, Row } from 'antd'
import {  WrapperProducts } from './style'
import CardComponet from '../../component/CardComponet/CardComponet'

const TypeProductPage = () => {
    const onChange= () => {}
    return (
        <div style={{ padding: '0 120px', background: '#efefef' }}>
            <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
               
                <Col span={24}> 
                    <WrapperProducts >
                      <CardComponet/>
                      <CardComponet/>
                    </WrapperProducts>
                    <Pagination defaultCurrent={2} total={100} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                </Col>
            </Row>
        </div>
    )
}

export default TypeProductPage