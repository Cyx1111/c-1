using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.第十章
{
    public abstract class Vehicle
    {
        public string Color { get; set; }//颜色
        public int Id { get; set; }//车牌号
        public string Name { get; set; }//车名
        public string Datatime { get; set; }//使用时间
        public string Datamoney{ get; set; }//日租金
        public string Rentuser{ get; set; }//租户

        public Vehicle()
        {}

        public Vehicle (string color,int id,string name,string datatime,string datamoney)
        {
            this.Color = color;
            this.Name = name;
            this.Datamoney = datamoney;
            this.Datatime = datatime;
            this.Id = id;
           
        }

       

         //public abstract string Money();
      
    }
}
