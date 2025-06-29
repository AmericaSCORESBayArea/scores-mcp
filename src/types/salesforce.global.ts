
export interface SalesforceGlobal {
    maxBatchSize: number
    encoding: string
    sobjects: Sobject[]
  }
  
  export interface Sobject {
    mruEnabled: boolean
    updateable: boolean
    activateable: boolean
    deprecatedAndHidden: boolean
    layoutable: boolean
    custom: boolean
    deletable: boolean
    replicateable: boolean
    label: string
    keyPrefix?: string
    searchable: boolean
    queryable: boolean
    mergeable: boolean
    createable: boolean
    feedEnabled: boolean
    retrieveable: boolean
    undeleteable: boolean
    name: string
    customSetting: boolean
    labelPlural: string
    triggerable: boolean
  }

 export interface SalesforceGlobalFiltered {
    sobjects: string[]
 }

