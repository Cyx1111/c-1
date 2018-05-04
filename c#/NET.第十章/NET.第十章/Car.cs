using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.第十章
{

    public class Car : Vehicle
    {
        public Car()
        {
        }

        public Car(string color, string name,string datatime, int id, string datamoney) :
            base(color,id,name,datatime,datamoney)
        {
        }


       //public override string Money()
       //{
          
       //    //string money = Datatime  *  Datamoney;
       //    //return money;
       //}
    }
}