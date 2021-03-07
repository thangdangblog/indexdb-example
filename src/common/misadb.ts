import Dexie from "dexie";
export interface IMisaIndexedDB {
  initAllDB(): void;
  add(dbName: string, params: any): void;
  addList(dbName: string, arrParams: any): void;
  getAll(dbName: string): Promise<any>;
  getPagging(dbName: string, offset?: number, limit?: number): Promise<any>;
  where(dbName: string, whereClause: any): Promise<any>;
  find(dbName: string, whereClause: any): Promise<any>;
  search(
    dbName: string,
    fieldSearch: string,
    searchString: string,
    isUnsigned: boolean
  ): Promise<any>;
}

export class MisaDB extends Dexie {

    constructor(databaseName: string) {
        super(databaseName);
        this.initStore();
    }

  initStore (){
    this.version(1).stores({
      user: "id, name"
    });
  }

  // Thêm một bản ghi
  add(dbName: string, params: any) {
    return new Promise(async (resolve, reject) => {
      if (this[dbName]) {
        let result = await this[dbName].put(params);
        resolve(result);
      }
    });
  }

  // Thêm nhiều bản ghi
  addList(dbName: string, arrParams: any) {
    return new Promise(async (resolve, reject) => {
      if (this[dbName]) {
        for (let index = 0; index < arrParams.length; index++) {
          const params = arrParams[index];
          await this[dbName].put(params);
        }
        resolve(true);
      }
      resolve(false);
    });
  }

  // Lấy tất cả bản ghi
  getAll(dbName: string) {
    return new Promise(async (resolve, reject) => {
      if (this[dbName]) {
        let data = await this[dbName].toArray();
        resolve(data);
      } else {
        resolve([]);
      }
    });
  }

  // Lấy Pagging
  getPagging(dbName: string, offset = 0, limit = 10) {
    return new Promise(async (resolve, reject) => {
      if (this[dbName]) {
        let data = await this[dbName]
          .offset(offset)
          .limit(limit)
          .toArray();
        resolve(data);
      } else {
        resolve([]);
      }
    });
  }

  // Tìm kiếm theo like
  async search(
    dbName: string,
    fieldSearch: string,
    searchString: string,
    isUnsigned: boolean = false
  ) {
    return new Promise(async (resolve, reject) => {
      if (!this[dbName]) resolve([]);

      let indexDB = this[dbName];

      // Tìm chính xác
      let dataSearch = await indexDB.filter(item => {
        if (item[fieldSearch]) {
          let patt = new RegExp(`${searchString}`, "gmi");
          let valueInDB = item[fieldSearch];
          if (isUnsigned) {
              valueInDB = this.removeAccents(valueInDB);
              patt = new RegExp(`${this.removeAccents(searchString)}`, "gmi");
          }
          return patt.test(valueInDB);
        }
        return false;
      });
      resolve(dataSearch.toArray());
    });
  }

  where(dbName: string, whereClause: {}) {
    return new Promise(async (resolve, reject) => {
      if (!this[dbName]) resolve([]);

      let indexDB = this[dbName];

      // Tìm chính xác
      let dataSearch = await indexDB.where(whereClause);
      resolve(dataSearch.toArray());
    });
  }

  find(dbName: string, whereClause: {}) {
    return new Promise(async (resolve, reject) => {
      if (!this[dbName]) resolve([]);

      let indexDB = this[dbName];

      // Tìm chính xác
      let dataSearch = await indexDB.where(whereClause).first();
      resolve(dataSearch);
    });
  }

  removeAccents(str: string) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
}
