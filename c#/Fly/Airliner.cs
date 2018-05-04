using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fly
{
    //客机
    public class Airliner:Plane
    {

        public override void fly()
        {
            Console.WriteLine("客机运输旅客！");
        }
    }
}
