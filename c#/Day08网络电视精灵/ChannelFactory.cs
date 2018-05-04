using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Day08网络电视精灵
{
    public class ChannelFactory
    {
        public static ChannelBase getInstance(string type) 
        {
            ChannelBase channel = null;
            switch (type)
            {
                case "TypeA":
                    channel = new TypeAChannel();
                    break;
                case "TypeB":
                    channel = new TypeBChannel();
                    break;
                default:
                    break;
            }
            return channel;
        }
    }
}
