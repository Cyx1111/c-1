using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fly
{
    //战机
    public class Warcraft:Plane
    {
        public override void fly()
        {
            Console.WriteLine("战机保卫祖国领空！");
        }
    }
}
