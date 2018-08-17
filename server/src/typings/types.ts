/* tslint:disable */
import { GraphQLResolveInfo } from "graphql";

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
  parent?: Parent,
  args?: Args,
  context?: Context,
  info?: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionResolver<
  Result,
  Parent = any,
  Context = any,
  Args = any
> = {
  subscribe<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent?: P,
    args?: Args,
    context?: Context,
    info?: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
};

export interface Query {
  listAccounts: ContractData;
}

export interface ContractData {
  data: string;
}

export interface Mutation {
  compileContract: ContractData;
  unlockAccount: boolean;
  deployContract: ContractData;
}
export interface ListAccountsQueryArgs {
  web3Address: string;
}
export interface CompileContractMutationArgs {
  contract: string;
}
export interface UnlockAccountMutationArgs {
  web3Address: string;
  mainAccount: string;
  mainAccountPass: string;
}
export interface DeployContractMutationArgs {
  contract: string;
  contractName: string;
  web3Address: string;
  mainAccount?: string | null;
  mainAccountPass: string;
  gas?: number | null;
  contractArguments?: string | null;
}

export namespace QueryResolvers {
  export interface Resolvers<Context = any> {
    listAccounts?: ListAccountsResolver<ContractData, any, Context>;
  }

  export type ListAccountsResolver<
    R = ContractData,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ListAccountsArgs>;
  export interface ListAccountsArgs {
    web3Address: string;
  }
}

export namespace ContractDataResolvers {
  export interface Resolvers<Context = any> {
    data?: DataResolver<string, any, Context>;
  }

  export type DataResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = any> {
    compileContract?: CompileContractResolver<ContractData, any, Context>;
    unlockAccount?: UnlockAccountResolver<boolean, any, Context>;
    deployContract?: DeployContractResolver<ContractData, any, Context>;
  }

  export type CompileContractResolver<
    R = ContractData,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, CompileContractArgs>;
  export interface CompileContractArgs {
    contract: string;
  }

  export type UnlockAccountResolver<
    R = boolean,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, UnlockAccountArgs>;
  export interface UnlockAccountArgs {
    web3Address: string;
    mainAccount: string;
    mainAccountPass: string;
  }

  export type DeployContractResolver<
    R = ContractData,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DeployContractArgs>;
  export interface DeployContractArgs {
    contract: string;
    contractName: string;
    web3Address: string;
    mainAccount?: string | null;
    mainAccountPass: string;
    gas?: number | null;
    contractArguments?: string | null;
  }
}
