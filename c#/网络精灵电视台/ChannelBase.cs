using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 网络精灵电视台
{
    //频道基类
    public abstract class ChannelBase
    {
        //频道名称
        public string  Channelname{ get; set; }
        //频道路径
        public string Path { get; set; }
        //节目列表，所有的节目
        public List<TvProgram>  Tvlist { get; set; }
        //获取频道列表，通过方法获取所有的节目列表
        public abstract void Fetch();
    }
}
