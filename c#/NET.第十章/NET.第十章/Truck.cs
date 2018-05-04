using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.第十章
{
    public class Truck : Vehicle
    {
        public int Load { get; set; }//装载量
        public  Truck(){}

        public Truck(string color, string name, string datatime, int id, string datamoney,int load) :
            base(color, id, name, datatime, datamoney)
        {
            this.Load = load;

        }
       
    }
}
