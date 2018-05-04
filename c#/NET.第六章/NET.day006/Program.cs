using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day006
{
    class Program
    {
        static void Main(string[] args)
        {
            Child ch = new Child("骚猪",20,"海淀");
            Console.WriteLine(ch.Name);
            Console.WriteLine(ch.Score);
            Console.WriteLine(ch.Homeaddress);
        }
    }
}
