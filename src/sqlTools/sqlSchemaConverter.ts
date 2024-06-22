export class SchemaConverter {
    public static convert(schema: any): any {
        let result: any = {};
        this.convertDataTypes(schema);
        for(let i = 0; i < schema.length; i++) {
            result[schema[i].column_name] = {
                type: schema[i].data_type,
                required: true
            }
        }
        return result;
    }

    private static convertDataTypes(schema: any): any {
        for(let i = 0; i < schema.length; i++) {
            if(schema[i].data_type == 'integer') {
                schema[i].data_type = "Number";
            }
            else if(schema[i].data_type == 'character varying' || schema[i].data_type == 'text' || schema[i].data_type == 'varchar') {
                schema[i].data_type = "String";
            }
        }
    }
}
