using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fly
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Plane> list = new List<Plane>();
            Plane p1 = new Airliner();
            Plane p2 = new Warcraft();
            Plane p3 = new Uav();
            list.Add(p1);
            list.Add(p2);
            list.Add(p3);
            Console.WriteLine("飞行器在天空自由飞翔\n");
            foreach (var item in list)
            {
                item.fly();
            }
            Console.ReadKey();
        }
    }
}
