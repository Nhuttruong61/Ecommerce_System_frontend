import React from 'react'

import {  Col, Pagination, Row } from 'antd'
import {  WrapperProducts } from './style'
import CardComponet from '../../component/CardComponet/CardComponet'

const TypeProductPage = () => {
    const onChange= () => {}
    return (
        <div style={{ width: '100%', background: '#efefef' }}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
                    <Col span={24}>
                        <WrapperProducts >
                            <CardComponet />
                            <CardComponet />
                            <CardComponet />
                            <CardComponet />
                            <CardComponet />
                            <CardComponet />
                            <CardComponet />
                        </WrapperProducts>
                        <Pagination defaultCurrent={2} total={100} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default TypeProductPage