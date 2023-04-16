import styled from "styled-components";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent.jsx";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 44px;

`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(253, 92, 50);
        span {
            color: #fff;
        }
    }
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`

export const WrapperProducts = styled.div`
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top:20px;
    flex-wrap: wrap;
`