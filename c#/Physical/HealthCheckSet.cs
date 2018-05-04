using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Physical
{
    class HealthCheckSet
    {
        //体检套餐
        public string Price { get; set; }//套餐价格

        private string name;//套餐名称
        public string Name
        {
            get { return name; }
            set { name = value; }
        }
        //HealthCheckItem的集合,采用泛型集合List<T>作为储存HealthCheckItem的数据结构
        public List<HealthCheckItem> ItemList = new List<HealthCheckItem>();
        public static Dictionary<string, List<HealthCheckItem>> SetDic = new Dictionary<string, List<HealthCheckItem>>();
        public HealthCheckSet()
        {
            this.ItemList = new List<HealthCheckItem>();
            ItemList.Add(HealthCheckItem.ItemDic["身高"]);
            ItemList.Add(HealthCheckItem.ItemDic["体重"]);
            ItemList.Add(HealthCheckItem.ItemDic["视力"]);
            SetDic.Add("入学体检", this.ItemList);
        }
        public HealthCheckSet(string name)
        {
            SetDic.Add(name, this.ItemList);
        }
        public static void DicAdd(List<HealthCheckItem> list, string str)
        {
            list.Add(HealthCheckItem.ItemDic[str]);
        }

    }
}
