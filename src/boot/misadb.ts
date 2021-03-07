import { boot } from "quasar/wrappers";
import { MisaDB } from "src/common/misadb";

export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$misadb = new MisaDB("MisaDB");
});
