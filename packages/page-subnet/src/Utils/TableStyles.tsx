import { styled } from 'styled-components';

export const TableWrapperWithTrHover = styled.div`
  position: relative;
  width: 100%;
  border-collapse: collapse !important;
  .tr-border {
    height: 70px;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      outline: 1px dotted rgba(34,36,38,.35);
      border-radius: 0.25rem;
      outline-offset: -0.05rem;
    }
    >td{
      text-align: start !important;
    }
  }
`;

export default TableWrapperWithTrHover; 