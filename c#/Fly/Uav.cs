using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fly
{
    //无人机
    public class Uav:Plane
    {
        public override void fly()
        {
            Console.WriteLine("无人机收集大气状况和风暴强度数据！");
        }
    }
}
