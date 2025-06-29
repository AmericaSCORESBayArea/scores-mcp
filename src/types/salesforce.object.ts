export interface SalesforceObject {
  mruEnabled: boolean
  updateable: boolean
  childRelationships: ChildRelationship[]
  recordTypeInfos: RecordTypeInfo[]
  deprecatedAndHidden: boolean
  searchLayoutable: boolean
  deletable: boolean
  replicateable: boolean
  actionOverrides: ActionOverride[]
  urlEdit: string
  mergeable: boolean
  feedEnabled: boolean
  compactLayoutable: boolean
  networkScopeFieldName: any
  customSetting: boolean
  urlDetail: string
  layoutable: boolean
  custom: boolean
  undeletable: boolean
  activateble: boolean
  label: string
  keyPrefix: string
  searchable: boolean
  namedLayoutInfos: any[]
  urlNew: string
  queryable: boolean
  createable: boolean
  retrieveable: boolean
  name: string
  fields: Field[]
  labelPlural: string
  triggerable: boolean
}

export interface ChildRelationship {
  deprecatedAndHidden: boolean
  junctionReferenceTo: any[]
  junctionIdListNames: any[]
  childSObject: string
  relationshipName?: string
  field: string
  cascadeDelete: boolean
}

export interface RecordTypeInfo {
  defaultRecordTypeMapping: boolean
  available: boolean
  master: boolean
  name: string
  id: string
}

export interface ActionOverride {
  fromFactor: any
  pageId: string
  url: string
  name: string
  availableInTouch: boolean
}

export interface Field {
  nullable: boolean
  defaultValue: any
  precision: number
  nameField: boolean
  required: boolean
  relationshipName?: string
  deprecateAndHidden: boolean
  controllerName: any
  namePointing: boolean
  defaultValueFormula?: string
  calculated: boolean
  writeRequiresMasterRead: boolean
  inlineHelpText?: string
  picklistValues: PicklistValue[]
  filterable: boolean
  maskType: any
  caseSensitive: boolean
  referenceTo: string[]
  unique: boolean
  name: string
  highScaleNumber: boolean
  fieldType: string
  idLookup: boolean
  displayLocationInDecimal: boolean
  defaultedOnCreate: boolean
  updateable: boolean
  searchFilterable: boolean
  byteLength: number
  scale: number
  permissinable: boolean
  polymorphicForeignKey: boolean
  htmlFormatted: boolean
  dependentPickList: boolean
  referenceTargetField: any
  mask: any
  relationshipOrder: number
  custom: boolean
  length: number
  label: string
  sortable: boolean
  filteredLookupInfo?: FilteredLookupInfo
  restrictedPicklist: boolean
  createable: boolean
  encrypted: boolean
  autonumber: boolean
  groupable: boolean
  extraTypeInfo?: string
  formula?: string
  digits: number
}

export interface PicklistValue {
  validFor: any
  defaultValue: boolean
  active: boolean
  label: string
  value: string
}

export interface FilteredLookupInfo {
  controllingFields: string[]
  optionalFilter: boolean
  dependent: boolean
}


export interface FilteredChildRelationship {
  childSObject: string
  relationshipName: string
  field: string
}

interface FilteredField {
  name: string
  fieldType: string
  picklistValues?: string[] | null
}

export type SalesforceObjectFiltered = {
    name: string
    fields: FilteredField[]
    childRelationships?: FilteredChildRelationship[] | null
}