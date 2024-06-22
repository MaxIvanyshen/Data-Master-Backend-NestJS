
export class SqlQueryConstructor {
    public static makeSelectionQueryStr(query: any, table: string): string  {
        let queryStr = `SELECT * FROM ${table} WHERE `;
        const keys = Object.keys(query);
        if(keys.length != 0) {
            for (let i = 0; i < keys.length; i++) {
                queryStr += `${keys[i]} = '${query[keys[i]]}'`;
                if(i < keys.length - 1)
                    queryStr += ' AND ';
                else 
                    queryStr += ';';
            }
            return queryStr;
        }
        return `SELECT * FROM ${table};`; 
    }

    public static makeInsertionQueryStr(query: any, table: string): string {
        let queryStr = `INSERT INTO ${table}(`;
        const keys = Object.keys(query);
        for(let i = 0; i < keys.length; i++) {
          queryStr += keys[i];
          if(i < keys.length - 1)
            queryStr += ', ';
          else 
            queryStr += ') VALUES (';
        }
        for(let i = 0; i < keys.length; i++) {
          queryStr += `'${query[keys[i]]}'`;
          if(i < keys.length - 1)
            queryStr += ', ';
          else 
            queryStr += ');';
        }
        return queryStr;
    }

    public static makeUpdateQueryStr(query: any, data: any, table: string): string {
        let queryStr = `UPDATE ${table} SET `;
        const dataKeys = Object.keys(data);
        for (let i = 0; i < dataKeys.length; i++) {
          queryStr += `${dataKeys[i]} = '${data[dataKeys[i]]}'`;
          if(i < dataKeys.length - 1)
            queryStr += ', ';
          else 
            queryStr += ' WHERE ';
        }
        const queryKeys = Object.keys(query);
        for (let i = 0; i < queryKeys.length; i++) {
          queryStr += `${queryKeys[i]} = '${query[queryKeys[i]]}'`;
          if(i < queryKeys.length - 1)
            queryStr += ' AND ';
          else 
            queryStr += ';';
        }
        return queryStr;
    }

    public static makeDeletionQueryStr(query: any, table: string): string {
        let queryStr = `DELETE FROM ${table} WHERE `;
        const keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
          queryStr += `${keys[i]} = '${query[keys[i]]}'`;
          if(i < keys.length - 1)
            queryStr += ' AND ';
          else 
            queryStr += ';';
        }
        return queryStr; 
    }
}
