using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Physical
{
    class HealthCheckItem
    {
        //检查项目
        private string name;//项目名
        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        private string description;// 描述

        public string Description
        {
            get { return description; }
            set { description = value; }
        }
     
        private int price;//价格
        public int Price
        {
            get { return price; }
            set { price = value; }
        }

        public HealthCheckItem(){ }
        public HealthCheckItem(string name, int price, string description)
        {
            this.name = Name;
            this.price = Price;
            this.description = Description;
        }

        public static Dictionary<string, HealthCheckItem> ItemDic = new Dictionary<string, HealthCheckItem>()
        {
            {"身高",new HealthCheckItem{Name="身高",Description="用于测量身高",Price=10}},
            {"体重",new HealthCheckItem{Name="体重",Description="用于测量体重",Price=10,}},
            {"视力",new HealthCheckItem{Name="视力",Description="用于测量视力",Price=20,}},
            {"听力",new HealthCheckItem{Name="听力",Description="用于测量听力",Price=20,}},
            {"肝功能",new HealthCheckItem{Name="肝功能",Description="用于测量肝功能",Price=200,}},
            {"B超",new HealthCheckItem{Name="B超",Description="用于测量B超",Price=150,}},
            {"心电图",new HealthCheckItem{Name="心电图",Description="用于测量心电图",Price=230,}},
            {"肺活量",new HealthCheckItem{Name="肺活量",Description="用于测量肺活量",Price=120,}}
        };

    }
      
}
