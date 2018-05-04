using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class Ticket//电影父类
    {
        public Scheduleltem Scheduleltem { get; set; }//场次
        public Seat Seat { get; set; }//座位对象
        public int Price { get; set; }//票价
        //票价 信息 出售 虚方法
        public virtual string CalPrice()
        {
            return null;
        }

        public virtual string Print()
        {
            return null;
        }

        public virtual string Show()
        {
            return null;
        }
    }
}
