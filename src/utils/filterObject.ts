import { SalesforceObject, SalesforceObjectFiltered, Field } from "@types";

export function filterSalesforceObject(obj: SalesforceObject): SalesforceObjectFiltered {
    const result: any = {
        name: obj.name,
        fields: obj.fields.map(f => ({
            name: f.name,
            fieldType: f.fieldType,
            ...(f.picklistValues?.length > 0 && { picklistValues: f.picklistValues.map(pv => pv.value) })
        }))
    };
    if (obj.childRelationships.length > 0) {
        result.childRelationships = obj.childRelationships.map(cr => ({
            childSObject: cr.childSObject,
            relationshipName: cr.relationshipName || '',
            field: cr.field
        }));
    }
    return result;
}