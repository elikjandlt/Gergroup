import { gql } from "@apollo/client";

export type Deal = {
  _id: string;
  name?: string;
  stageId?: string;
  startDate?: string;
  closeDate?: string;
  description?: string;
  status?: string;
  productsData?: DealProductData[];
  paymentsData?: unknown;
  createdAt?: string;
};

export const CP_DEALS = gql`
  query cpDeals(
    $pipelineId: String
    $customerIds: [String]
    $startDate: Date
    $endDate: Date
    $limit: Int
    $cursor: String
  ) {
    cpDeals(
      pipelineId: $pipelineId
      customerIds: $customerIds
      startDate: $startDate
      endDate: $endDate
      limit: $limit
      cursor: $cursor
    ) {
      list {
        _id
        name
        stageId
        startDate
        closeDate
        status
        description
        productsData
        createdAt
      }
      totalCount
    }
  }
`;

export type CpDealsVariables = {
  pipelineId?: string;
  customerIds?: string[];
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
};

export type DealProductData = {
  productId?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
};

export type CpDealsData = {
  cpDeals: {
    list: Deal[];
    totalCount: number;
  };
};

export const CP_DEAL_DETAIL = gql`
  query cpDealDetail($_id: String!, $clientPortalCard: Boolean) {
    cpDealDetail(_id: $_id, clientPortalCard: $clientPortalCard) {
      _id
      name
      stageId
      startDate
      closeDate
      description
      status
      productsData
      paymentsData
    }
  }
`;

export type CpDealDetailVariables = {
  _id: string;
  clientPortalCard?: boolean;
};

export type CpDealDetailData = {
  cpDealDetail: Deal | null;
};
