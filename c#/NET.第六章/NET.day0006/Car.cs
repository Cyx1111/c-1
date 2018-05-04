using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day0006
{
      public class Car
    {
        public string  Xing { get; set; }//型号
        public string Address { get; set; }//产地

        public Car(string  xing,string address)//构造
        {
            this.Address = address;
            this.Xing = xing;
        }

        public void CarRun()//方法
        {
            Console.WriteLine("汽车正在行驶");
        }

    }
}
