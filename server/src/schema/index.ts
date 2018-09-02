import { GraphQLResolveInfo } from 'graphql';
/**
 * This file is auto-generated by graphql-schema-typescript
 * Please note that any changes in this file may be overwritten
 */

/* tslint:disable */ 
/*******************************
 *                             *
 *          TYPE DEFS          *
 *                             *
 *******************************/
export interface GQLQuery {
  listAccounts: GQLData;
}

export interface GQLData {
  data?: string;
}

export interface GQLMutation {
  executeWeb3: GQLData;
  compileContract: GQLData;
  unlockAccount: boolean;
  deployContract: GQLData;
}

/*********************************
 *                               *
 *         TYPE RESOLVERS        *
 *                               *
 *********************************/
/**
 * This interface define the shape of your resolver
 * Note that this type is designed to be compatible with graphql-tools resolvers
 * However, you can still use other generated interfaces to make your resolver type-safed
 */
export interface GQLResolver {
  Query?: GQLQueryTypeResolver;
  Data?: GQLDataTypeResolver;
  Mutation?: GQLMutationTypeResolver;
}
export interface GQLQueryTypeResolver<TParent = any> {
  listAccounts?: QueryToListAccountsResolver<TParent>;
}

export interface QueryToListAccountsArgs {
  web3Address: string;
}
export interface QueryToListAccountsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: QueryToListAccountsArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLDataTypeResolver<TParent = any> {
  data?: DataToDataResolver<TParent>;
}

export interface DataToDataResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLMutationTypeResolver<TParent = any> {
  executeWeb3?: MutationToExecuteWeb3Resolver<TParent>;
  compileContract?: MutationToCompileContractResolver<TParent>;
  unlockAccount?: MutationToUnlockAccountResolver<TParent>;
  deployContract?: MutationToDeployContractResolver<TParent>;
}

export interface MutationToExecuteWeb3Args {
  web3Address: string;
  command: string;
}
export interface MutationToExecuteWeb3Resolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToExecuteWeb3Args, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToCompileContractArgs {
  contract: string;
  web3Address: string;
}
export interface MutationToCompileContractResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToCompileContractArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToUnlockAccountArgs {
  web3Address: string;
  mainAccount: string;
  mainAccountPass: string;
}
export interface MutationToUnlockAccountResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToUnlockAccountArgs, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationToDeployContractArgs {
  contract?: string;
  contractName?: string;
  alreadyDeployed: boolean;
  abi?: string;
  deployedContractAddress?: string;
  web3Address: string;
  mainAccount?: string;
  mainAccountPass?: string;
  gas?: number;
  contractArguments?: string;
}
export interface MutationToDeployContractResolver<TParent = any, TResult = any> {
  (parent: TParent, args: MutationToDeployContractArgs, context: any, info: GraphQLResolveInfo): TResult;
}
