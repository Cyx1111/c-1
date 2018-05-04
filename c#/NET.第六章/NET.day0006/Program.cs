                                                                                                                     using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day0006
{
    class Program
    {
        static void Main(string[] args)
        {
            Truck t = new Truck("奥迪A6", "德国");
            t.CarRun();
            t.Run();
            Console.ReadLine();
        }
    }
}
