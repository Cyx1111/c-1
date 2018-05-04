using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class  StudentTicket:Ticket
    {
        public int  Discount { get; set; }//折扣

        //票价 信息 出售
        public override string CalPrice()
        {
            return null;
        }

        public override string Print()
        {
            return null;
        }

        public override string Show()
        {
            return null;
        }
    }
}
