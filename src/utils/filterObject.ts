import { SalesforceObject, SalesforceObjectFiltered, Field } from "@types";

export function filterSalesforceObject(obj: SalesforceObject): SalesforceObjectFiltered {
    return {
        name: obj.name,
        fields: obj.fields.map(f => ({
            name: f.name,
            fieldType: f.fieldType,
            picklistValues: f.picklistValues
        })),
        childRelationships: obj.childRelationships.map(cr => ({
            childSObject: cr.childSObject,
            relationshipName: cr.relationshipName,
            field: cr.field
        }))
    }
  }