using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day0006
{
    public class Truck:Car
    {
        public Truck(string address, string xing):base(xing,address){}

        public void Run()
        {
            Console.WriteLine(string .Format("型号为{0},产地为{1}的卡车正在行驶",this.Address,this.Xing));
        }
    }

}
