using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 网络精灵电视台
{
    //节目类
   public  class TvProgram
    {
        //播出时间
        public DateTime Playtime { get; set; }
        //播出时间段
        public string Shiduan { get; set; }
        public string Name { get; set; }
        //地址
        public string Path { get; set; }
    }
}
